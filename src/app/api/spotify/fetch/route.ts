import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

function extractTrackId(url: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  const match = trimmed.match(/(?:track\/|track:)([a-zA-Z0-9]+)/);
  if (match) return match[1];
  if (/^[a-zA-Z0-9]{22}$/.test(trimmed)) return trimmed;
  return null;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const url = body?.url || '';
    return await handleFetchSpotify(url);
  } catch {
    return NextResponse.json({ success: false, error: 'Format request tidak valid.' }, { status: 400 });
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url') || '';
  return await handleFetchSpotify(url);
}

async function handleFetchSpotify(inputUrl: string) {
  if (!inputUrl || !inputUrl.trim()) {
    return NextResponse.json({
      success: false,
      error: 'Masukkan tautan / URL lagu Spotify terlebih dahulu (misal: https://open.spotify.com/track/...)',
    }, { status: 400 });
  }

  const trackId = extractTrackId(inputUrl);
  if (!trackId) {
    return NextResponse.json({
      success: false,
      error: 'Tautan Spotify tidak dikenali. Pastikan URL berupa link track lagu Spotify yang valid.',
    }, { status: 400 });
  }

  const spotifyUrl = `https://open.spotify.com/track/${trackId}`;
  let title = '';
  let artist = '';
  let album = '';
  let duration = '3:30';
  let coverUrl = '';
  let previewUrl = '';
  let color = '#18181b';
  let gradient = 'linear-gradient(135deg, #18181b, #09090b)';

  // STEP 1: Fetch metadata from Spotify Embed page using curl (fast, reliable, bypasses HTTP/2 timeout)
  try {
    const embedUrl = `https://open.spotify.com/embed/track/${trackId}`;
    const { stdout } = await execAsync(`curl -s -L --max-time 6 "${embedUrl}"`);
    const match = stdout.match(/<script id="__NEXT_DATA__" type="application\/json">([^<]+)<\/script>/);
    if (match) {
      const parsed = JSON.parse(match[1]);
      const entity = parsed.props?.pageProps?.state?.data?.entity;
      if (entity) {
        title = entity.title || entity.name || '';
        artist = entity.artists?.map((a: { name: string }) => a.name).join(', ') || '';
        album = entity.name || title;

        if (entity.duration) {
          const m = Math.floor(entity.duration / 60000);
          const s = Math.floor((entity.duration % 60000) / 1000);
          duration = `${m}:${String(s).padStart(2, '0')}`;
        }

        const images = entity.visualIdentity?.image || [];
        coverUrl = images[0]?.url || images[images.length - 1]?.url || '';
        previewUrl = entity.audioPreview?.url || '';

        const bg = entity.visualIdentity?.backgroundBase;
        if (bg) {
          color = `rgb(${bg.red}, ${bg.green}, ${bg.blue})`;
          gradient = `linear-gradient(135deg, rgb(${bg.red}, ${bg.green}, ${bg.blue}) 0%, #0d0d11 100%)`;
        }
      }
    }
  } catch (err) {
    console.warn('Embed curl extraction error:', err);
  }

  // STEP 2: Fallback to Spotify oEmbed if title or coverUrl is still missing
  if (!title || !coverUrl) {
    try {
      const oembedRes = await fetch(`https://open.spotify.com/oembed?url=${encodeURIComponent(spotifyUrl)}`);
      if (oembedRes.ok) {
        const oembed = await oembedRes.json();
        title = title || oembed.title || '';
        coverUrl = coverUrl || oembed.thumbnail_url || '';
      }
    } catch (err) {
      console.warn('oEmbed fetch error:', err);
    }
  }

  // STEP 3: Fallback to Deezer API to get/verify Audio Preview 30s & Artist Name if missing
  if (!previewUrl || !artist) {
    try {
      const query = `${title} ${artist}`.trim();
      if (query) {
        const deezerRes = await fetch(`https://api.deezer.com/search?q=${encodeURIComponent(query)}&limit=1`, {
          next: { revalidate: 3600 },
        });
        if (deezerRes.ok) {
          const deezerData = await deezerRes.json();
          const tr = deezerData.data?.[0];
          if (tr) {
            title = title || tr.title;
            artist = artist || tr.artist?.name || '';
            album = album || tr.album?.title || 'Single';
            previewUrl = previewUrl || tr.preview || '';
            if (!coverUrl) coverUrl = tr.album?.cover_xl || tr.album?.cover_medium || '';
            if (tr.duration && duration === '3:30') {
              const m = Math.floor(tr.duration / 60);
              const s = tr.duration % 60;
              duration = `${m}:${String(s).padStart(2, '0')}`;
            }
          }
        }
      }
    } catch (err) {
      console.warn('Deezer fallback error:', err);
    }
  }

  // If still no previewUrl, use proxy route with query
  if (!previewUrl && (title || artist)) {
    previewUrl = `/api/spotify/preview?q=${encodeURIComponent(`${artist} ${title}`.trim())}`;
  }

  // STEP 4: Auto-fetch lyrics from lrclib
  let lyrics = '';
  if (title && artist) {
    try {
      const lyrRes = await fetch(
        `https://lrclib.net/api/get?track_name=${encodeURIComponent(title)}&artist_name=${encodeURIComponent(artist)}`,
        { signal: AbortSignal.timeout(4000) }
      );
      if (lyrRes.ok) {
        const lyrData = await lyrRes.json();
        lyrics = lyrData?.plainLyrics || '';
      }
    } catch {
      // Lyrics are optional
    }
  }

  if (!title) {
    return NextResponse.json({
      success: false,
      error: 'Tidak dapat mengambil data dari link Spotify tersebut. Pastikan link lagu masih aktif dan bersifat publik.',
    }, { status: 404 });
  }

  return NextResponse.json({
    success: true,
    data: {
      title,
      artist: artist || 'Various Artists',
      album: album || title,
      genre: 'Spotify Track',
      duration,
      coverUrl,
      previewUrl,
      spotifyUrl,
      color,
      gradient,
      lyrics,
    },
  });
}
