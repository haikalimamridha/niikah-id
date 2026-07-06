-- name: GetLatestCommentsByUser :many
SELECT
    c.name,
    c.comment,
    c.created_at
FROM comments c
INNER JOIN invitations i
    ON c.invitation_id = i.id
WHERE i.owner_id = $1
ORDER BY c.created_at DESC
LIMIT 5;
