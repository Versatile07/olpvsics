/**
 * Migration Runner
 * Reads and executes SQL migration files in order.
 * Supports per-user password hashing via HASH:email placeholders in seed SQL.
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

// =============================================
// Per-user password map
// email → plaintext password
// =============================================
const USER_PASSWORDS = {
  'admin@vsics.edu':  'lavi$h.07',
  'rahul@vsics.edu':  'lavi5h.07',
  'rekh@vsics.edu':   'RekhBCA402',
  'iqbal@vsics.edu':  'IqbalBCA102',
  'ram@vsics.edu':     'RamBCA501',
  'aparna@vsics.edu': 'AparnaBCA103',
  'nitin@vsics.edu':  'NitinBCA405',
  'ashish@vsics.edu': 'AshishBCA105',
  'sanjay@vsics.edu': 'SanjayBCA601',
  'shweta@vsics.edu': 'ShwetaBCA301',

  // Legacy test accounts (kept for tests)
  'admin@vsics.test':   'AdminPass123',
  'faculty@vsics.test': 'FacultyPass123',
  'student1@vsics.test':'StudentPass123',
  'student2@vsics.test':'StudentPass123',
};

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

    // If this is the seed file, replace HASH:email placeholders with real bcrypt hashes
    if (file.includes('seed')) {
      console.log('  Generating bcrypt hashes for users...');
      for (const [email, plainPassword] of Object.entries(USER_PASSWORDS)) {
        const hash = await bcrypt.hash(plainPassword, 10);
        // Replace all occurrences of 'HASH:email' with the bcrypt hash
        const placeholder = `HASH:${email}`;
        sql = sql.replaceAll(placeholder, hash);
      }
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
