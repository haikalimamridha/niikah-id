-- +goose Up

CREATE TABLE guests (
    id SERIAL PRIMARY KEY,

    invitation_id INTEGER NOT NULL,

    name VARCHAR(126) NOT NULL,

    code VARCHAR(10) NOT NULL,

    email VARCHAR(64),

    wa_number VARCHAR(20),

    address TEXT,

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_guests_invitation
        FOREIGN KEY (invitation_id)
        REFERENCES invitations(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

CREATE UNIQUE INDEX idx_guests_invitation_code
ON guests(invitation_id, code);

-- +goose Down

DROP INDEX IF EXISTS idx_guests_invitation_code;
DROP TABLE guests;