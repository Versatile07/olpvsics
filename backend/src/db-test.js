import dotenv from "dotenv";
import mysql from "mysql2/promise";

dotenv.config();

console.log("ENV CHECK:", {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  db: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

try {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT),
  });

  const [rows] = await conn.query("SELECT 1");
  console.log("DB TEST OK:", rows);

  await conn.end();
} catch (e) {
  console.error("DB TEST FAIL:", e.message);
}
