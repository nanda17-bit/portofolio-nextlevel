import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const API_SECRET_KEY = process.env.PORTFOLIO_API_KEY || 'baliq_secret_api_key_2026';
const ADMIN_PASSCODE = process.env.ADMIN_PASSCODE || 'baliq2026';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-api-key',
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function POST(req: Request) {
  try {
    // Check Authorization / API Key
    const apiKey = req.headers.get('x-api-key');
    const authHeader = req.headers.get('authorization')?.replace('Bearer ', '');
    const isAuthorized =
      !apiKey && !authHeader // allow local uploads if no auth header passed
        ? true
        : apiKey === API_SECRET_KEY ||
          apiKey === ADMIN_PASSCODE ||
          authHeader === API_SECRET_KEY ||
          authHeader === ADMIN_PASSCODE;

    if (!isAuthorized) {
      return NextResponse.json(
        { error: 'Unauthorized: Invalid API key' },
        { status: 401, headers: corsHeaders }
      );
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400, headers: corsHeaders }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const ext = path.extname(file.name).toLowerCase() || '.jpg';
    const allowed = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg'];
    if (!allowed.includes(ext)) {
      return NextResponse.json(
        { error: 'Hanya file gambar (JPG, PNG, WebP, GIF, SVG) yang diperbolehkan' },
        { status: 400, headers: corsHeaders }
      );
    }

    const uploadDir = path.resolve(process.cwd(), 'public/uploads/projects');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filename = `project-${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`;
    const filePath = path.join(uploadDir, filename);

    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/uploads/projects/${filename}`;
    return NextResponse.json(
      {
        success: true,
        url: publicUrl,
        filename,
      },
      { headers: corsHeaders }
    );
  } catch (err: any) {
    console.error('Upload error in portofolio:', err);
    return NextResponse.json(
      { error: err.message || 'Gagal mengupload gambar' },
      { status: 500, headers: corsHeaders }
    );
  }
}

