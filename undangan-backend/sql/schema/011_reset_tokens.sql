-- +goose Up

CREATE TABLE reset_tokens (
    id SERIAL PRIMARY KEY,

    user_id INTEGER NOT NULL,

    token VARCHAR(255) NOT NULL,

    expired_at TIMESTAMP NOT NULL,

    CONSTRAINT fk_reset_tokens_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

CREATE INDEX idx_reset_tokens_user
ON reset_tokens(user_id);


-- +goose Down

DROP INDEX IF EXISTS idx_reset_tokens_user;
DROP TABLE reset_tokens;