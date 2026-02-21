COPY games_raw(
    id,
    title,
    release_date,
    rating,
    genres,
    description,
    platforms,
    metascore,
    metascore_count,
    metascore_sentiment,
    userscore,
    userscore_count,
    userscore_sentiment,
    platform_metascores,
    developer,
    publisher
)
FROM STDIN WITH (FORMAT csv, HEADER true);

