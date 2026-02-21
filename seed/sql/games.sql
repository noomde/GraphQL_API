INSERT INTO games (
    metacritic_id,
    title,
    release_date,
    rating,
    genres,
    description,
    developer,
    publisher
)

SELECT
    games_raw.id::bigint,
    TRIM(games_raw.title),
    NULLIF(TRIM(games_raw.release_date), ''),
    NULLIF(TRIM(games_raw.rating), ''),
    NULLIF(TRIM(games_raw.genres), ''),
    NULLIF(TRIM(games_raw.description), ''),
    NULLIF(TRIM(games_raw.developer), ''),
    NULLIF(TRIM(games_raw.publisher), '')
FROM games_raw
WHERE games_raw.id IS NOT NULL

ON CONFLICT (metacritic_id) DO UPDATE SET
    title = EXCLUDED.title,
    release_date = EXCLUDED.release_date,
    rating = EXCLUDED.rating,
    genres = EXCLUDED.genres,
    description = EXCLUDED.description,
    developer = EXCLUDED.developer,
    publisher = EXCLUDED.publisher;