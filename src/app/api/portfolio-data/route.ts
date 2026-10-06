import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { DEFAULT_PORTFOLIO_DATA } from '@/data/defaultData';

const DB_PATH = path.resolve(process.cwd(), 'data/portfolio-db.json');

function readDb() {
  try {
    if (fs.existsSync(DB_PATH)) {
      const content = fs.readFileSync(DB_PATH, 'utf8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.error('Failed to read portfolio-db.json:', err);
  }
  return DEFAULT_PORTFOLIO_DATA;
}

export async function GET() {
  const data = readDb();
  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 'no-store, max-age=0',
    },
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = readDb();

    if (body.type === 'message') {
      const newMessage = {
        id: `msg-${Date.now()}`,
        name: body.name || 'Anonymous',
        email: body.email || '',
        subject: body.subject || 'Pesan dari Portofolio',
        message: body.message || '',
        createdAt: new Date().toISOString(),
        read: false,
      };

      const messages = Array.isArray(data.messages) ? data.messages : [];
      messages.unshift(newMessage);
      data.messages = messages;

      fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
      return NextResponse.json({ success: true, message: newMessage });
    }

    if (body.type === 'save_data' || body.type === 'update_all') {
      const updatedData = body.data;
      if (updatedData && typeof updatedData === 'object') {
        const merged = {
          ...data,
          ...updatedData,
          messages: Array.isArray(updatedData.messages) ? updatedData.messages : data.messages || [],
        };
        fs.writeFileSync(DB_PATH, JSON.stringify(merged, null, 2), 'utf8');
        return NextResponse.json({ success: true, data: merged });
      }
    }

    return NextResponse.json({ error: 'Unsupported operation' }, { status: 400 });
  } catch (err: any) {
    console.error('API Error in /api/portfolio-data:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
