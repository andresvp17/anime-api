import { type Anime, AbstractAnimeModel } from '@/types/index.d'
import animes from '../../../animes.json'

const localDatabase = animes

export class AnimeModel extends AbstractAnimeModel {
  private static db = localDatabase 

  static async getAll({ genre, title }: { genre?: string; title?: string }) {
    if (title) {
      return this.db.filter(
        (anime) => anime.title.toLocaleLowerCase() === title.toLocaleLowerCase()
      )
    }

    if (genre) {
      return this.db.filter((anime) =>
        anime.genre.some(
          (a) => a.toLocaleLowerCase() === genre.toLocaleLowerCase()
        )
      )
    }

    return this.db
  }

  static async getById({ id }: { id: string }) {
    return this.db.find((anime) => anime.id === id)
  }

  static async create({ input }: { input: Omit<Anime, 'id'> }) {
    const newAnimeToInclude: Anime = {
      id: crypto.randomUUID(),
      ...input,
    }

    this.db.push(newAnimeToInclude)
    return newAnimeToInclude
  }

  static async delete({ id }: { id: string }) {
    const animeIndex = this.db.findIndex((anime) => anime.id === id)

    if (animeIndex === -1) {
      return null
    }

    this.db.splice(animeIndex, 1)
    return true
  }

  static async update({ id, input }: { id: string; input: Partial<Anime> }) {
    const animeIndex = this.db.findIndex((anime) => anime.id === id)

    if (animeIndex === -1) {
      return null
    }

    const updatedAnime = {
      ...this.db[animeIndex],
      ...input,
    }

    this.db[animeIndex] = updatedAnime
    return updatedAnime
  }
}
