-- +goose Up

CREATE TABLE comments (
    id SERIAL PRIMARY KEY,

    invitation_id INTEGER NOT NULL,

    name VARCHAR(255) NOT NULL,

    comment TEXT NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_comments_invitation
        FOREIGN KEY (invitation_id)
        REFERENCES invitations(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

CREATE INDEX idx_comments_invitation
ON comments(invitation_id);

-- +goose Down

DROP INDEX IF EXISTS idx_comments_invitation;
DROP TABLE comments;