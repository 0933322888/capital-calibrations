const fs = require("fs");
const path = require("path");
const mysql = require("mysql2/promise");

function loadEnv(filePath) {
  const env = {};
  if (!fs.existsSync(filePath)) return env;
  for (const line of fs.readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    env[trimmed.slice(0, eq)] = trimmed.slice(eq + 1);
  }
  return env;
}

async function main() {
  const env = loadEnv(path.join(__dirname, "..", ".env.local"));
  const config = {
    host: env.MYSQL_HOST || "localhost",
    port: Number(env.MYSQL_PORT || 3306),
    user: env.MYSQL_USER,
    password: env.MYSQL_PASSWORD,
    database: env.MYSQL_DATABASE,
    connectTimeout: 10000,
  };

  console.log(`Connecting to ${config.user}@${config.host}:${config.port}/${config.database}...`);

  const connection = await mysql.createConnection(config);
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
  console.log("OK: connected and bookings table is ready.");
  await connection.end();
}

main().catch((error) => {
  console.error("DB connect failed:", error.code || "", error.message);
  process.exit(1);
});
