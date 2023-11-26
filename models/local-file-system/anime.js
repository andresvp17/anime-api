import { readJSON } from '../../utils.js'
import { randomUUID } from 'node:crypto'

const animes = readJSON('./animes.json')

export class AnimeModel {
  static async getAll ({ genre }) {
    if (genre) {
      return animes.filter(
        anime => anime.genre.some((a) => a.toLocaleLowerCase() === genre.toLocaleLowerCase())
      )
    }

    return animes
  }

  static async getById ({ id }) {
    const anime = animes.find((anime) => anime.id === id)
    return anime
  }

  static async create ({ input }) {
    const newAnime = {
      id: randomUUID(),
      ...input
    }

    animes.push(newAnime)
    return newAnime
  }

  static async delete ({ id }) {
    const animeIndex = animes.findIndex((anime) => anime.id === id)

    if (animeIndex === -1) {
      return false
    }

    animes.splice(animeIndex, 1)
    return true
  }

  static async update ({ id, input }) {
    const animeIndex = animes.findIndex((anime) => anime.id === id)

    if (animeIndex === -1) {
      return false
    }

    const udpatedAnime = {
      ...animes[animeIndex],
      ...input
    }

    animes[animeIndex] = udpatedAnime

    return udpatedAnime
  }
}
