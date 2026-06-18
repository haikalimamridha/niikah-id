-- +goose Up

CREATE TABLE packages (
    id SERIAL PRIMARY KEY,

    name VARCHAR(255) NOT NULL,

    price INTEGER NOT NULL,

    description TEXT,

    duration INTEGER NOT NULL DEFAULT 0,

    max_event INTEGER NOT NULL DEFAULT 0,

    max_guest INTEGER NOT NULL DEFAULT 0,

    max_comment INTEGER NOT NULL DEFAULT 0,

    max_gallery INTEGER NOT NULL DEFAULT 0,

    youtube_link BOOLEAN NOT NULL DEFAULT FALSE,

    broadcast_template BOOLEAN NOT NULL DEFAULT FALSE,

    music_background BOOLEAN NOT NULL DEFAULT FALSE,

    quote BOOLEAN NOT NULL DEFAULT FALSE,

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- +goose Down

DROP TABLE packages;