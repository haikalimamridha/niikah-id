-- +goose Up
UPDATE invitations SET expired_at = (NOW() + INTERVAL '1 week') WHERE expired_at IS NULL;
ALTER TABLE invitations ALTER COLUMN expired_at SET NOT NULL;

-- +goose Down
ALTER TABLE invitations 
ALTER COLUMN expired_at DROP NOT NULL;