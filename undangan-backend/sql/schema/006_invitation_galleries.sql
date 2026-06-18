-- +goose Up

CREATE TABLE invitation_galleries (
    id SERIAL PRIMARY KEY,

    invitation_id INTEGER NOT NULL,

    url_photo VARCHAR(255),

    CONSTRAINT fk_invitation_galleries_invitation
        FOREIGN KEY (invitation_id)
        REFERENCES invitations(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

CREATE INDEX idx_invitation_galleries_invitation
ON invitation_galleries(invitation_id);


-- +goose Down

DROP INDEX IF EXISTS idx_invitation_galleries_invitation;
DROP TABLE invitation_galleries;