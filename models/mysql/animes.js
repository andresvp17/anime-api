import mysql from 'mysql2/promise.js'

const config = {
  host: 'localhost',
  user: 'root',
  port: 3306,
  password: '123456',
  database: 'animesdb'
}

const connection = await mysql.createConnection(config)

export class AnimeModel {
  static async getAll ({ genre }) {
    if (genre) {
      const lowerCase = genre.toLowerCase()

      const [genres] = await connection.query(
        'SELECT id, name FROM genre WHERE LOWER(name) = ?;', [lowerCase]
      )

      if (genres.length === 0) return []

      const [{ id }] = genres

      const [result] = await connection.query(
        `
        SELECT animes.title, animes.author, (BIN_TO_UUID(animes.id)) id
        FROM anime_genre
        JOIN animes ON anime_id = animes.id
        JOIN genre ON genre_id = ?
        WHERE genre.name = 'action';
        `, [id]
      )

      return result
    }

    const [animes] = await connection.query(
      'SELECT title, BIN_TO_UUID(id) id , author, episodes, poster, rate FROM animes;'
    )

    return animes
  }

  static async getById ({ id }) {
    const [animes] = await connection.query(
      `SELECT title, author, episodes, poster, rate, BIN_TO_UUID(id) id 
      FROM animes WHERE id = UUID_TO_BIN(?);`,
      [id]
    )

    if (animes.length === 0) return null

    return animes[0]
  }

  static async create ({ input }) {
    const { title, author, episodes, poster, rate, year } = input

    const [uuidResult] = await connection.query('SELECT UUID() uuid;')
    const [{ uuid }] = uuidResult

    try {
      await connection.query(`
        INSERT INTO animes (id, title, author, episodes, poster, year, rate)  
        VALUES (UUID_TO_BIN(?), ?, ?, ?, ?, ?, ?);`,
      [uuid, title, author, episodes, poster, year, rate])
    } catch (error) {
      throw new Error('Error creating anime')
    }

    const [anime] = await connection.query(
      `SELECT id, title, author, episodes, poster, rate, year
      FROM animes WHERE id = UUID_TO_BIN(?);`, [uuid]
    )

    return anime[0]
  }

  static async delete ({ id }) {
    const [deleted] = await connection.query(
      'DELETE FROM animes WHERE id = UUID_TO_BIN(?);', [id]
    )

    return deleted[0]
  }

  static async update ({ id, input }) {
    const [updatedRow] = await connection.query(
      'UPDATE animes SET ? WHERE id = UUID_TO_BIN(?);', [input, id]
    )

    return updatedRow[0]
  }
}
