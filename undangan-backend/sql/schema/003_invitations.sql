-- +goose Up

CREATE TABLE invitations (
    id SERIAL PRIMARY KEY,

    subdomain VARCHAR(255) NOT NULL UNIQUE,

    owner_id INTEGER NOT NULL,

    package_id INTEGER,

    template_name VARCHAR(255),

    is_published BOOLEAN NOT NULL DEFAULT FALSE,

    is_active BOOLEAN NOT NULL DEFAULT FALSE,

    expired_at TIMESTAMP,

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_invitations_owner
        FOREIGN KEY (owner_id)
        REFERENCES users(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    CONSTRAINT fk_invitations_package
        FOREIGN KEY (package_id)
        REFERENCES packages(id)
        ON UPDATE CASCADE
        ON DELETE SET NULL
);

CREATE INDEX idx_invitations_owner
ON invitations(owner_id);

-- +goose Down

DROP INDEX IF EXISTS idx_invitations_owner;
DROP TABLE invitations;