from fastapi import FastAPI, HTTPException, Depends, status, Header, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, StreamingResponse
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo import ASCENDING, DESCENDING
from bson import ObjectId
from datetime import datetime, timezone, timedelta
from typing import Optional, List, Any, Annotated, Dict
from pydantic import BaseModel, Field, BeforeValidator
import os
import hashlib
import secrets
import string
from jose import JWTError, jwt
from passlib.context import CryptContext
import httpx
import io
import json
import re
import asyncio
from dotenv import load_dotenv
load_dotenv()

# ── env ──────────────────────────────────────────────────────────────────────
MONGO_URL = os.environ["MONGO_URL"]
DB_NAME = os.environ["DB_NAME"]
JWT_SECRET = os.environ["JWT_SECRET"]
JWT_ALGORITHM = os.environ.get("JWT_ALGORITHM", "HS256")
JWT_EXPIRE_HOURS = int(os.environ.get("JWT_EXPIRE_HOURS", 24))
WEATHER_API_KEY = os.environ.get("WEATHER_API_KEY", "")

# ── app ───────────────────────────────────────────────────────────────────────
app = FastAPI(title="CoreGuard SMS API", version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

pwd_ctx = CryptContext(schemes=["bcrypt"], deprecated="auto")

# ── WebSocket Connection Manager ──────────────────────────────────────────────
class ConnectionManager:
    def __init__(self):
        self.connections: Dict[str, List[WebSocket]] = {}  # org_id -> [ws]

    async def connect(self, websocket: WebSocket, org_id: str):
        await websocket.accept()
        if org_id not in self.connections:
            self.connections[org_id] = []
        self.connections[org_id].append(websocket)

    def disconnect(self, websocket: WebSocket, org_id: str):
        if org_id in self.connections:
            self.connections[org_id] = [c for c in self.connections[org_id] if c != websocket]

    async def broadcast_to_org(self, org_id: str, message: dict):
        if org_id in self.connections:
            dead = []
            for ws in self.connections[org_id]:
                try:
                    await ws.send_json(message)
                except Exception:
                    dead.append(ws)
            for ws in dead:
                self.disconnect(ws, org_id)

ws_manager = ConnectionManager()

# ── DB ────────────────────────────────────────────────────────────────────────
client: AsyncIOMotorClient = None
db = None

@app.on_event("startup")
async def startup():
    global client, db
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    # Indexes
    await db.users.create_index([("email", ASCENDING), ("organisation_id", ASCENDING)], unique=True)
    await db.officer_codes.create_index([("code_hash", ASCENDING)], unique=True)
    await db.officer_codes.create_index([("organisation_id", ASCENDING), ("personnel_id", ASCENDING)])
    await db.audit_logs.create_index([("organisation_id", ASCENDING), ("created_at", DESCENDING)])
    await db.shifts.create_index([("organisation_id", ASCENDING), ("start_time", DESCENDING)])
    await db.check_calls.create_index([("organisation_id", ASCENDING), ("status", ASCENDING)])

@app.on_event("shutdown")
async def shutdown():
    client.close()

# ── helpers ───────────────────────────────────────────────────────────────────
PyObjectId = Annotated[str, BeforeValidator(str)]

def to_json(doc) -> dict:
    if doc is None:
        return None
    if isinstance(doc, list):
        return [to_json(d) for d in doc]
    d = dict(doc)
    if "_id" in d:
        d["id"] = str(d.pop("_id"))
    for k, v in d.items():
        if isinstance(v, ObjectId):
            d[k] = str(v)
        elif isinstance(v, datetime):
            d[k] = v.isoformat()
        elif isinstance(v, list):
            d[k] = [to_json(i) if isinstance(i, dict) else i for i in v]
        elif isinstance(v, dict):
            d[k] = to_json(v)
    return d

def now_utc() -> datetime:
    return datetime.now(timezone.utc)

def hash_password(p: str) -> str:
    return pwd_ctx.hash(p)

def verify_password(plain: str, hashed: str) -> bool:
    return pwd_ctx.verify(plain, hashed)

def create_token(payload: dict, expire_hours: int = JWT_EXPIRE_HOURS) -> str:
    data = payload.copy()
    data["exp"] = now_utc() + timedelta(hours=expire_hours)
    return jwt.encode(data, JWT_SECRET, algorithm=JWT_ALGORITHM)

def decode_token(token: str) -> dict:
    return jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])

def gen_officer_code(length: int = 7) -> str:
    return "".join(secrets.choice(string.digits) for _ in range(length))

async def log_audit(org_id: str, actor_type: str, actor_id: str, action: str, metadata: dict = None):
    await db.audit_logs.insert_one({
        "organisation_id": org_id,
        "actor_type": actor_type,
        "actor_id": actor_id,
        "action": action,
        "metadata": metadata or {},
        "created_at": now_utc(),
    })

