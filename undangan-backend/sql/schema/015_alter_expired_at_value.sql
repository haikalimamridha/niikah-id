-- +goose Up
ALTER TABLE invitations 
ALTER COLUMN expired_at SET DEFAULT (NOW() + INTERVAL '1 week');

-- +goose Down
ALTER TABLE invitations 
ALTER COLUMN expired_at DROP DEFAULT;