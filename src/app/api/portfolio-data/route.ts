import { NextResponse } from 'next/server';
import { getPortfolioData, savePortfolioData } from '@/lib/mysql';
import { DEFAULT_PORTFOLIO_DATA } from '@/data/defaultData';

const API_SECRET_KEY = process.env.PORTFOLIO_API_KEY || 'baliq_secret_api_key_2026';
const ADMIN_PASSCODE = process.env.ADMIN_PASSCODE || 'baliq2026';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-api-key',
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function GET() {
  const data = await getPortfolioData();
  return NextResponse.json(data || DEFAULT_PORTFOLIO_DATA, {
    headers: {
      ...corsHeaders,
      'Cache-Control': 'no-store, max-age=0',
    },
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = (await getPortfolioData()) || DEFAULT_PORTFOLIO_DATA;

    // 1. Public contact form message submission
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

      await savePortfolioData(data);
      return NextResponse.json(
        { success: true, message: newMessage },
        { headers: corsHeaders }
      );
    }

    // 2. Admin data modification via REST API
    // Check Authorization / API Key
    const apiKey = req.headers.get('x-api-key');
    const authHeader = req.headers.get('authorization')?.replace('Bearer ', '');
    const isAuthorized =
      apiKey === API_SECRET_KEY ||
      apiKey === ADMIN_PASSCODE ||
      authHeader === API_SECRET_KEY ||
      authHeader === ADMIN_PASSCODE;

    // Check if the payload is a save operation
    const isSaveOperation =
      body.type === 'save_data' ||
      body.type === 'update_all' ||
      Boolean(body.hero || body.projects);

    if (isSaveOperation) {
      if (!isAuthorized) {
        return NextResponse.json(
          { error: 'Unauthorized: Invalid or missing API key (x-api-key)' },
          { status: 401, headers: corsHeaders }
        );
      }

      // Extract updated data
      const updatedData = body.data || body;
      if (updatedData && typeof updatedData === 'object') {
        const merged = {
          ...data,
          ...updatedData,
          messages: Array.isArray(updatedData.messages) ? updatedData.messages : data.messages || [],
        };
        await savePortfolioData(merged);
        return NextResponse.json(
          {
            success: true,
            message: 'Portfolio data updated successfully via REST API',
            timestamp: new Date().toISOString(),
          },
          { headers: corsHeaders }
        );
      }
    }

    return NextResponse.json(
      { error: 'Invalid operation' },
      { status: 400, headers: corsHeaders }
    );
  } catch (err: any) {
    console.error('API portfolio-data error:', err);
    return NextResponse.json(
      { error: err.message || 'Internal Server Error' },
      { status: 500, headers: corsHeaders }
    );
  }
}
