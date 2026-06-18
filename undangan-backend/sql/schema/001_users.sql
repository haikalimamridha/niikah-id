-- +goose Up

CREATE TYPE user_role AS ENUM ('user', 'admin');

CREATE TABLE users (
    id SERIAL PRIMARY KEY,

    email VARCHAR(64) NOT NULL UNIQUE,

    password VARCHAR(255) NOT NULL,

    name VARCHAR(126) NOT NULL,

    role user_role NOT NULL DEFAULT 'user',

    phone VARCHAR(20),

    is_verified BOOLEAN NOT NULL DEFAULT FALSE,

    photo TEXT,

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- +goose Down

DROP TABLE users;
DROP TYPE user_role;