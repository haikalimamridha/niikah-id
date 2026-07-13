-- name: CreateInvitationContent :one
INSERT INTO invitation_contents (
    invitation_id,
    title,
    male_name,
    female_name,
    male_nickname,
    female_nickname,
    male_parents,
    female_parents,
    url_photo_male,
    url_photo_female,
    url_photo_main,
    url_bg_music,
    url_youtube
)
VALUES (
    $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13
)
RETURNING *;

-- name: UpdateInvitationContent :one
UPDATE invitation_contents
SET
    title =$2,
    male_name =$3,
    female_name =$4,
    male_nickname =$5,
    female_nickname =$6,
    male_parents =$7,
    female_parents =$8,
    url_photo_male =$9,
    url_photo_female =$10,
    url_photo_main =$11,
    url_bg_music =$12,
    url_youtube =$13,
    updated_at = NOW()
WHERE invitation_id = $1
RETURNING *;

-- name: DeleteinvitationContentByInvitationID :exec
DELETE FROM invitation_contents
WHERE invitation_id = $1;