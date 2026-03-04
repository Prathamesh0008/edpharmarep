//app/api/visitors/route.js

import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'visitors.json');

// Ensure data directory exists
async function ensureDataFile() {
  try {
    await fs.access(path.dirname(DATA_FILE));
  } catch {
    await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  }
  
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, JSON.stringify({ count: 0, ips: [] }));
  }
}

async function getVisitorData() {
  await ensureDataFile();
  const data = await fs.readFile(DATA_FILE, 'utf8');
  return JSON.parse(data);
}

async function saveVisitorData(data) {
  await fs.writeFile(DATA_FILE, JSON.stringify(data));
}

export async function GET(request) {
  // Get client IP
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
             request.headers.get('x-real-ip') || 
             'unknown';
  
  const data = await getVisitorData();
  
  // Check if this IP has visited before
  if (!data.ips.includes(ip)) {
    data.ips.push(ip);
    data.count = data.ips.length;
    await saveVisitorData(data);
  }
  
  return NextResponse.json({ count: data.count });
}