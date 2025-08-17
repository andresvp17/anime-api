import { type D1Database } from "@cloudflare/workers-types"

export type Anime = {
  id: string
  title: string
  year: number
  author?: string
  episodes: number
  rate: number
  poster: string
  genre: string[]
}

export interface Env {
  ANIME_DB: D1Database
}

export abstract class AbstractAnimeModel {
  static abstract async getAll({ genre, title }: { genre: string; title: string })
  static abstract async getById({ id }: { id: string })
  static abstract async create({ input }: { input: Omit<Anime, 'id'> })
  static abstract async delete({ id }: { id: string })
  static abstract async update({ id, input }: { id: string; input: Partial<Anime> })
  public static abstract initialize(database: D1Database) {}
}
