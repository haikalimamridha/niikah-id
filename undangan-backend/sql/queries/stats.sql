-- name: GetDailyViewsByUser :many

SELECT 
    i.subdomain,
    DATE(v.date) as view_date,
    COUNT(*) as count
FROM views v
JOIN invitations i
    ON i.id = v.invitation_id
WHERE 
    i.owner_id = $1
    AND v.date >= $2
    AND v.date <= $3
GROUP BY i.subdomain, DATE(v.date)
ORDER BY view_date;

-- name: GetCityStatsByUser :many
SELECT
    v.city,
    COUNT(*) AS total
FROM views v
INNER JOIN invitations i
    ON v.invitation_id = i.id
WHERE i.owner_id = $1
AND v.city IS NOT NULL
GROUP BY v.city
ORDER BY total DESC;

-- name: GetTotalCommentsByUser :one
SELECT COUNT(c.id)
FROM comments c
INNER JOIN invitations i
    ON c.invitation_id = i.id
WHERE i.owner_id = $1;

-- name: GetTotalGuests :one
SELECT COUNT(g.id)
FROM guests g
INNER JOIN invitations i
    ON g.invitation_id = i.id 
WHERE i.owner_id = $1;

-- name: GetTotalInvitations :one
SELECT COUNT(id)
FROM invitations
WHERE owner_id = $1;

-- name: GetTotalViews :one
SELECT COUNT(v.id)
FROM views v
INNER JOIN invitations i
    ON v.invitation_id = i.id
WHERE i.owner_id = $1;