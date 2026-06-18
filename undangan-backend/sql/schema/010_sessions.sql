-- +goose Up

CREATE TABLE sessions (
    session_id VARCHAR(32) PRIMARY KEY,

    expires TIMESTAMP,

    data TEXT,

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);


-- +goose Down

DROP TABLE sessions;