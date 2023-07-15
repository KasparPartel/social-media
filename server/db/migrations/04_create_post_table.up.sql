CREATE TABLE IF NOT EXISTS posts (
    id INTEGER UNIQUE NOT NULL PRIMARY KEY AUTOINCREMENT,
    groupId INTEGER DEFAULT 0,
    userId INTEGER NOT NULL,
    text TEXT DEFAULT "",
    creationDate INTEGER NOT NULL,
    privacy INTEGER DEFAULT 1
);