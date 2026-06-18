-- +goose Up

CREATE TABLE invitation_contents (
    id SERIAL PRIMARY KEY,

    invitation_id INTEGER NOT NULL UNIQUE,

    title VARCHAR(64) NOT NULL,

    male_name VARCHAR(126) NOT NULL,

    female_name VARCHAR(126) NOT NULL,

    male_nickname VARCHAR(126),

    female_nickname VARCHAR(126),

    male_parents VARCHAR(126),

    female_parents VARCHAR(126),

    url_photo_male TEXT,

    url_photo_female TEXT,

    url_photo_main TEXT,

    url_bg_music TEXT,

    url_youtube TEXT,

    broadcast_template TEXT,

    quote TEXT,

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_invitation_contents_invitation
        FOREIGN KEY (invitation_id)
        REFERENCES invitations(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

CREATE INDEX idx_invitation_contents_invitation
ON invitation_contents(invitation_id);

-- +goose Down

DROP INDEX IF EXISTS idx_invitation_contents_invitation;
DROP TABLE invitation_contents;