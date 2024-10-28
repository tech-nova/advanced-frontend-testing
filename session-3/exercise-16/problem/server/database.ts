// database.ts
import Database from 'better-sqlite3';

// Initialize an in-memory SQLite database
const db = new Database(':memory:');

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

// Export the database instance
export default db;
