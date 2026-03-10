/**
 * Migration Runner
 * Reads and executes SQL migration files in order.
 * Usage: node db/migrate.js
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

async function migrate() {
  // Connect without database first to allow CREATE DATABASE
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true,
  });

  const migrationsDir = path.join(__dirname, 'migrations');
  const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort();

  console.log(`Found ${files.length} migration file(s):`);

  for (const file of files) {
    const filePath = path.join(migrationsDir, file);
    let sql = fs.readFileSync(filePath, 'utf8');

    // If this is the seed file, generate proper bcrypt hashes
    if (file.includes('seed')) {
      const adminHash = await bcrypt.hash('AdminPass123', 10);
      const facultyHash = await bcrypt.hash('FacultyPass123', 10);
      const studentHash = await bcrypt.hash('StudentPass123', 10);

      // Replace placeholder hashes with real ones
      sql = sql
        .replace(
          /'\$2b\$10\$8KzaNdKIMyOkASCYkNHXSuDr1gLXrb3pVnD4G3eNqVqLGXpKq3EDm'/g,
          `'${adminHash}'`
        );

      // More targeted replacements for faculty and student passwords
      // Since all placeholders are the same, we handle it by replacing line by line
      const lines = sql.split('\n');
      const processedLines = [];
      for (const line of lines) {
        if (line.includes('faculty@vsics.test')) {
          processedLines.push(line.replace(adminHash, facultyHash));
        } else if (line.includes('student1@vsics.test') || line.includes('student2@vsics.test')) {
          processedLines.push(line.replace(adminHash, studentHash));
        } else {
          processedLines.push(line);
        }
      }
      sql = processedLines.join('\n');
    }

    console.log(`  Running: ${file}...`);
    try {
      await connection.query(sql);
      console.log(`  ✓ ${file} completed`);
    } catch (err) {
      console.error(`  ✗ ${file} failed:`, err.message);
      process.exit(1);
    }
  }

  await connection.end();
  console.log('\nAll migrations completed successfully!');
}

migrate().catch(err => {
  console.error('Migration failed:', err.message);
  process.exit(1);
});
