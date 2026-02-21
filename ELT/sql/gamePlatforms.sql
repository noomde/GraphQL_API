INSERT INTO game_platforms (
    game_id,
    platform_id,
    platform_metascore
)
SELECT
    games.id,
    platforms.id,
    NULLIF(TRIM(platform_metascore_value), '')::int
    
FROM games_raw
JOIN games ON games.metacritic_id = games_raw.id

CROSS JOIN LATERAL unnest(string_to_array(games_raw.platforms, ',')) WITH ORDINALITY AS platform_name(platform_name_value, position)

CROSS JOIN LATERAL unnest(string_to_array(games_raw.platform_metascores, ',')) WITH ORDINALITY AS platform_metascore(platform_metascore_value, position)

JOIN platforms ON platforms.name = TRIM(platform_name_value)

WHERE platform_name.position = platform_metascore.position

ON CONFLICT (game_id, platform_id)
DO UPDATE SET platform_metascore = EXCLUDED.platform_metascore;