-- name: CreateInvitationGalleries :one
INSERT INTO invitation_galleries (
    invitation_id,
    url_photo
)
VALUES (
    $1,$2
)
RETURNING *;