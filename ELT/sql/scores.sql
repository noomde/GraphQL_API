INSERT INTO scores (
    game_id,
    metascore,
    metascore_count,
    metascore_sentiment,
    userscore,
    userscore_count,
    userscore_sentiment
)

SELECT
    games.id,
    
    games_raw.metascore,
    games_raw.metascore_count,
    NULLIF(TRIM(games_raw.metascore_sentiment), ''),
    games_raw.userscore,
    games_raw.userscore_count,
    NULLIF(TRIM(games_raw.userscore_sentiment), '')

FROM games_raw
JOIN games ON games.metacritic_id = games_raw.id

ON CONFLICT (game_id) DO UPDATE SET
    metascore           = EXCLUDED.metascore,
    metascore_count     = EXCLUDED.metascore_count,
    metascore_sentiment = EXCLUDED.metascore_sentiment,
    userscore           = EXCLUDED.userscore,
    userscore_count     = EXCLUDED.userscore_count,
    userscore_sentiment = EXCLUDED.userscore_sentiment;