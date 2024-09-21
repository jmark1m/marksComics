import sqlite3 from 'sqlite3';
import { promisify } from 'util';

const db = new sqlite3.Database('database.db');

db.run = promisify(db.run);
db.get = promisify(db.get);
db.all = promisify(db.all);

// Create the comics table if it doesn't exist
db.run(`
  CREATE TABLE IF NOT EXISTS comics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    issue_number INTEGER,
    publisher TEXT
  )
`).then(() => {
  console.log('Comics table created or already exists');
}).catch((error) => {
  console.error('Error creating comics table:', error);
});

export default db;