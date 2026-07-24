import mysql, { type Pool, type ResultSetHeader, type RowDataPacket } from "mysql2/promise";

let pool: Pool | null = null;
let schemaReady: Promise<void> | null = null;

function requireEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export function getPool(): Pool {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.MYSQL_HOST || "localhost",
      port: Number(process.env.MYSQL_PORT || 3306),
      database: requireEnv("MYSQL_DATABASE"),
      user: requireEnv("MYSQL_USER"),
      password: requireEnv("MYSQL_PASSWORD"),
      waitForConnections: true,
      connectionLimit: 5,
      timezone: "Z",
      dateStrings: true,
    });
  }
  return pool;
}

export async function ensureBookingsSchema(): Promise<void> {
  if (!schemaReady) {
    schemaReady = (async () => {
      const db = getPool();
      await db.execute(`
        CREATE TABLE IF NOT EXISTS bookings (
          id INT UNSIGNED NOT NULL AUTO_INCREMENT,
          full_name VARCHAR(120) NOT NULL,
          email VARCHAR(190) NOT NULL,
          phone VARCHAR(40) NULL,
          booking_date DATE NOT NULL,
          slot_hour TINYINT UNSIGNED NOT NULL,
          status ENUM('pending', 'confirmed', 'cancelled') NOT NULL DEFAULT 'pending',
          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          PRIMARY KEY (id),
          UNIQUE KEY uniq_booking_slot (booking_date, slot_hour),
          KEY idx_booking_date (booking_date)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);
    })().catch((error) => {
      schemaReady = null;
      throw error;
    });
  }

  await schemaReady;
}

export type { ResultSetHeader, RowDataPacket };
