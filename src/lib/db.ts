import mysql, { type Pool, type ResultSetHeader, type RowDataPacket } from "mysql2/promise";

let pool: Pool | null = null;
let schemaReady: Promise<void> | null = null;

function requireEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    const error = new Error(`Missing required environment variable: ${name}`);
    (error as Error & { code?: string }).code = "MISSING_ENV";
    throw error;
  }
  return value;
}

function maskSecret(value: string | undefined): string {
  if (!value) return "(empty)";
  if (value.length <= 2) return "*".repeat(value.length);
  return `${value.slice(0, 1)}${"*".repeat(Math.min(value.length - 2, 8))}${value.slice(-1)}`;
}

/** Safe snapshot for logs / API debug — never includes raw password. */
export function getMysqlDebugInfo() {
    const host = process.env.MYSQL_HOST?.trim() || "(default: 127.0.0.1)";
  const port = process.env.MYSQL_PORT?.trim() || "(default: 3306)";
  const database = process.env.MYSQL_DATABASE?.trim() || "(missing)";
  const user = process.env.MYSQL_USER?.trim() || "(missing)";
  const password = process.env.MYSQL_PASSWORD;

  return {
    host,
    port,
    database,
    user,
    passwordSet: Boolean(password?.trim()),
    passwordMasked: maskSecret(password?.trim()),
    poolInitialized: Boolean(pool),
    nodeEnv: process.env.NODE_ENV || "(unset)",
  };
}

export function logMysqlDebug(stage: string, extra?: Record<string, unknown>) {
  console.info(`[MySQL] ${stage}`, {
    ...getMysqlDebugInfo(),
    ...extra,
  });
}

export function serializeError(error: unknown) {
  if (!error || typeof error !== "object") {
    return { message: String(error) };
  }

  const err = error as {
    message?: string;
    code?: string;
    errno?: number;
    sqlState?: string;
    sqlMessage?: string;
    stack?: string;
  };

  return {
    message: err.message || String(error),
    code: err.code,
    errno: err.errno,
    sqlState: err.sqlState,
    sqlMessage: err.sqlMessage,
    stack: err.stack?.split("\n").slice(0, 6).join("\n"),
  };
}

export function getPool(): Pool {
  if (!pool) {
    logMysqlDebug("Creating connection pool");
    // Prefer 127.0.0.1 over "localhost" — Node often resolves localhost to ::1 (IPv6),
    // and Hostinger MySQL users are typically granted for 127.0.0.1 / localhost only.
    pool = mysql.createPool({
      host: process.env.MYSQL_HOST || "127.0.0.1",
      port: Number(process.env.MYSQL_PORT || 3306),
      database: requireEnv("MYSQL_DATABASE"),
      user: requireEnv("MYSQL_USER"),
      password: requireEnv("MYSQL_PASSWORD"),
      waitForConnections: true,
      connectionLimit: 5,
      connectTimeout: 10000,
      timezone: "Z",
      dateStrings: true,
    });
    logMysqlDebug("Connection pool created");
  }
  return pool;
}

export async function ensureBookingsSchema(): Promise<void> {
  if (!schemaReady) {
    schemaReady = (async () => {
      logMysqlDebug("ensureBookingsSchema: start");
      const db = getPool();

      logMysqlDebug("ensureBookingsSchema: acquiring test connection");
      const connection = await db.getConnection();
      try {
        const [pingRows] = await connection.query("SELECT 1 AS ok, DATABASE() AS current_db");
        logMysqlDebug("ensureBookingsSchema: ping ok", { pingRows });

        logMysqlDebug("ensureBookingsSchema: creating bookings table if needed");
        await connection.execute(`
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

        const [tables] = await connection.query("SHOW TABLES LIKE 'bookings'");
        logMysqlDebug("ensureBookingsSchema: table check", { tables });
      } finally {
        connection.release();
      }

      logMysqlDebug("ensureBookingsSchema: done");
    })().catch((error) => {
      schemaReady = null;
      console.error("[MySQL] ensureBookingsSchema failed", serializeError(error));
      throw error;
    });
  }

  await schemaReady;
}

export type { ResultSetHeader, RowDataPacket };
