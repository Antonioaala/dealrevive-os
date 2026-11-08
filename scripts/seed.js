const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '../prisma/dev.db');
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS Lead (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    company TEXT NOT NULL,
    quoteAmount REAL NOT NULL,
    channel TEXT NOT NULL DEFAULT 'Email',
    status TEXT NOT NULL DEFAULT 'Activo',
    step INTEGER NOT NULL DEFAULT 0,
    callNotes TEXT NOT NULL,
    excludeFromSequence BOOLEAN NOT NULL DEFAULT 0,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS FollowUp (
    id TEXT PRIMARY KEY,
    leadId TEXT NOT NULL,
    step INTEGER NOT NULL,
    subject TEXT NOT NULL,
    emailBody TEXT NOT NULL,
    whatsappMessage TEXT NOT NULL,
    sentAt DATETIME,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (leadId) REFERENCES Lead(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS Reply (
    id TEXT PRIMARY KEY,
    leadId TEXT NOT NULL,
    message TEXT NOT NULL,
    source TEXT NOT NULL DEFAULT 'webhook',
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (leadId) REFERENCES Lead(id) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS FollowUp_leadId_idx ON FollowUp(leadId);
  CREATE INDEX IF NOT EXISTS Reply_leadId_idx ON Reply(leadId);
`);

console.log('✓ Database schema created');
console.log(`✓ Database file: ${dbPath}`);
db.close();
