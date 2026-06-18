-- +goose Up

CREATE TABLE views (
    id SERIAL PRIMARY KEY,

    invitation_id INTEGER NOT NULL,

    date TIMESTAMP NOT NULL,

    city VARCHAR(255),

    CONSTRAINT fk_views_invitation
        FOREIGN KEY (invitation_id)
        REFERENCES invitations(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

CREATE INDEX idx_views_invitation
ON views(invitation_id);


-- +goose Down

DROP INDEX IF EXISTS idx_views_invitation;
DROP TABLE views;