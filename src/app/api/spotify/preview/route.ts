import { NextRequest, NextResponse } from 'next/server';

const SONG_QUERIES: Record<string, string> = {
  s1: 'Eleanor Whisper Lalu Biru',
  s2: 'Dewa 19 Kangen',
  s3: 'Overnight Kita Lewati Berdua',
  s4: 'Magnolia Celebration',
  s5: 'SAMSONS Di Ujung Jalan',
  s6: 'HiVi Pelangi',
  s7: 'Raim Laode Dunia Yang Nanti',
  s8: 'Perunggu Saling Memaafkan',
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const isCheck = searchParams.get('check') === 'true';
  const directUrl = searchParams.get('url') || '';
  const id = searchParams.get('id') || '';
  const q = searchParams.get('q') || SONG_QUERIES[id] || '';

  // If direct URL is provided and we just want to verify it
  if (directUrl) {
    if (isCheck) {
      try {
        const testRes = await fetch(directUrl, { method: 'HEAD' });
        const isValid = testRes.ok;
        return NextResponse.json({
          exists: isValid,
          previewUrl: directUrl,
          type: 'direct',
          status: testRes.status,
        });
      } catch {
        return NextResponse.json({
          exists: false,
          error: 'URL direct audio tidak dapat diakses atau diblokir CORS/Server',
        });
      }
    } else {
      return NextResponse.redirect(directUrl, 307);
    }
  }

  // If no query was given
  const query = q || 'Dewa 19 Kangen';

  try {
    const res = await fetch(`https://api.deezer.com/search?q=${encodeURIComponent(query)}&limit=1`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; PortfolioPlayer/1.0)',
      },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      if (isCheck) {
        return NextResponse.json({ exists: false, error: 'Gagal terhubung ke katalog audio' }, { status: 502 });
      }
      return new NextResponse('Failed to search audio', { status: 502 });
    }

    const data = await res.json();
    const track = data?.data?.[0];
    const previewUrl = track?.preview;

    if (previewUrl) {
      if (isCheck) {
        return NextResponse.json({
          exists: true,
          previewUrl,
          title: track?.title || '',
          artist: track?.artist?.name || '',
          album: track?.album?.title || '',
          duration: track?.duration ? `${Math.floor(track.duration / 60)}:${String(track.duration % 60).padStart(2, '0')}` : undefined,
        });
      }
      return NextResponse.redirect(previewUrl, 307);
    }
  } catch (error) {
    console.error('Error fetching audio preview:', error);
  }

  if (isCheck) {
    return NextResponse.json({
      exists: false,
      error: `Audio preview tidak ditemukan untuk "${query}". Coba masukkan nama artis dan judul yang lebih spesifik atau gunakan URL audio langsung.`,
    });
  }

  return new NextResponse('Audio preview not found', { status: 404 });
}
