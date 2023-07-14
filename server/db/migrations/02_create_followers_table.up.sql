CREATE TABLE IF NOT EXISTS followers (
    userId INTEGER NOT NULL,
    followerId INTEGER NOT NULL,
    isAccepted INTEGER DEFAULT 0
);