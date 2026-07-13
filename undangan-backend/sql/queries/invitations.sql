-- name: GetInvitationByID :one
SELECT *
FROM invitations
WHERE id = $1;

-- name: GetInvitationContentByID :one
SELECT *
FROM invitation_contents
WHERE invitation_id = $1;

-- name: CreateInvitation :one
INSERT INTO invitations (
    subdomain,
    owner_id,
    package_id,
    template_name,
    is_published,
    is_active
)
VALUES ($1,$2,$3,$4,$5,$6)
RETURNING *;

-- name: GetInvitationBySubdomain :one
SELECT *
FROM invitations
WHERE subdomain = $1;

-- name: GetUserInvitationByID :many
SELECT *
FROM invitations i
LEFT JOIN invitation_contents ic
    ON i.id = ic.invitation_id
WHERE i.owner_id = $1;

-- name: UpdateInvitation :one
UPDATE invitations
SET
    subdomain = $2,
    package_id = $3,
    template_name = $4,
    updated_at = NOW()
WHERE id = $1
RETURNING *;

-- name: DeleteInvitation :exec
DELETE FROM invitations
WHERE id = $1;