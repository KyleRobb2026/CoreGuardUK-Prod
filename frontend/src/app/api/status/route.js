import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const STATUS_FILE = path.join(process.cwd(), 'data', 'status.json');

function readStatus() {
  try {
    return JSON.parse(fs.readFileSync(STATUS_FILE, 'utf8'));
  } catch {
    return { services: {}, overall: 'operational' };
  }
}

function writeStatus(data) {
  fs.writeFileSync(STATUS_FILE, JSON.stringify(data, null, 2));
}

// GET /api/status — public read
export async function GET() {
  const data = readStatus();
  return NextResponse.json(data);
}

// PUT /api/status — protected write (update service status)
// Body: { "service": "api", "status": "operational" | "degraded" | "outage" }
export async function PUT(request) {
  const apiKey = request.headers.get('x-status-api-key');
  if (!apiKey || apiKey !== (process.env.STATUS_API_KEY || 'coreguard-status-admin-key')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { service, status } = body;

    if (!service || !status) {
      return NextResponse.json({ error: 'Missing service or status' }, { status: 400 });
    }

    const validStatuses = ['operational', 'degraded', 'outage'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: `Invalid status. Must be: ${validStatuses.join(', ')}` }, { status: 400 });
    }

    const data = readStatus();
    if (!data.services[service]) {
      return NextResponse.json({ error: `Unknown service: ${service}` }, { status: 400 });
    }

    data.services[service].status = status;
    data.services[service].lastChecked = new Date().toISOString();

    // Recalculate overall status
    const statuses = Object.values(data.services).map(s => s.status);
    if (statuses.includes('outage')) {
      data.overall = 'outage';
    } else if (statuses.includes('degraded')) {
      data.overall = 'degraded';
    } else {
      data.overall = 'operational';
    }

    writeStatus(data);
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
