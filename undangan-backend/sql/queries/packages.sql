-- name: CreatePackage :one
INSERT INTO packages (
    name,
    price,
    description
) VALUES (
    $1, $2, $3
)
RETURNING *;


-- name: GetPackageByID :one
SELECT *
FROM packages
WHERE id = $1
LIMIT 1;


-- name: ListPackages :many
SELECT *
FROM packages
ORDER BY id;