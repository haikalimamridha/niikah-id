-- +goose Up

INSERT INTO packages (
    name,
    price,
    description,
    duration,
    max_event,
    max_guest,
    max_comment,
    max_gallery,
    youtube_link,
    broadcast_template,
    music_background,
    quote
)
VALUES
(
    'Basic',
    49000,
    'Paket dasar untuk 1 acara dengan fitur standar',
    30,
    1,
    200,
    50,
    10,
    FALSE,
    FALSE,
    FALSE,
    FALSE
),
(
    'Premium',
    99000,
    'Paket menengah dengan fitur multimedia dan kapasitas lebih besar',
    90,
    3,
    500,
    200,
    30,
    TRUE,
    FALSE,
    TRUE,
    TRUE
),
(
    'Exclusive',
    199000,
    'Paket lengkap dengan semua fitur premium tanpa batasan kecil',
    365,
    10,
    2000,
    1000,
    100,
    TRUE,
    TRUE,
    TRUE,
    TRUE
);

-- +goose Down

DELETE FROM packages
WHERE name IN ('Basic', 'Premium', 'Exclusive');