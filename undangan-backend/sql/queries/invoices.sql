-- name: GetInvoicesByUserID :many

SELECT
    i.id,
    i.invitation_id,
    i.created_at,
    i.total_price,
    i.payment_due_date,
    i.is_paid,
    i.receipt_proof,
    i.status,
    inv.subdomain,
    inv.template_name
FROM invoices i
JOIN invitations inv
    ON inv.id = i.invitation_id
WHERE i.user_id = $1
ORDER BY i.created_at DESC;

-- name: GetInvoiceByID :one

SELECT *
FROM invoices
WHERE id = $1;

-- name: GetInvoicesByInvitationID :one

SELECT *
FROM invoices
WHERE invitation_id = $1;

-- name: CreateInvoice :one
INSERT INTO invoices (
    user_id,
    invitation_id,
    total_price,
    payment_due_date,
    status
)
VALUES (
    $1,
    $2,
    $3,
    $4,
    $5
)
RETURNING *;

-- name: UpdateInvoicePaymentStatus :exec

UPDATE invoices
SET
    status = $2,
    is_paid = $3,
    confirmed_at = $4,
    meta = $5,
    updated_at = NOW()
WHERE id = $1;
