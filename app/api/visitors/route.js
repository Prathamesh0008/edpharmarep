import { NextResponse } from 'next/server';

// This is a simple in-memory store - replace with a database in production
let visitorCount = 0;
const visitedIPs = new Set();

export async function GET(request) {
  // Get client IP
  const ip = request.headers.get('x-forwarded-for') || 
             request.headers.get('x-real-ip') || 
             'unknown';
  
  // Check if this IP has visited before
  if (!visitedIPs.has(ip)) {
    visitedIPs.add(ip);
    visitorCount++;
  }
  
  return NextResponse.json({ count: visitorCount });
}