# ── auth middleware ───────────────────────────────────────────────────────────
async def get_current_user(authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not authenticated")
    token = authorization.split(" ", 1)[1]
    try:
        payload = decode_token(token)
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    user_id = payload.get("sub")
    actor_type = payload.get("actor_type", "admin")
    if actor_type == "officer":
        doc = await db.personnel.find_one({"_id": ObjectId(user_id)})
        if not doc:
            raise HTTPException(status_code=401, detail="Officer not found")
        doc["actor_type"] = "officer"
        return to_json(doc)
    else:
        doc = await db.users.find_one({"_id": ObjectId(user_id)})
        if not doc:
            raise HTTPException(status_code=401, detail="User not found")
        doc["actor_type"] = "admin"
        return to_json(doc)

async def require_admin(current_user=Depends(get_current_user)):
    if current_user.get("actor_type") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user

async def require_role(roles: List[str], current_user=Depends(get_current_user)):
    if current_user.get("role") not in roles:
        raise HTTPException(status_code=403, detail=f"Role {roles} required")
    return current_user

# ════════════════════════════════════════════════════════════════════════════
# AUTH
# ════════════════════════════════════════════════════════════════════════════

class AdminLoginRequest(BaseModel):
    email: str
    password: str

class OfficerLoginRequest(BaseModel):
    code: str
    pin: str

@app.post("/api/auth/admin-login")
async def admin_login(req: AdminLoginRequest):
    user = await db.users.find_one({"email": req.email.lower().strip()})
    if not user or not verify_password(req.password, user.get("password_hash", "")):
        await log_audit(
            user.get("organisation_id", "unknown") if user else "unknown",
            "admin", str(user["_id"]) if user else "unknown",
            "LOGIN_FAILED", {"email": req.email}
        )
        raise HTTPException(status_code=401, detail="Invalid credentials")
    if not user.get("active", True):
        raise HTTPException(status_code=403, detail="Account disabled")

    token = create_token({
        "sub": str(user["_id"]),
        "org": user["organisation_id"],
        "role": user["role"],
        "actor_type": "admin",
    })
    await log_audit(user["organisation_id"], "admin", str(user["_id"]), "LOGIN_SUCCESS")
    return {
        "token": token,
        "user": to_json(user),
        "actor_type": "admin"
    }

@app.post("/api/auth/officer-login")
async def officer_login(req: OfficerLoginRequest):
    # Find by code
    all_codes = await db.officer_codes.find({"active": True}).to_list(None)
    matched_code = None
    for code_doc in all_codes:
        if verify_password(req.code, code_doc.get("code_hash", "")):
            matched_code = code_doc
            break

    if not matched_code:
        raise HTTPException(status_code=401, detail="Invalid code or PIN")

    # Check lockout
    if matched_code.get("failed_attempts", 0) >= 5:
        raise HTTPException(status_code=403, detail="Account locked. Contact your administrator.")

    # Verify PIN
    if not verify_password(req.pin, matched_code.get("pin_hash", "")):
        await db.officer_codes.update_one(
            {"_id": matched_code["_id"]},
            {"$inc": {"failed_attempts": 1}}
        )
        await log_audit(
            matched_code["organisation_id"], "officer",
            str(matched_code["personnel_id"]), "OFFICER_LOGIN_FAILED"
        )
        raise HTTPException(status_code=401, detail="Invalid code or PIN")

    # Check personnel
    personnel = await db.personnel.find_one({"_id": ObjectId(matched_code["personnel_id"])})
    if not personnel or personnel.get("status") == "suspended":
        raise HTTPException(status_code=403, detail="Officer account suspended")

    # Check licence validity
    active_licence = await db.licences.find_one({
        "personnel_id": str(matched_code["personnel_id"]),
        "status": "valid"
    })
    if not active_licence:
        expired_licence = await db.licences.find_one({
            "personnel_id": str(matched_code["personnel_id"])
        })
        if expired_licence:
            await log_audit(
                matched_code["organisation_id"], "officer",
                str(matched_code["personnel_id"]), "LOGIN_DENIED_LICENCE_EXPIRED"
            )
            raise HTTPException(status_code=403, detail="Licence expired. Access denied.")

    # Reset failed attempts
    await db.officer_codes.update_one(
        {"_id": matched_code["_id"]},
        {"$set": {"failed_attempts": 0, "last_used_at": now_utc()}}
    )

    token = create_token({
        "sub": str(matched_code["personnel_id"]),
        "org": matched_code["organisation_id"],
        "actor_type": "officer",
    }, expire_hours=12)

    await log_audit(
        matched_code["organisation_id"], "officer",
        str(matched_code["personnel_id"]), "OFFICER_LOGIN_SUCCESS"
    )
    return {
        "token": token,
        "user": to_json(personnel),
        "actor_type": "officer"
    }

@app.get("/api/auth/me")
async def get_me(current_user=Depends(get_current_user)):
    return current_user

# ════════════════════════════════════════════════════════════════════════════
# ORGANISATIONS
# ════════════════════════════════════════════════════════════════════════════

class OrgCreate(BaseModel):
    name: str
    email: str
    phone: Optional[str] = None
    address: Optional[str] = None
    compliance_config: Optional[dict] = {}

class OrgAdminCreate(BaseModel):
    first_name: str
    last_name: str
    email: str
    password: str

class OnboardingStep(BaseModel):
    step: int
    data: dict

class OnboardRequest(BaseModel):
    org_data: OrgCreate
    admin_data: OrgAdminCreate

@app.post("/api/organisations/onboard")
async def onboard_organisation(req: OnboardRequest):
    org_data = req.org_data
    admin_data = req.admin_data
    # Check if email taken
    existing = await db.organisations.find_one({"email": org_data.email.lower()})
    if existing:
        raise HTTPException(status_code=400, detail="Organisation email already registered")

    # Check if admin email taken globally
    existing_user = await db.users.find_one({"email": admin_data.email.lower()})
    if existing_user:
        raise HTTPException(status_code=400, detail="Admin email already in use")

    # Create org
    org = {
        "name": org_data.name,
        "email": org_data.email.lower(),
        "phone": org_data.phone,
        "address": org_data.address,
        "compliance_config": org_data.compliance_config or {},
        "onboarding_complete": False,
        "created_at": now_utc(),
        "updated_at": now_utc(),
    }
    org_result = await db.organisations.insert_one(org)
    org_id = str(org_result.inserted_id)

    # Create admin user
    user = {
        "organisation_id": org_id,
        "email": admin_data.email.lower(),
        "password_hash": hash_password(admin_data.password),
        "first_name": admin_data.first_name,
        "last_name": admin_data.last_name,
        "role": "admin",
        "active": True,
        "mfa_enabled": False,
        "created_at": now_utc(),
        "updated_at": now_utc(),
    }
    user_result = await db.users.insert_one(user)
    user_id = str(user_result.inserted_id)

    token = create_token({
        "sub": user_id,
        "org": org_id,
        "role": "admin",
        "actor_type": "admin",
    })

    await log_audit(org_id, "admin", user_id, "ORGANISATION_CREATED", {"name": org_data.name})

    created_user = await db.users.find_one({"_id": ObjectId(user_id)})
    return {
        "token": token,
        "organisation": to_json({**org, "_id": org_result.inserted_id}),
        "user": to_json(created_user),
    }

@app.get("/api/organisations/current")
async def get_current_org(current_user=Depends(get_current_user)):
    org = await db.organisations.find_one({"_id": ObjectId(current_user["organisation_id"])})
    if not org:
        raise HTTPException(status_code=404, detail="Organisation not found")
    return to_json(org)

@app.put("/api/organisations/current")
async def update_organisation(data: dict, current_user=Depends(require_admin)):
    data.pop("_id", None)
    data.pop("id", None)
    data["updated_at"] = now_utc()
    await db.organisations.update_one(
        {"_id": ObjectId(current_user["organisation_id"])},
        {"$set": data}
    )
    await log_audit(current_user["organisation_id"], "admin", current_user["id"], "ORG_UPDATED")
    org = await db.organisations.find_one({"_id": ObjectId(current_user["organisation_id"])})
    return to_json(org)

# ════════════════════════════════════════════════════════════════════════════
# USERS
# ════════════════════════════════════════════════════════════════════════════

class UserCreate(BaseModel):
    email: str
    password: str
    first_name: str
    last_name: str
    role: str = "viewer"

class UserUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    role: Optional[str] = None
    active: Optional[bool] = None

@app.get("/api/users")
async def list_users(current_user=Depends(require_admin)):
    docs = await db.users.find({"organisation_id": current_user["organisation_id"]}).to_list(None)
    return [to_json(d) for d in docs]

@app.post("/api/users")
async def create_user(req: UserCreate, current_user=Depends(require_admin)):
    existing = await db.users.find_one({"email": req.email.lower()})
    if existing:
        raise HTTPException(status_code=400, detail="Email already in use")
    doc = {
        "organisation_id": current_user["organisation_id"],
        "email": req.email.lower(),
        "password_hash": hash_password(req.password),
        "first_name": req.first_name,
        "last_name": req.last_name,
        "role": req.role,
        "active": True,
        "mfa_enabled": False,
        "created_at": now_utc(),
        "updated_at": now_utc(),
    }
    result = await db.users.insert_one(doc)
    await log_audit(current_user["organisation_id"], "admin", current_user["id"], "USER_CREATED", {"email": req.email})
    created = await db.users.find_one({"_id": result.inserted_id})
    return to_json(created)

@app.put("/api/users/{user_id}")
async def update_user(user_id: str, req: UserUpdate, current_user=Depends(require_admin)):
    update_data = {k: v for k, v in req.model_dump().items() if v is not None}
    update_data["updated_at"] = now_utc()
    await db.users.update_one(
        {"_id": ObjectId(user_id), "organisation_id": current_user["organisation_id"]},
        {"$set": update_data}
    )
    doc = await db.users.find_one({"_id": ObjectId(user_id)})
    await log_audit(current_user["organisation_id"], "admin", current_user["id"], "USER_UPDATED", {"user_id": user_id})
    return to_json(doc)

@app.delete("/api/users/{user_id}")
async def delete_user(user_id: str, current_user=Depends(require_admin)):
    await db.users.delete_one({"_id": ObjectId(user_id), "organisation_id": current_user["organisation_id"]})
    await log_audit(current_user["organisation_id"], "admin", current_user["id"], "USER_DELETED", {"user_id": user_id})
    return {"message": "User deleted"}

# ════════════════════════════════════════════════════════════════════════════
# PERSONNEL
# ════════════════════════════════════════════════════════════════════════════

class PersonnelCreate(BaseModel):
    first_name: str
    last_name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    date_of_birth: Optional[str] = None
    employee_id: Optional[str] = None
    role: Optional[str] = "Security Officer"
    profile_image_url: Optional[str] = None

class PersonnelUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    role: Optional[str] = None
    status: Optional[str] = None
    profile_image_url: Optional[str] = None

@app.get("/api/personnel")
async def list_personnel(current_user=Depends(get_current_user)):
    query = {"organisation_id": current_user["organisation_id"]}
    if current_user.get("actor_type") == "officer":
        query["_id"] = ObjectId(current_user["id"])
    docs = await db.personnel.find(query).sort("last_name", ASCENDING).to_list(None)
    result = []
    for doc in docs:
        p = to_json(doc)
        # Attach latest licence
        licence = await db.licences.find_one(
            {"personnel_id": p["id"]},
            sort=[("expiry_date", DESCENDING)]
        )
        p["latest_licence"] = to_json(licence) if licence else None
        result.append(p)
    return result

@app.post("/api/personnel")
async def create_personnel(req: PersonnelCreate, current_user=Depends(require_admin)):
    doc = {
        "organisation_id": current_user["organisation_id"],
        "first_name": req.first_name,
        "last_name": req.last_name,
        "email": req.email,
        "phone": req.phone,
        "address": req.address,
        "date_of_birth": req.date_of_birth,
        "employee_id": req.employee_id or f"EMP-{secrets.token_hex(3).upper()}",
        "role": req.role,
        "profile_image_url": req.profile_image_url,
        "status": "active",
        "created_at": now_utc(),
        "updated_at": now_utc(),
    }
    result = await db.personnel.insert_one(doc)
    await log_audit(current_user["organisation_id"], "admin", current_user["id"], "PERSONNEL_CREATED", {"name": f"{req.first_name} {req.last_name}"})
    created = await db.personnel.find_one({"_id": result.inserted_id})
    return to_json(created)

@app.get("/api/personnel/{personnel_id}")
async def get_personnel(personnel_id: str, current_user=Depends(get_current_user)):
    doc = await db.personnel.find_one({
        "_id": ObjectId(personnel_id),
        "organisation_id": current_user["organisation_id"]
    })
    if not doc:
        raise HTTPException(status_code=404, detail="Personnel not found")
    p = to_json(doc)
    licences = await db.licences.find({"personnel_id": personnel_id}).sort("expiry_date", DESCENDING).to_list(None)
    p["licences"] = [to_json(l) for l in licences]
    code_doc = await db.officer_codes.find_one({"personnel_id": personnel_id, "active": True})
    p["has_login_code"] = code_doc is not None
    if code_doc:
        p["code_display"] = code_doc.get("code_plain")
    return p

@app.put("/api/personnel/{personnel_id}")
async def update_personnel(personnel_id: str, req: PersonnelUpdate, current_user=Depends(require_admin)):
    update_data = {k: v for k, v in req.model_dump().items() if v is not None}
    update_data["updated_at"] = now_utc()
    await db.personnel.update_one(
        {"_id": ObjectId(personnel_id), "organisation_id": current_user["organisation_id"]},
        {"$set": update_data}
    )
    doc = await db.personnel.find_one({"_id": ObjectId(personnel_id)})
    await log_audit(current_user["organisation_id"], "admin", current_user["id"], "PERSONNEL_UPDATED", {"personnel_id": personnel_id})
    return to_json(doc)

@app.delete("/api/personnel/{personnel_id}")
async def delete_personnel(personnel_id: str, current_user=Depends(require_admin)):
    await db.personnel.update_one(
        {"_id": ObjectId(personnel_id), "organisation_id": current_user["organisation_id"]},
        {"$set": {"status": "inactive", "updated_at": now_utc()}}
    )
    await log_audit(current_user["organisation_id"], "admin", current_user["id"], "PERSONNEL_DEACTIVATED", {"personnel_id": personnel_id})
    return {"message": "Personnel deactivated"}

# Officer code generation
@app.post("/api/personnel/{personnel_id}/generate-code")
async def generate_officer_code(personnel_id: str, current_user=Depends(require_admin)):
    # Deactivate existing codes
    await db.officer_codes.update_many(
        {"personnel_id": personnel_id},
        {"$set": {"active": False}}
    )
    code = gen_officer_code(7)
    pin = "".join(secrets.choice(string.digits) for _ in range(4))

    doc = {
        "organisation_id": current_user["organisation_id"],
        "personnel_id": personnel_id,
        "code_hash": hash_password(code),
        "code_plain": code,
        "pin_hash": hash_password(pin),
        "pin_plain": pin,
        "active": True,
        "failed_attempts": 0,
        "last_used_at": None,
        "created_at": now_utc(),
    }
    await db.officer_codes.insert_one(doc)
    await log_audit(current_user["organisation_id"], "admin", current_user["id"], "OFFICER_CODE_GENERATED", {"personnel_id": personnel_id})
    return {"code": code, "pin": pin, "message": "Share these credentials securely with the officer"}

# ════════════════════════════════════════════════════════════════════════════
# LICENCES
# ════════════════════════════════════════════════════════════════════════════

class LicenceCreate(BaseModel):
    personnel_id: str
    type: str
    number: str
    issuing_authority: Optional[str] = None
    issue_date: Optional[str] = None
    expiry_date: str
    document_url: Optional[str] = None

class LicenceUpdate(BaseModel):
    type: Optional[str] = None
    number: Optional[str] = None
    issuing_authority: Optional[str] = None
    issue_date: Optional[str] = None
    expiry_date: Optional[str] = None
    document_url: Optional[str] = None
    status: Optional[str] = None

def compute_licence_status(expiry_date_str: str) -> str:
    try:
        expiry = datetime.fromisoformat(expiry_date_str.replace("Z", "+00:00"))
        if expiry.tzinfo is None:
            expiry = expiry.replace(tzinfo=timezone.utc)
        now = now_utc()
        days_until = (expiry - now).days
        if days_until < 0:
            return "expired"
        elif days_until <= 30:
            return "expiring_soon"
        return "valid"
    except:
        return "unknown"

@app.get("/api/licences")
async def list_licences(personnel_id: Optional[str] = None, current_user=Depends(get_current_user)):
    query = {"organisation_id": current_user["organisation_id"]}
    if personnel_id:
        query["personnel_id"] = personnel_id
    docs = await db.licences.find(query).sort("expiry_date", ASCENDING).to_list(None)
    return [to_json(d) for d in docs]

@app.post("/api/licences")
async def create_licence(req: LicenceCreate, current_user=Depends(require_admin)):
    status_val = compute_licence_status(req.expiry_date)
    doc = {
        "organisation_id": current_user["organisation_id"],
        "personnel_id": req.personnel_id,
        "type": req.type,
        "number": req.number,
        "issuing_authority": req.issuing_authority,
        "issue_date": req.issue_date,
        "expiry_date": req.expiry_date,
        "document_url": req.document_url,
        "status": status_val,
        "created_at": now_utc(),
        "updated_at": now_utc(),
    }
    result = await db.licences.insert_one(doc)
    await log_audit(current_user["organisation_id"], "admin", current_user["id"], "LICENCE_CREATED", {"number": req.number})
    created = await db.licences.find_one({"_id": result.inserted_id})
    return to_json(created)

@app.put("/api/licences/{licence_id}")
async def update_licence(licence_id: str, req: LicenceUpdate, current_user=Depends(require_admin)):
    update_data = {k: v for k, v in req.model_dump().items() if v is not None}
    if "expiry_date" in update_data:
        update_data["status"] = compute_licence_status(update_data["expiry_date"])
    update_data["updated_at"] = now_utc()
    await db.licences.update_one({"_id": ObjectId(licence_id)}, {"$set": update_data})
    doc = await db.licences.find_one({"_id": ObjectId(licence_id)})
    return to_json(doc)

@app.delete("/api/licences/{licence_id}")
async def delete_licence(licence_id: str, current_user=Depends(require_admin)):
    await db.licences.delete_one({"_id": ObjectId(licence_id)})
    return {"message": "Licence deleted"}

# ════════════════════════════════════════════════════════════════════════════
# SITES
# ════════════════════════════════════════════════════════════════════════════

class SiteCreate(BaseModel):
    name: str
    address: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    contact_name: Optional[str] = None
    contact_phone: Optional[str] = None
    type: Optional[str] = "commercial"
    image_url: Optional[str] = None

class SiteUpdate(BaseModel):
    name: Optional[str] = None
    address: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    contact_name: Optional[str] = None
    contact_phone: Optional[str] = None
    type: Optional[str] = None
    status: Optional[str] = None
    image_url: Optional[str] = None

@app.get("/api/sites")
async def list_sites(current_user=Depends(get_current_user)):
    query = {"organisation_id": current_user["organisation_id"]}
    if current_user.get("actor_type") == "officer":
        # Get their assigned shifts to find sites
        shifts = await db.shifts.find({
            "personnel_id": current_user["id"],
            "organisation_id": current_user["organisation_id"]
        }).to_list(None)
        site_ids = list(set([s["site_id"] for s in shifts]))
        query["_id"] = {"$in": [ObjectId(sid) for sid in site_ids if sid]}
    docs = await db.sites.find(query).sort("name", ASCENDING).to_list(None)
    return [to_json(d) for d in docs]

@app.post("/api/sites")
async def create_site(req: SiteCreate, current_user=Depends(require_admin)):
    doc = {
        "organisation_id": current_user["organisation_id"],
        "name": req.name,
        "address": req.address,
        "latitude": req.latitude,
        "longitude": req.longitude,
        "contact_name": req.contact_name,
        "contact_phone": req.contact_phone,
        "type": req.type,
        "status": "active",
        "image_url": req.image_url,
        "assigned_officers": [],
        "created_at": now_utc(),
        "updated_at": now_utc(),
    }
    result = await db.sites.insert_one(doc)
    await log_audit(current_user["organisation_id"], "admin", current_user["id"], "SITE_CREATED", {"name": req.name})
    created = await db.sites.find_one({"_id": result.inserted_id})
    return to_json(created)

@app.get("/api/sites/{site_id}")
async def get_site(site_id: str, current_user=Depends(get_current_user)):
    doc = await db.sites.find_one({"_id": ObjectId(site_id), "organisation_id": current_user["organisation_id"]})
    if not doc:
        raise HTTPException(status_code=404, detail="Site not found")
    return to_json(doc)

@app.put("/api/sites/{site_id}")
async def update_site(site_id: str, req: SiteUpdate, current_user=Depends(require_admin)):
    update_data = {k: v for k, v in req.model_dump().items() if v is not None}
    update_data["updated_at"] = now_utc()
    await db.sites.update_one(
        {"_id": ObjectId(site_id), "organisation_id": current_user["organisation_id"]},
        {"$set": update_data}
    )
    doc = await db.sites.find_one({"_id": ObjectId(site_id)})
    return to_json(doc)

@app.delete("/api/sites/{site_id}")
async def delete_site(site_id: str, current_user=Depends(require_admin)):
    await db.sites.update_one(
        {"_id": ObjectId(site_id), "organisation_id": current_user["organisation_id"]},
        {"$set": {"status": "inactive", "updated_at": now_utc()}}
    )
    return {"message": "Site deactivated"}

# ════════════════════════════════════════════════════════════════════════════
# SHIFTS (ROTA)
# ════════════════════════════════════════════════════════════════════════════

class ShiftCreate(BaseModel):
    site_id: str
    personnel_id: str
    start_time: str
    end_time: str
    notes: Optional[str] = None
    recurring: Optional[bool] = False
    recurring_days: Optional[List[int]] = []

class ShiftUpdate(BaseModel):
    site_id: Optional[str] = None
    personnel_id: Optional[str] = None
    start_time: Optional[str] = None
    end_time: Optional[str] = None
    status: Optional[str] = None
    notes: Optional[str] = None

@app.get("/api/shifts")
async def list_shifts(
    site_id: Optional[str] = None,
    personnel_id: Optional[str] = None,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    current_user=Depends(get_current_user)
):
    query = {"organisation_id": current_user["organisation_id"]}
    if current_user.get("actor_type") == "officer":
        query["personnel_id"] = current_user["id"]
    if site_id:
        query["site_id"] = site_id
    if personnel_id and current_user.get("actor_type") != "officer":
        query["personnel_id"] = personnel_id
    if start_date:
        try:
            query.setdefault("start_time", {})["$gte"] = start_date
        except:
            pass
    if end_date:
        try:
            query.setdefault("start_time", {})["$lte"] = end_date
        except:
            pass
    docs = await db.shifts.find(query).sort("start_time", ASCENDING).to_list(None)
    result = []
    for doc in docs:
        s = to_json(doc)
        if doc.get("site_id"):
            site = await db.sites.find_one({"_id": ObjectId(doc["site_id"])})
            s["site"] = to_json(site) if site else None
        if doc.get("personnel_id"):
            person = await db.personnel.find_one({"_id": ObjectId(doc["personnel_id"])})
            s["personnel"] = to_json(person) if person else None
        result.append(s)
    return result

@app.post("/api/shifts")
async def create_shift(req: ShiftCreate, current_user=Depends(require_admin)):
    # Check licence validity
    person = await db.personnel.find_one({"_id": ObjectId(req.personnel_id)})
    if not person:
        raise HTTPException(status_code=404, detail="Personnel not found")
    valid_licence = await db.licences.find_one({"personnel_id": req.personnel_id, "status": "valid"})
    if not valid_licence:
        licence = await db.licences.find_one({"personnel_id": req.personnel_id})
        if licence:
            raise HTTPException(status_code=400, detail="Cannot assign shift: officer licence expired")

    # Check double booking
    conflict = await db.shifts.find_one({
        "personnel_id": req.personnel_id,
        "status": {"$in": ["scheduled", "active"]},
        "$or": [
            {"start_time": {"$lt": req.end_time, "$gte": req.start_time}},
            {"end_time": {"$gt": req.start_time, "$lte": req.end_time}},
            {"start_time": {"$lte": req.start_time}, "end_time": {"$gte": req.end_time}},
        ]
    })
    if conflict:
        raise HTTPException(status_code=400, detail="Officer already has a shift at this time (double booking prevented)")

    doc = {
        "organisation_id": current_user["organisation_id"],
        "site_id": req.site_id,
        "personnel_id": req.personnel_id,
        "start_time": req.start_time,
        "end_time": req.end_time,
        "status": "scheduled",
        "notes": req.notes,
        "created_by": current_user["id"],
        "created_at": now_utc(),
        "updated_at": now_utc(),
    }
    result = await db.shifts.insert_one(doc)
    await log_audit(current_user["organisation_id"], "admin", current_user["id"], "SHIFT_CREATED", {"site_id": req.site_id, "personnel_id": req.personnel_id})
    created = await db.shifts.find_one({"_id": result.inserted_id})
    return to_json(created)

@app.put("/api/shifts/{shift_id}")
async def update_shift(shift_id: str, req: ShiftUpdate, current_user=Depends(require_admin)):
    update_data = {k: v for k, v in req.model_dump().items() if v is not None}
    update_data["updated_at"] = now_utc()
    await db.shifts.update_one(
        {"_id": ObjectId(shift_id), "organisation_id": current_user["organisation_id"]},
        {"$set": update_data}
    )
    doc = await db.shifts.find_one({"_id": ObjectId(shift_id)})
    await log_audit(current_user["organisation_id"], "admin", current_user["id"], "SHIFT_UPDATED", {"shift_id": shift_id, **update_data})
    return to_json(doc)

@app.delete("/api/shifts/{shift_id}")
async def delete_shift(shift_id: str, current_user=Depends(require_admin)):
    await db.shifts.delete_one({"_id": ObjectId(shift_id), "organisation_id": current_user["organisation_id"]})
    return {"message": "Shift deleted"}

# ════════════════════════════════════════════════════════════════════════════
# LOGS (Daily Occurrence Log)
# ════════════════════════════════════════════════════════════════════════════

class LogCreate(BaseModel):
    site_id: str
    type: str  # incident|patrol|note
    title: str
    description: str
    shift_id: Optional[str] = None
    attachments: Optional[List[dict]] = []

class LogUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    type: Optional[str] = None

@app.get("/api/logs")
async def list_logs(
    site_id: Optional[str] = None,
    type: Optional[str] = None,
    date_from: Optional[str] = None,
    current_user=Depends(get_current_user)
):
    query = {"organisation_id": current_user["organisation_id"]}
    if current_user.get("actor_type") == "officer":
        query["personnel_id"] = current_user["id"]
    if site_id:
        query["site_id"] = site_id
    if type:
        query["type"] = type
    docs = await db.logs.find(query).sort("created_at", DESCENDING).limit(200).to_list(None)
    result = []
    for doc in docs:
        log = to_json(doc)
        if doc.get("site_id"):
            site = await db.sites.find_one({"_id": ObjectId(doc["site_id"])})
            log["site"] = to_json(site) if site else None
        if doc.get("personnel_id"):
            person = await db.personnel.find_one({"_id": ObjectId(doc["personnel_id"])})
            log["personnel"] = to_json(person) if person else None
        result.append(log)
    return result

@app.post("/api/logs")
async def create_log(req: LogCreate, current_user=Depends(get_current_user)):
    doc = {
        "organisation_id": current_user["organisation_id"],
        "site_id": req.site_id,
        "personnel_id": current_user["id"],
        "shift_id": req.shift_id,
        "type": req.type,
        "title": req.title,
        "description": req.description,
        "attachments": req.attachments or [],
        "created_at": now_utc(),
    }
    result = await db.logs.insert_one(doc)
    await log_audit(current_user["organisation_id"], current_user.get("actor_type", "admin"), current_user["id"], "LOG_CREATED", {"type": req.type, "title": req.title})
    created = await db.logs.find_one({"_id": result.inserted_id})
    return to_json(created)

@app.get("/api/logs/{log_id}")
async def get_log(log_id: str, current_user=Depends(get_current_user)):
    doc = await db.logs.find_one({"_id": ObjectId(log_id), "organisation_id": current_user["organisation_id"]})
    if not doc:
        raise HTTPException(status_code=404, detail="Log not found")
    return to_json(doc)

# ════════════════════════════════════════════════════════════════════════════
# FORMS
# ════════════════════════════════════════════════════════════════════════════

PREBUILT_FORMS = [
    {
        "name": "Incident Report",
        "type": "incident",
        "is_prebuilt": True,
        "fields": [
            {"id": "f1", "type": "text", "label": "Incident Title", "required": True},
            {"id": "f2", "type": "datetime", "label": "Date & Time of Incident", "required": True},
            {"id": "f3", "type": "textarea", "label": "Description", "required": True},
            {"id": "f4", "type": "dropdown", "label": "Severity", "required": True, "options": ["Low", "Medium", "High", "Critical"]},
            {"id": "f5", "type": "text", "label": "Persons Involved", "required": False},
            {"id": "f6", "type": "image", "label": "Evidence Photos", "required": False},
            {"id": "f7", "type": "signature", "label": "Officer Signature", "required": True},
        ]
    },
    {
        "name": "Patrol Report",
        "type": "patrol",
        "is_prebuilt": True,
        "fields": [
            {"id": "f1", "type": "text", "label": "Patrol Area", "required": True},
            {"id": "f2", "type": "datetime", "label": "Start Time", "required": True},
            {"id": "f3", "type": "datetime", "label": "End Time", "required": True},
            {"id": "f4", "type": "checkbox", "label": "Areas Checked", "required": True, "options": ["North Entrance", "South Entrance", "Car Park", "Reception", "Server Room", "Roof Access"]},
            {"id": "f5", "type": "textarea", "label": "Observations", "required": False},
            {"id": "f6", "type": "gps", "label": "GPS Location", "required": False},
            {"id": "f7", "type": "signature", "label": "Officer Signature", "required": True},
        ]
    },
    {
        "name": "Visitor Log",
        "type": "visitor",
        "is_prebuilt": True,
        "fields": [
            {"id": "f1", "type": "text", "label": "Visitor Name", "required": True},
            {"id": "f2", "type": "text", "label": "Company/Organisation", "required": False},
            {"id": "f3", "type": "text", "label": "Host Name", "required": True},
            {"id": "f4", "type": "text", "label": "Purpose of Visit", "required": True},
            {"id": "f5", "type": "datetime", "label": "Time In", "required": True},
            {"id": "f6", "type": "datetime", "label": "Time Out", "required": False},
            {"id": "f7", "type": "text", "label": "ID/Badge Number", "required": False},
            {"id": "f8", "type": "signature", "label": "Visitor Signature", "required": True},
        ]
    },
    {
        "name": "Welfare Check",
        "type": "welfare",
        "is_prebuilt": True,
        "fields": [
            {"id": "f1", "type": "text", "label": "Officer Name", "required": True},
            {"id": "f2", "type": "datetime", "label": "Check Time", "required": True},
            {"id": "f3", "type": "dropdown", "label": "Status", "required": True, "options": ["All Clear", "Issue Identified", "Medical Attention Required", "Emergency"]},
            {"id": "f4", "type": "textarea", "label": "Notes", "required": False},
            {"id": "f5", "type": "signature", "label": "Confirming Officer Signature", "required": True},
        ]
    },
    {
        "name": "Accident Report",
        "type": "accident",
        "is_prebuilt": True,
        "fields": [
            {"id": "f1", "type": "text", "label": "Person Involved", "required": True},
            {"id": "f2", "type": "datetime", "label": "Date & Time", "required": True},
            {"id": "f3", "type": "text", "label": "Location", "required": True},
            {"id": "f4", "type": "textarea", "label": "Description of Accident", "required": True},
            {"id": "f5", "type": "textarea", "label": "Injuries Sustained", "required": True},
            {"id": "f6", "type": "dropdown", "label": "Medical Attention", "required": True, "options": ["None Required", "First Aid Applied", "Hospital Required", "Ambulance Called"]},
            {"id": "f7", "type": "text", "label": "Witnesses", "required": False},
            {"id": "f8", "type": "image", "label": "Photos", "required": False},
            {"id": "f9", "type": "signature", "label": "Reporting Officer Signature", "required": True},
        ]
    }
]

@app.get("/api/forms")
async def list_forms(current_user=Depends(get_current_user)):
    docs = await db.forms.find({"organisation_id": current_user["organisation_id"], "active": True}).to_list(None)
    return [to_json(d) for d in docs]

@app.post("/api/forms")
async def create_form(data: dict, current_user=Depends(require_admin)):
    data["organisation_id"] = current_user["organisation_id"]
    data["active"] = True
    data["is_prebuilt"] = False
    data["created_at"] = now_utc()
    data["updated_at"] = now_utc()
    result = await db.forms.insert_one(data)
    created = await db.forms.find_one({"_id": result.inserted_id})
    return to_json(created)

@app.get("/api/forms/{form_id}")
async def get_form(form_id: str, current_user=Depends(get_current_user)):
    doc = await db.forms.find_one({"_id": ObjectId(form_id), "organisation_id": current_user["organisation_id"]})
    if not doc:
        raise HTTPException(status_code=404, detail="Form not found")
    return to_json(doc)

@app.put("/api/forms/{form_id}")
async def update_form(form_id: str, data: dict, current_user=Depends(require_admin)):
    data.pop("_id", None)
    data.pop("id", None)
    data["updated_at"] = now_utc()
    await db.forms.update_one(
        {"_id": ObjectId(form_id), "organisation_id": current_user["organisation_id"]},
        {"$set": data}
    )
    doc = await db.forms.find_one({"_id": ObjectId(form_id)})
    return to_json(doc)

@app.delete("/api/forms/{form_id}")
async def delete_form(form_id: str, current_user=Depends(require_admin)):
    await db.forms.update_one(
        {"_id": ObjectId(form_id), "organisation_id": current_user["organisation_id"]},
        {"$set": {"active": False}}
    )
    return {"message": "Form deactivated"}

@app.post("/api/forms/{form_id}/submit")
async def submit_form(form_id: str, data: dict, current_user=Depends(get_current_user)):
    form = await db.forms.find_one({"_id": ObjectId(form_id)})
    if not form:
        raise HTTPException(status_code=404, detail="Form not found")
    submission = {
        "organisation_id": current_user["organisation_id"],
        "form_id": form_id,
        "form_name": form.get("name"),
        "form_type": form.get("type"),
        "personnel_id": current_user["id"],
        "site_id": data.get("site_id"),
        "data": data,
        "submitted_at": now_utc(),
        "created_at": now_utc(),
    }
    result = await db.form_submissions.insert_one(submission)
    await log_audit(current_user["organisation_id"], current_user.get("actor_type", "admin"), current_user["id"], "FORM_SUBMITTED", {"form_id": form_id, "form_name": form.get("name")})
    created = await db.form_submissions.find_one({"_id": result.inserted_id})
    return to_json(created)

@app.get("/api/form-submissions")
async def list_submissions(
    form_id: Optional[str] = None,
    current_user=Depends(get_current_user)
):
    query = {"organisation_id": current_user["organisation_id"]}
    if form_id:
        query["form_id"] = form_id
    if current_user.get("actor_type") == "officer":
        query["personnel_id"] = current_user["id"]
    docs = await db.form_submissions.find(query).sort("submitted_at", DESCENDING).limit(100).to_list(None)
    return [to_json(d) for d in docs]

# Seed prebuilt forms
@app.post("/api/forms/seed-prebuilt")
async def seed_prebuilt_forms(current_user=Depends(require_admin)):
    count = 0
    for form_template in PREBUILT_FORMS:
        existing = await db.forms.find_one({
            "organisation_id": current_user["organisation_id"],
            "type": form_template["type"],
            "is_prebuilt": True
        })
        if not existing:
            doc = {
                **form_template,
                "organisation_id": current_user["organisation_id"],
                "active": True,
                "created_at": now_utc(),
                "updated_at": now_utc(),
            }
            await db.forms.insert_one(doc)
            count += 1
    return {"message": f"Seeded {count} prebuilt forms"}

# ════════════════════════════════════════════════════════════════════════════
# CHECK CALLS
# ════════════════════════════════════════════════════════════════════════════

class CheckCallCreate(BaseModel):
    shift_id: str
    personnel_id: str
    site_id: str
    interval_minutes: int = 30

@app.get("/api/check-calls")
async def list_check_calls(
    status: Optional[str] = None,
    current_user=Depends(get_current_user)
):
    query = {"organisation_id": current_user["organisation_id"]}
    if current_user.get("actor_type") == "officer":
        query["personnel_id"] = current_user["id"]
    if status:
        query["status"] = status
    docs = await db.check_calls.find(query).sort("created_at", DESCENDING).to_list(None)
    result = []
    for doc in docs:
        cc = to_json(doc)
        if doc.get("personnel_id"):
            person = await db.personnel.find_one({"_id": ObjectId(doc["personnel_id"])})
            cc["personnel"] = to_json(person) if person else None
        if doc.get("site_id"):
            site = await db.sites.find_one({"_id": ObjectId(doc["site_id"])})
            cc["site"] = to_json(site) if site else None
        result.append(cc)
    return result

@app.post("/api/check-calls")
async def create_check_call(req: CheckCallCreate, current_user=Depends(get_current_user)):
    next_due = now_utc() + timedelta(minutes=req.interval_minutes)
    doc = {
        "organisation_id": current_user["organisation_id"],
        "shift_id": req.shift_id,
        "personnel_id": req.personnel_id,
        "site_id": req.site_id,
        "interval_minutes": req.interval_minutes,
        "last_check_in": now_utc(),
        "next_due_at": next_due,
        "status": "active",
        "check_in_count": 0,
        "created_at": now_utc(),
        "updated_at": now_utc(),
    }
    result = await db.check_calls.insert_one(doc)
    await log_audit(current_user["organisation_id"], current_user.get("actor_type", "admin"), current_user["id"], "CHECK_CALL_STARTED", {"shift_id": req.shift_id})
    created = await db.check_calls.find_one({"_id": result.inserted_id})
    return to_json(created)

@app.put("/api/check-calls/{cc_id}/check-in")
async def check_in(cc_id: str, current_user=Depends(get_current_user)):
    doc = await db.check_calls.find_one({"_id": ObjectId(cc_id), "organisation_id": current_user["organisation_id"]})
    if not doc:
        raise HTTPException(status_code=404, detail="Check call not found")
    interval = doc.get("interval_minutes", 30)
    next_due = now_utc() + timedelta(minutes=interval)
    await db.check_calls.update_one(
        {"_id": ObjectId(cc_id)},
        {
            "$set": {"last_check_in": now_utc(), "next_due_at": next_due, "status": "active", "updated_at": now_utc()},
            "$inc": {"check_in_count": 1}
        }
    )
    await log_audit(current_user["organisation_id"], current_user.get("actor_type", "admin"), current_user["id"], "CHECK_IN", {"check_call_id": cc_id})
    updated = await db.check_calls.find_one({"_id": ObjectId(cc_id)})
    return to_json(updated)

@app.put("/api/check-calls/{cc_id}/complete")
async def complete_check_call(cc_id: str, current_user=Depends(get_current_user)):
    await db.check_calls.update_one(
        {"_id": ObjectId(cc_id), "organisation_id": current_user["organisation_id"]},
        {"$set": {"status": "completed", "updated_at": now_utc()}}
    )
    await log_audit(current_user["organisation_id"], current_user.get("actor_type", "admin"), current_user["id"], "CHECK_CALL_COMPLETED", {"check_call_id": cc_id})
    doc = await db.check_calls.find_one({"_id": ObjectId(cc_id)})
    return to_json(doc)

@app.put("/api/check-calls/{cc_id}/missed")
async def mark_missed(cc_id: str, current_user=Depends(require_admin)):
    await db.check_calls.update_one(
        {"_id": ObjectId(cc_id), "organisation_id": current_user["organisation_id"]},
        {"$set": {"status": "missed", "updated_at": now_utc()}}
    )
    await log_audit(current_user["organisation_id"], "admin", current_user["id"], "CHECK_CALL_MISSED", {"check_call_id": cc_id})
    doc = await db.check_calls.find_one({"_id": ObjectId(cc_id)})
    return to_json(doc)

# ════════════════════════════════════════════════════════════════════════════
# COMPLIANCE ENGINE
# ════════════════════════════════════════════════════════════════════════════

@app.get("/api/compliance/alerts")
async def get_compliance_alerts(current_user=Depends(get_current_user)):
    org_id = current_user["organisation_id"]
    alerts = []

    # Expired licences
    expired = await db.licences.find({"organisation_id": org_id, "status": "expired"}).to_list(None)
    for lic in expired:
        person = await db.personnel.find_one({"_id": ObjectId(lic["personnel_id"])})
        alerts.append({
            "type": "licence_expired",
            "severity": "critical",
            "message": f"Licence EXPIRED: {person['first_name'] + ' ' + person['last_name'] if person else 'Unknown'} - {lic['type']} #{lic['number']}",
            "personnel_id": lic["personnel_id"],
            "licence_id": str(lic["_id"]),
            "expiry_date": lic.get("expiry_date"),
        })

    # Expiring soon
    expiring_soon = await db.licences.find({"organisation_id": org_id, "status": "expiring_soon"}).to_list(None)
    for lic in expiring_soon:
        person = await db.personnel.find_one({"_id": ObjectId(lic["personnel_id"])})
        alerts.append({
            "type": "licence_expiring",
            "severity": "warning",
            "message": f"Licence expiring soon: {person['first_name'] + ' ' + person['last_name'] if person else 'Unknown'} - {lic['type']} #{lic['number']}",
            "personnel_id": lic["personnel_id"],
            "licence_id": str(lic["_id"]),
            "expiry_date": lic.get("expiry_date"),
        })

    # Missed check calls
    missed_cc = await db.check_calls.find({"organisation_id": org_id, "status": "missed"}).to_list(None)
    for cc in missed_cc:
        person = await db.personnel.find_one({"_id": ObjectId(cc["personnel_id"])})
        alerts.append({
            "type": "check_call_missed",
            "severity": "critical",
            "message": f"Missed check call: {person['first_name'] + ' ' + person['last_name'] if person else 'Unknown'}",
            "personnel_id": cc["personnel_id"],
            "check_call_id": str(cc["_id"]),
        })

    # Personnel without licences
    all_personnel = await db.personnel.find({"organisation_id": org_id, "status": "active"}).to_list(None)
    for p in all_personnel:
        lic = await db.licences.find_one({"personnel_id": str(p["_id"])})
        if not lic:
            alerts.append({
                "type": "no_licence",
                "severity": "warning",
                "message": f"No licence on record: {p['first_name']} {p['last_name']}",
                "personnel_id": str(p["_id"]),
            })

    return {"alerts": alerts, "total": len(alerts)}

@app.get("/api/compliance/risk-scores")
async def get_risk_scores(current_user=Depends(get_current_user)):
    org_id = current_user["organisation_id"]
    all_personnel = await db.personnel.find({"organisation_id": org_id, "status": "active"}).to_list(None)
    scores = []
    for p in all_personnel:
        score = 100
        person_id = str(p["_id"])
        licences = await db.licences.find({"personnel_id": person_id}).to_list(None)
        if not licences:
            score -= 40
        for lic in licences:
            if lic.get("status") == "expired":
                score -= 50
            elif lic.get("status") == "expiring_soon":
                score -= 20
        missed = await db.check_calls.count_documents({"personnel_id": person_id, "status": "missed"})
        score -= min(missed * 10, 30)
        score = max(0, score)
        risk_level = "low" if score >= 80 else "medium" if score >= 50 else "high"
        scores.append({
            "personnel_id": person_id,
            "name": f"{p['first_name']} {p['last_name']}",
            "score": score,
            "risk_level": risk_level,
        })
    return scores

# ════════════════════════════════════════════════════════════════════════════
# DASHBOARD STATS
# ════════════════════════════════════════════════════════════════════════════

@app.get("/api/dashboard/stats")
async def get_dashboard_stats(current_user=Depends(get_current_user)):
    org_id = current_user["organisation_id"]
    now = now_utc()
    today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)

    active_officers = await db.personnel.count_documents({"organisation_id": org_id, "status": "active"})
    total_sites = await db.sites.count_documents({"organisation_id": org_id, "status": "active"})

    active_shifts = await db.shifts.count_documents({
        "organisation_id": org_id,
        "status": "active",
        "start_time": {"$lte": now.isoformat()},
        "end_time": {"$gte": now.isoformat()},
    })

    scheduled_shifts = await db.shifts.count_documents({
        "organisation_id": org_id,
        "status": "scheduled",
        "start_time": {"$gte": today_start.isoformat()},
    })

    incidents_today = await db.logs.count_documents({
        "organisation_id": org_id,
        "type": "incident",
        "created_at": {"$gte": today_start},
    })

    missed_check_calls = await db.check_calls.count_documents({
        "organisation_id": org_id,
        "status": "missed",
    })

    active_check_calls = await db.check_calls.count_documents({
        "organisation_id": org_id,
        "status": "active",
    })

    expired_licences = await db.licences.count_documents({"organisation_id": org_id, "status": "expired"})
    expiring_licences = await db.licences.count_documents({"organisation_id": org_id, "status": "expiring_soon"})

    # Recent shifts (top 5)
    recent_shifts = await db.shifts.find(
        {"organisation_id": org_id}
    ).sort("start_time", DESCENDING).limit(5).to_list(None)

    shift_list = []
    for s in recent_shifts:
        sh = to_json(s)
        site = await db.sites.find_one({"_id": ObjectId(s["site_id"])}) if s.get("site_id") else None
        person = await db.personnel.find_one({"_id": ObjectId(s["personnel_id"])}) if s.get("personnel_id") else None
        sh["site"] = to_json(site) if site else None
        sh["personnel"] = to_json(person) if person else None
        shift_list.append(sh)

    return {
        "active_officers": active_officers,
        "total_sites": total_sites,
        "active_shifts": active_shifts,
        "scheduled_shifts": scheduled_shifts,
        "incidents_today": incidents_today,
        "missed_check_calls": missed_check_calls,
        "active_check_calls": active_check_calls,
        "expired_licences": expired_licences,
        "expiring_licences": expiring_licences,
        "recent_shifts": shift_list,
    }

