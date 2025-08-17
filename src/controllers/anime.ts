import { HTTPException } from 'hono/http-exception'
import { AbstractAnimeModel, Anime } from '@/types/index.d'
import { type Context } from 'hono'
import { validateAnimeRequest, validatePartialAnime } from '../schemas/anime'

export class AnimeController {
  animeModel: typeof AbstractAnimeModel

  constructor({ animeModel }: { animeModel: typeof AbstractAnimeModel }) {
    this.animeModel = animeModel
  }

  getAll = async (ctx: Context) => {
    const { genre, title } = ctx.req.query()
    const animes = await this.animeModel.getAll({ genre, title })

    return ctx.json({ animes })
  }

  getById = async (ctx: Context) => {
    const { id } = ctx.req.param()
    try {
      const anime = await this.animeModel.getById({ id })
      
      if (!anime) {
        throw new HTTPException(400, {
          message: 'No anime found',
        })
      }

      return ctx.json({ anime })
    } catch (error) {
      if (error instanceof HTTPException) {
        throw error
      }
    }

    throw new HTTPException(500, {
      message: 'Internal server error',
    })
  }

  create = async (ctx: Context) => {
    const body = await ctx.req.json()
    const result = validateAnimeRequest(body)

    if (result.error) {
      throw new HTTPException(400, {
        message: result.error.message,
      })
    }

    const newAnimeToInclude = {
      ...result.data,
    } satisfies Omit<Anime, 'id'>

    const createdAnime = await this.animeModel.create({ input: newAnimeToInclude })
    return ctx.json({ anime: createdAnime }, 201)
  }

  update = async (ctx: Context) => {
    try {
      const body = await ctx.req.json()
      const result = validatePartialAnime(body)          

      if (result.error) {
        throw new HTTPException(400, {
          message: result.error.message,
        })
      }

      const { id } = ctx.req.param()
      const updatedAnime = await this.animeModel.update({
        id,
        input: result.data,
      })

      if (!updatedAnime) {
        throw new HTTPException(404, {
          message: 'Anime not found',
        })
      }

      return ctx.json({ anime: updatedAnime }, 200)
    } catch (error) {
      if (error instanceof HTTPException) {
        throw error
      }
      console.error(error)
      throw new HTTPException(500, { message: 'Internal server error' })
    }
  }

  delete = async (ctx: Context) => {
    const id = ctx.req.param('id')
    
    try {
      const animeToDelete = await this.animeModel.delete({ id })

      if (animeToDelete === null) {
        throw new HTTPException(404, {
          message: 'Anime not found',
        })
      }

      return ctx.json({ message: 'Anime deleted' })
    } catch (error) {
      if (error instanceof HTTPException) {
        throw error
      }

      throw new HTTPException(500, { message: 'Internal server error' })
    }
  }
}
