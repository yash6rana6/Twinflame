import { NextResponse } from 'next/server';
import { registerController } from '@/controllers/auth.controller';

export async function POST(req) {
  const { status, body } = await registerController(req);
  return NextResponse.json(body, { status });
}
