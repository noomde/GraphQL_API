INSERT INTO platforms (name)

SELECT DISTINCT
    TRIM(platform_name_value) AS name

FROM games_raw

CROSS JOIN LATERAL unnest(string_to_array(games_raw.platforms, ',')) AS platform_name(platform_name_value)

WHERE TRIM(platform_name_value) <> ''

ON CONFLICT (name) DO NOTHING;