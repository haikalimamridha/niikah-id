-- +goose Up

CREATE TABLE invoices (
    id SERIAL PRIMARY KEY,

    user_id INTEGER,

    invitation_id INTEGER,

    total_price INTEGER NOT NULL,

    payment_due_date TIMESTAMP NOT NULL,

    is_paid BOOLEAN NOT NULL DEFAULT FALSE,

    receipt_proof VARCHAR(255),

    meta TEXT,

    confirmed_at TIMESTAMP,

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_invoices_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON UPDATE CASCADE
        ON DELETE SET NULL,

    CONSTRAINT fk_invoices_invitation
        FOREIGN KEY (invitation_id)
        REFERENCES invitations(id)
        ON UPDATE CASCADE
        ON DELETE SET NULL
);

CREATE INDEX idx_invoices_user
ON invoices(user_id);

CREATE INDEX idx_invoices_invitation
ON invoices(invitation_id);


-- +goose Down

DROP INDEX IF EXISTS idx_invoices_user;
DROP INDEX IF EXISTS idx_invoices_invitation;
DROP TABLE invoices;