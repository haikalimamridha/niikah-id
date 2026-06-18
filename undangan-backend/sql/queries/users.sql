-- name: CreateUser :one
INSERT INTO users (
    email,
    password,
    name,
    phone
) VALUES (
    $1, $2, $3, $4
)
RETURNING *;


-- name: GetUserByID :one
SELECT *
FROM users
WHERE id = $1
LIMIT 1;


-- name: GetUserByEmail :one
SELECT *
FROM users
WHERE email = $1
LIMIT 1;


-- name: ListUsers :many
SELECT *
FROM users
ORDER BY id;


-- name: DeleteUser :exec
DELETE FROM users
WHERE id = $1;