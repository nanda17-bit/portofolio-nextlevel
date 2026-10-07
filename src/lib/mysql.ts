import mysql from 'mysql2/promise';
import type { Pool } from 'mysql2/promise';
import fs from 'fs';
import path from 'path';

let pool: Pool | null = null;

export function getDbPool(): Pool {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST || '127.0.0.1',
      port: Number(process.env.DB_PORT) || 3306,
      user: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_DATABASE || 'portofolio_db',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  }
  return pool;
}

export async function getPortfolioData(): Promise<any> {
  try {
    const db = getDbPool();
    const [rows]: [any[], any] = await db.query(
      'SELECT data_json FROM portfolio_data WHERE id = ? LIMIT 1',
      ['main']
    );

    if (rows && rows.length > 0 && rows[0].data_json) {
      const parsed = typeof rows[0].data_json === 'string'
        ? JSON.parse(rows[0].data_json)
        : rows[0].data_json;
      return parsed;
    }
  } catch (err) {
    console.warn('[MySQL] Failed to query portfolio_data, falling back to local file backup:', err);
  }

  // Fallback to local backup json if MySQL connection or record is missing
  try {
    const backupPath = path.resolve(process.cwd(), 'data/portfolio-db.json');
    if (fs.existsSync(backupPath)) {
      return JSON.parse(fs.readFileSync(backupPath, 'utf8'));
    }
  } catch (e) {
    console.error('[MySQL Fallback] Failed to read backup file:', e);
  }
  return null;
}

export async function savePortfolioData(data: any): Promise<boolean> {
  if (!data || typeof data !== 'object') return false;

  // 1. Save to MySQL
  try {
    const db = getDbPool();
    const jsonStr = JSON.stringify(data);

    // Save master JSON in portfolio_data
    await db.query(
      'INSERT INTO portfolio_data (id, data_json) VALUES (?, ?) ON DUPLICATE KEY UPDATE data_json = VALUES(data_json)',
      ['main', jsonStr]
    );

    // Sync relational tables if they exist
    try {
      if (Array.isArray(data.projects)) {
        await db.query('TRUNCATE TABLE projects');
        for (const p of data.projects) {
          await db.query(
            `INSERT INTO projects (id, title, subtitle, category, description, image_url, tags, demo_url, github_url, featured, pinned, year)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              p.id,
              p.title || '',
              p.subtitle || null,
              p.category || 'Web Platform',
              p.description || '',
              p.imageUrl || '',
              JSON.stringify(p.tags || []),
              p.demoUrl || null,
              p.githubUrl || null,
              p.featured ? 1 : 0,
              p.pinned ? 1 : 0,
              p.year || '2026',
            ]
          );
        }
      }

      if (Array.isArray(data.techStack)) {
        await db.query('TRUNCATE TABLE tech_stack');
        for (let i = 0; i < data.techStack.length; i++) {
          const t = data.techStack[i];
          await db.query(
            'INSERT INTO tech_stack (id, name, category, description, icon_key, color, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [t.id, t.name || '', t.category || '', t.description || '', t.iconKey || '', t.color || '', i]
          );
        }
      }

      if (Array.isArray(data.songs)) {
        await db.query('TRUNCATE TABLE spotify_songs');
        for (const s of data.songs) {
          await db.query(
            `INSERT INTO spotify_songs (id, title, artist, album, genre, duration, cover_url, preview_url, spotify_url, color, gradient, lyrics)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              s.id,
              s.title || '',
              s.artist || '',
              s.album || '',
              s.genre || '',
              s.duration || '',
              s.coverUrl || '',
              s.previewUrl || '',
              s.spotifyUrl || '',
              s.color || '',
              s.gradient || '',
              s.lyrics || '',
            ]
          );
        }
      }
    } catch (syncErr) {
      console.warn('[MySQL] Non-critical sync warning for relational tables:', syncErr);
    }
  } catch (dbErr) {
    console.error('[MySQL] Failed to save portfolio data to database:', dbErr);
  }

  // 2. Also save to local JSON file for backup sync
  try {
    const backupPath = path.resolve(process.cwd(), 'data/portfolio-db.json');
    const dir = path.dirname(backupPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(backupPath, JSON.stringify(data, null, 2), 'utf8');
  } catch (fsErr) {
    console.error('[File Backup] Failed to write local json file:', fsErr);
  }

  return true;
}