# ════════════════════════════════════════════════════════════════════════════
# WEATHER
# ════════════════════════════════════════════════════════════════════════════

@app.get("/api/weather")
async def get_weather(
    lat: Optional[float] = None,
    lon: Optional[float] = None,
    city: Optional[str] = None,
    current_user=Depends(get_current_user)
):
    if not WEATHER_API_KEY:
        raise HTTPException(status_code=503, detail="Weather API not configured")
    
    params = {"appid": WEATHER_API_KEY, "units": "metric"}
    if lat and lon:
        params["lat"] = lat
        params["lon"] = lon
    elif city:
        params["q"] = city
    else:
        params["q"] = "London"

    async with httpx.AsyncClient(timeout=10.0) as client:
        try:
            resp = await client.get("https://api.openweathermap.org/data/2.5/weather", params=params)
            if resp.status_code != 200:
                raise HTTPException(status_code=502, detail="Weather service unavailable")
            weather_data = resp.json()
            
            temp = weather_data["main"]["temp"]
            description = weather_data["weather"][0]["description"]
            wind_speed = weather_data["wind"]["speed"]
            
            # Determine severity
            severe_conditions = ["thunderstorm", "tornado", "hurricane", "blizzard", "heavy snow", "heavy rain", "fog"]
            caution_conditions = ["rain", "drizzle", "snow", "mist", "haze", "smoke"]
            
            desc_lower = description.lower()
            if any(c in desc_lower for c in severe_conditions) or wind_speed > 20:
                severity = "severe"
            elif any(c in desc_lower for c in caution_conditions) or wind_speed > 10:
                severity = "caution"
            else:
                severity = "normal"

            return {
                "temperature": round(temp),
                "feels_like": round(weather_data["main"]["feels_like"]),
                "description": description,
                "humidity": weather_data["main"]["humidity"],
                "wind_speed": wind_speed,
                "icon": weather_data["weather"][0]["icon"],
                "city": weather_data.get("name", ""),
                "severity": severity,
                "visibility": weather_data.get("visibility", 0),
            }
        except httpx.TimeoutException:
            raise HTTPException(status_code=504, detail="Weather service timeout")

