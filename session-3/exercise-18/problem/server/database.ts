import { fileURLToPath } from 'url';
import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// Remove database file if it exists
const dbPath = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  'spacestation.db'
);
if (fs.existsSync(dbPath)) {
  fs.unlinkSync(dbPath);
}
const db = new Database(dbPath);

// Create tables
db.exec(`
  CREATE TABLE spacecraft (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    captain TEXT NOT NULL
  );

  CREATE TABLE docking (
    id TEXT PRIMARY KEY,
    spacecraftId TEXT NOT NULL,
    dockingTime TEXT NOT NULL,
    bayId INTEGER NOT NULL,
    status TEXT CHECK(status IN ('scheduled', 'docked', 'departing')) NOT NULL,
    FOREIGN KEY(spacecraftId) REFERENCES spacecraft(id)
  );

  CREATE TABLE notification (
    id TEXT PRIMARY KEY,
    message TEXT NOT NULL,
    timestamp TEXT NOT NULL
  );
`);

// Add transaction management functions
export function beginTransaction() {
  db.prepare('BEGIN TRANSACTION').run();
  console.log('[DB] Started transaction');
}

export function rollbackTransaction() {
  db.prepare('ROLLBACK').run();
  console.log('[DB] Rolled back transaction');
}

// Export the database instance
export default db;
