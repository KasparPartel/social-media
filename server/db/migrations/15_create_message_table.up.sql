CREATE TABLE IF NOT EXISTS "message" (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    chatId INTEGER,
    userId INTEGER,
    "text" TEXT,
    creationDate INTEGER,
    FOREIGN KEY(chatId) REFERENCES chat(id),
    FOREIGN KEY(userId) REFERENCES users(id)
);