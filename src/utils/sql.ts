const animeTable = `CREATE TABLE IF NOT EXISTS animes (id TEXT PRIMARY KEY, title TEXT NOT NULL, author TEXT, episodes INTEGER NOT NULL, poster TEXT, year INTEGER NOT NULL, rate REAL NOT NULL, created_at DATETIME DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP)`
const genreTable = `CREATE TABLE IF NOT EXISTS genre (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL UNIQUE)`
const joinedGenreAnime = `CREATE TABLE IF NOT EXISTS anime_genres (id INTEGER PRIMARY KEY AUTOINCREMENT, anime_id TEXT NOT NULL, genre TEXT NOT NULL, FOREIGN KEY (anime_id) REFERENCES animes(id) ON DELETE CASCADE)`

export const tablesCreationQueries = [animeTable, genreTable, joinedGenreAnime]