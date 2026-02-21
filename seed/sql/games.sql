INSERT INTO games (
    metacritic_id,
    title,
    releasedate,
    rating, genre,
    description,
    developer,
    publisher
)
SELECT
    id::bigint,
    TRIM(title),
    NULLIF(TRIM(releasedate), '')::date,
    NULLIF(TRIM(rating), ''),
    NULLIF(TRIM(genre), ''),
    NULLIF(TRIM(description), ''),
    NULLIF(TRIM(developer), ''),
    NULLIF(TRIM(publisher), '')
FROM games_raw
WHERE id IS NOT NULL

ON CONFLICT (metacritic_id) DO UPDATE SET
    title = EXCLUDED.title,
    releasedate = EXCLUDED.releasedate,
    rating = EXCLUDED.rating,
    genre = EXCLUDED.genre,
    description = EXCLUDED.description,
    developer = EXCLUDED.developer,
    publisher = EXCLUDED.publisher