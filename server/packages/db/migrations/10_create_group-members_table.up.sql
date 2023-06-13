CREATE TABLE IF NOT EXISTS group_members (
    groupId INTEGER NOT NULL,
    userId INTEGER NOT NULL,
    isAccepted INTEGER DEFAULT 0
);