# ════════════════════════════════════════════════════════════════════════════
# AUDIT LOGS
# ════════════════════════════════════════════════════════════════════════════

@app.get("/api/audit-logs")
async def get_audit_logs(
    limit: int = 100,
    action: Optional[str] = None,
    current_user=Depends(require_admin)
):
    query = {"organisation_id": current_user["organisation_id"]}
    if action:
        query["action"] = {"$regex": action, "$options": "i"}
    docs = await db.audit_logs.find(query).sort("created_at", DESCENDING).limit(limit).to_list(None)
    return [to_json(d) for d in docs]

# ════════════════════════════════════════════════════════════════════════════
# SEED DATA (for demo)
# ════════════════════════════════════════════════════════════════════════════

@app.post("/api/seed")
async def seed_demo_data(current_user=Depends(require_admin)):
    org_id = current_user["organisation_id"]

    # Seed sites
    sites_data = [
        {"name": "City Centre Office Complex", "address": "1 Victoria Square, Birmingham, B1 1BD", "latitude": 52.4796, "longitude": -1.9026, "type": "commercial", "contact_name": "John Smith", "contact_phone": "07700 900000"},
        {"name": "Westfield Shopping Centre", "address": "Westfield Way, London, W12 7GF", "latitude": 51.5074, "longitude": -0.2217, "type": "commercial", "contact_name": "Sarah Jones", "contact_phone": "07700 900001"},
        {"name": "Industrial Estate Unit 7", "address": "Brownfield Road, Manchester, M4 5JE", "latitude": 53.4808, "longitude": -2.2426, "type": "industrial", "contact_name": "Mike Brown", "contact_phone": "07700 900002"},
    ]
    site_ids = []
    for s in sites_data:
        existing = await db.sites.find_one({"organisation_id": org_id, "name": s["name"]})
        if not existing:
            doc = {**s, "organisation_id": org_id, "status": "active", "assigned_officers": [], "created_at": now_utc(), "updated_at": now_utc()}
            res = await db.sites.insert_one(doc)
            site_ids.append(str(res.inserted_id))
        else:
            site_ids.append(str(existing["_id"]))

    # Seed personnel
    officers_data = [
        {"first_name": "James", "last_name": "Wilson", "email": "james.wilson@guards.com", "phone": "07700 900100", "role": "Senior Officer"},
        {"first_name": "Emma", "last_name": "Thompson", "email": "emma.thompson@guards.com", "phone": "07700 900101", "role": "Security Officer"},
        {"first_name": "David", "last_name": "Clarke", "email": "david.clarke@guards.com", "phone": "07700 900102", "role": "Security Officer"},
        {"first_name": "Sarah", "last_name": "Ahmed", "email": "sarah.ahmed@guards.com", "phone": "07700 900103", "role": "Supervisor"},
    ]
    person_ids = []
    for o in officers_data:
        existing = await db.personnel.find_one({"organisation_id": org_id, "email": o["email"]})
        if not existing:
            doc = {**o, "organisation_id": org_id, "status": "active", "employee_id": f"EMP-{secrets.token_hex(3).upper()}", "created_at": now_utc(), "updated_at": now_utc()}
            res = await db.personnel.insert_one(doc)
            person_ids.append(str(res.inserted_id))
        else:
            person_ids.append(str(existing["_id"]))

    # Seed licences
    from datetime import date
    future_dates = ["2026-03-15", "2025-03-01", "2026-12-01", "2025-04-30"]
    for i, pid in enumerate(person_ids):
        existing_lic = await db.licences.find_one({"personnel_id": pid})
        if not existing_lic:
            expiry = future_dates[i % len(future_dates)]
            status_val = compute_licence_status(expiry)
            await db.licences.insert_one({
                "organisation_id": org_id,
                "personnel_id": pid,
                "type": "SIA Door Supervisor",
                "number": f"SIA-{secrets.token_hex(4).upper()}",
                "issuing_authority": "Security Industry Authority",
                "issue_date": "2023-01-01",
                "expiry_date": expiry,
                "status": status_val,
                "created_at": now_utc(),
                "updated_at": now_utc(),
            })

    # Seed shifts
    shift_times = [
        (now_utc().replace(hour=7, minute=0, second=0, microsecond=0), now_utc().replace(hour=19, minute=0, second=0, microsecond=0)),
        (now_utc().replace(hour=19, minute=0, second=0, microsecond=0), (now_utc() + timedelta(days=1)).replace(hour=7, minute=0, second=0, microsecond=0)),
        (now_utc().replace(hour=9, minute=0, second=0, microsecond=0), now_utc().replace(hour=17, minute=0, second=0, microsecond=0)),
    ]
    for i, (start, end) in enumerate(shift_times):
        if i < len(person_ids) and i < len(site_ids):
            existing_shift = await db.shifts.find_one({
                "organisation_id": org_id,
                "personnel_id": person_ids[i],
                "start_time": start.isoformat()
            })
            if not existing_shift:
                await db.shifts.insert_one({
                    "organisation_id": org_id,
                    "site_id": site_ids[i % len(site_ids)],
                    "personnel_id": person_ids[i],
                    "start_time": start.isoformat(),
                    "end_time": end.isoformat(),
                    "status": "active" if i == 0 else "scheduled",
                    "created_by": current_user["id"],
                    "created_at": now_utc(),
                    "updated_at": now_utc(),
                })

    # Seed some logs
    log_types = ["incident", "patrol", "note"]
    log_samples = [
        ("Suspicious Vehicle", "Grey Ford Transit parked outside south entrance for 3+ hours.", "incident"),
        ("North Wing Patrol", "All clear. Doors secured. No issues found.", "patrol"),
        ("CCTV Down", "Camera 3 on north corridor offline since 14:00. IT notified.", "note"),
        ("Visitor Access", "Contractor team from MaintenancePro arrived at 09:00.", "patrol"),
    ]
    for i, (title, desc, ltype) in enumerate(log_samples):
        existing_log = await db.logs.find_one({"organisation_id": org_id, "title": title})
        if not existing_log and person_ids and site_ids:
            await db.logs.insert_one({
                "organisation_id": org_id,
                "site_id": site_ids[i % len(site_ids)],
                "personnel_id": person_ids[i % len(person_ids)],
                "type": ltype,
                "title": title,
                "description": desc,
                "attachments": [],
                "created_at": now_utc() - timedelta(hours=i*2),
            })

    return {"message": "Demo data seeded successfully", "sites": len(site_ids), "personnel": len(person_ids)}

