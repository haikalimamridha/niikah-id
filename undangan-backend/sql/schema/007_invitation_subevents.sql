-- +goose Up

CREATE TABLE invitation_subevents (
    id SERIAL PRIMARY KEY,

    invitation_id INTEGER NOT NULL,

    name VARCHAR(126) NOT NULL,

    location_name VARCHAR(126) NOT NULL,

    location_address TEXT,

    location_coordinate VARCHAR(255),

    time_start TIMESTAMP NOT NULL,

    time_end TIMESTAMP NOT NULL,

    is_primary BOOLEAN NOT NULL DEFAULT FALSE,

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_invitation_subevents_invitation
        FOREIGN KEY (invitation_id)
        REFERENCES invitations(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

CREATE INDEX idx_invitation_subevents_invitation
ON invitation_subevents(invitation_id);


-- +goose Down

DROP INDEX IF EXISTS idx_invitation_subevents_invitation;
DROP TABLE invitation_subevents;