import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const INCIDENTS_FILE = path.join(process.cwd(), 'data', 'incidents.json');

function readIncidents() {
  try {
    return JSON.parse(fs.readFileSync(INCIDENTS_FILE, 'utf8'));
  } catch {
    return [];
  }
}

function writeIncidents(data) {
  fs.writeFileSync(INCIDENTS_FILE, JSON.stringify(data, null, 2));
}

function isAuthorized(request) {
  const apiKey = request.headers.get('x-status-api-key');
  return apiKey && apiKey === (process.env.STATUS_API_KEY || 'coreguard-status-admin-key');
}

// GET /api/incidents — public read
export async function GET() {
  const incidents = readIncidents();
  return NextResponse.json(incidents);
}

// POST /api/incidents — protected: create new incident
// Body: { "title": "...", "description": "...", "service": "api", "status": "investigating" }
export async function POST(request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, description, service, status } = body;

    if (!title || !description || !status) {
      return NextResponse.json({ error: 'Missing required fields: title, description, status' }, { status: 400 });
    }

    const validStatuses = ['investigating', 'identified', 'monitoring', 'resolved'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: `Invalid status. Must be: ${validStatuses.join(', ')}` }, { status: 400 });
    }

    const incidents = readIncidents();
    const now = new Date().toISOString();

    const incident = {
      id: `inc-${String(incidents.length + 1).padStart(3, '0')}`,
      title,
      description,
      status,
      service: service || 'general',
      createdAt: now,
      updatedAt: now,
      updates: [
        { status, message: description, timestamp: now },
      ],
    };

    incidents.unshift(incident);
    writeIncidents(incidents);

    return NextResponse.json(incident, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}

// PUT /api/incidents — protected: update existing incident
// Body: { "id": "inc-001", "status": "resolved", "message": "Issue has been fixed." }
export async function PUT(request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, status, message } = body;

    if (!id || !status || !message) {
      return NextResponse.json({ error: 'Missing required fields: id, status, message' }, { status: 400 });
    }

    const incidents = readIncidents();
    const incident = incidents.find(i => i.id === id);

    if (!incident) {
      return NextResponse.json({ error: `Incident not found: ${id}` }, { status: 404 });
    }

    const now = new Date().toISOString();
    incident.status = status;
    incident.updatedAt = now;
    incident.updates.push({ status, message, timestamp: now });

    writeIncidents(incidents);

    return NextResponse.json(incident);
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