# ════════════════════════════════════════════════════════════════════════════
# WEBSOCKET (Real-time alerts)
# ════════════════════════════════════════════════════════════════════════════

@app.websocket("/api/ws/{org_id}")
async def websocket_endpoint(websocket: WebSocket, org_id: str):
    await ws_manager.connect(websocket, org_id)
    try:
        # Send initial connection confirmation
        await websocket.send_json({"type": "connected", "message": "Real-time monitoring active"})
        while True:
            # Keep connection alive with ping
            await asyncio.sleep(25)
            try:
                await websocket.send_json({"type": "ping"})
            except Exception:
                break
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket, org_id)

@app.post("/api/alerts/broadcast")
async def broadcast_alert(data: dict, current_user=Depends(get_current_user)):
    """Internal endpoint to broadcast alerts to all org members"""
    org_id = current_user["organisation_id"]
    await ws_manager.broadcast_to_org(org_id, {
        "type": "alert",
        "severity": data.get("severity", "warning"),
        "message": data.get("message", "Alert"),
        "timestamp": now_utc().isoformat(),
    })
    return {"status": "broadcast sent"}

@app.get("/api/alerts/check-overdue")
async def check_overdue_check_calls(current_user=Depends(get_current_user)):
    """Check for overdue check calls and broadcast alerts"""
    org_id = current_user["organisation_id"]
    now = now_utc()
    overdue = await db.check_calls.find({
        "organisation_id": org_id,
        "status": "active",
    }).to_list(None)

    alerts_sent = 0
    for cc in overdue:
        if cc.get("next_due_at"):
            try:
                due = cc["next_due_at"]
                if isinstance(due, str):
                    due = datetime.fromisoformat(due.replace("Z", "+00:00"))
                if due.tzinfo is None:
                    due = due.replace(tzinfo=timezone.utc)
                if now > due:
                    person = await db.personnel.find_one({"_id": ObjectId(cc["personnel_id"])})
                    site = await db.sites.find_one({"_id": ObjectId(cc["site_id"])}) if cc.get("site_id") else None
                    # Mark as missed
                    await db.check_calls.update_one(
                        {"_id": cc["_id"]},
                        {"$set": {"status": "missed", "updated_at": now}}
                    )
                    await log_audit(org_id, "system", "system", "CHECK_CALL_MISSED_AUTO",
                        {"personnel_id": cc["personnel_id"]})
                    # Broadcast
                    await ws_manager.broadcast_to_org(org_id, {
                        "type": "check_call_missed",
                        "severity": "critical",
                        "message": f"MISSED CHECK-IN: {person['first_name'] + ' ' + person['last_name'] if person else 'Unknown'} at {site['name'] if site else 'Unknown site'}",
                        "personnel_id": str(cc["personnel_id"]),
                        "check_call_id": str(cc["_id"]),
                        "timestamp": now.isoformat(),
                    })
                    alerts_sent += 1
            except Exception:
                pass

    return {"checked": len(overdue), "alerts_sent": alerts_sent}

# ════════════════════════════════════════════════════════════════════════════
# HEALTH
# ════════════════════════════════════════════════════════════════════════════

@app.get("/api/health")
async def health():
    return {"status": "ok", "service": "CoreGuard SMS API"}
