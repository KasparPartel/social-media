CREATE TABLE IF NOT EXISTS groups (
    id INTEGER UNIQUE NOT NULL PRIMARY KEY AUTOINCREMENT,
    userId INTEGER NOT NULL,
    title TEXT NOT NULL,
    "description" TEXT DEFAULT "",
    creationDate INTEGER NOT NULL
);