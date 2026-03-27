import { auth } from "../lib/auth";
import { Router } from "express";

const router = Router();

// Mount Better Auth handler under /auth/*
router.use("/auth/*", auth.handler);

export default router;
