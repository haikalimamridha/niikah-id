-- +goose Up

ALTER TABLE invoices
ADD COLUMN status VARCHAR(20) NOT NULL DEFAULT 'not_paid';


-- +goose Down

DROP INDEX IF EXISTS idx_invoices_status;

ALTER TABLE invoices
DROP COLUMN status;