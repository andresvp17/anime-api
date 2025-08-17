import { AbstractAnimeModel, Anime } from '@/types/index.d'
import { D1PreparedStatement, type D1Database } from '@cloudflare/workers-types'

export class AnimeModel extends AbstractAnimeModel {
  private static db: D1Database

  public static initialize(dabatabase: D1Database) {
    this.db = dabatabase
  }

  static async getAll({ genre, title }: { genre?: string; title?: string }) {
    let query = 'SELECT * FROM animes'
    const params: string[] = []
    const conditions: string[] = []

    if (title) {
      conditions.push('LOWER(title) = LOWER(?)')
      params.push(title)
    }

    if (genre) {
      conditions.push(
        'id IN (SELECT anime_id FROM anime_genres WHERE LOWER(genre) = LOWER(?))'
      )
      params.push(genre)
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ')
    }
    try {
      const { results } = await this.db
        .prepare(query)
        .bind(...params)
        .all()

      const animeWithGenre = await Promise.all(
        results.map(async (anime: any) => {
          const genresResult = await this.db
            .prepare('SELECT genre FROM anime_genres WHERE anime_id = ?')
            .bind(anime.id)
            .all()

          return {
            ...anime,
            genre: genresResult.results.map((g: any) => g.genre),
          }
        })
      )

      return animeWithGenre as Anime[]
    } catch (error) {
      throw error
    }
  }

  static async getById({ id }: { id: string }) {
    const { results } = await this.db
      .prepare('SELECT * FROM animes WHERE id = ?')
      .bind(id)
      .all()

    if (results.length === 0) {
      return null
    }

    const anime = results[0] as any

    const genresResult = await this.db
      .prepare('SELECT genre FROM anime_genres WHERE anime_id = ?')
      .bind(id)
      .all()

    return {
      ...anime,
      genre: genresResult.results.map((g: any) => g.genre),
    } as Anime
  }

  static async create({ input }: { input: Omit<Anime, 'id'> }) {
    const newAnimeToInclude: Anime = {
      id: crypto.randomUUID(),
      ...input,
    }

    try {
    await this.db.batch([
      this.db
        .prepare(
        `
        INSERT INTO animes (id, title, year, author, episodes, rate, poster, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
        `
        )
        .bind(
          newAnimeToInclude.id,
          newAnimeToInclude.title,
          newAnimeToInclude.year,
          newAnimeToInclude.author || null,
          newAnimeToInclude.episodes,
          newAnimeToInclude.rate,
          newAnimeToInclude.poster
        ),
      ...newAnimeToInclude.genre.map((genre) =>
        this.db
          .prepare('INSERT INTO anime_genres (anime_id, genre) VALUES (?, ?)')
          .bind(newAnimeToInclude.id, genre)
      ),
    ])
    } catch (error) {
      console.log(error);
    }

    return newAnimeToInclude
  }

  static async delete({ id }: { id: string }) {
    const result = await this.db
      .prepare('DELETE FROM animes WHERE id = ?')
      .bind(id)
      .run()

    if (result.meta.changes === 0) {
      return null
    }

    return true
  }

  static async update({ id, input }: { id: string; input: Partial<Anime> }) {
    const existingAnime = await this.getById({ id })

    if (!existingAnime) {
      return null
    }

    const updates: string[] = []
    const params: any[] = []

    if (input.title !== undefined) {
      updates.push('title = ?')
      params.push(input.title)
    }
    if (input.year !== undefined) {
      updates.push('year = ?')
      params.push(input.year)
    }
    if (input.author !== undefined) {
      updates.push('author = ?')
      params.push(input.author)
    }
    if (input.episodes !== undefined) {
      updates.push('episodes = ?')
      params.push(input.episodes)
    }
    if (input.rate !== undefined) {
      updates.push('rate = ?')
      params.push(input.rate)
    }
    if (input.poster !== undefined) {
      updates.push('poster = ?')
      params.push(input.poster)
    }

    updates.push("updated_at = datetime('now')")
    params.push(id)

    const updateQuery = `UPDATE animes SET ${updates.join(', ')} WHERE id = ?`
    const operations: D1PreparedStatement[] = [
      this.db.prepare(updateQuery).bind(...params),
    ]

    if (input.genre !== undefined) {
      operations.push(
        this.db.prepare('DELETE FROM anime_genres WHERE anime_id = ?').bind(id)
      )

      input.genre.forEach((genre) => {
        operations.push(
          this.db
            .prepare('INSERT INTO anime_genres (anime_id, genre) VALUES (?, ?)')
            .bind(id, genre)
        )
      })
    }
    await this.db.batch(operations)
    return await this.getById({ id })
  }
}
