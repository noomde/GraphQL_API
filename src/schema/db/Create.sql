CREATE TABLE games (
  id BIGSERIAL PRIMARY KEY,
  metacritic_id BIGINT UNIQUE,
  title TEXT NOT NULL,
  release_date DATE,
  rating TEXT,
  genre TEXT,
  description TEXT,
  developer TEXT,
  publisher TEXT
);

CREATE TABLE scores (
  game_id BIGINT PRIMARY KEY REFERENCES games(id),
  metascore INTEGER,
  metascore_count INTEGER,
  metascore_sentiment TEXT,
  userscore NUMERIC(4,2),
  userscore_count INTEGER,
  userscore_sentiment TEXT
);

CREATE TABLE platforms (
  id BIGSERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL
);

CREATE TABLE game_platforms (
  game_id BIGINT REFERENCES games(id),
  platform_id BIGINT REFERENCES platforms(id),
  platform_metascore INTEGER,
  PRIMARY KEY (game_id, platform_id)
);

CREATE TABLE games_raw (
  id BIGINT,
  title TEXT,
  releaseDate TEXT,
  rating TEXT,
  genres TEXT,
  description TEXT,
  platforms TEXT,
  metascore NUMERIC,
  metascore_count INTEGER,
  metascore_sentiment TEXT,
  userscore NUMERIC,
  userscore_count INTEGER,
  userscore_sentiment TEXT,
  platform_metascores TEXT,
  developer TEXT,
  publisher TEXT
);
