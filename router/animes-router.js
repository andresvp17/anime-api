import { Router } from 'express'
import { AnimeController } from '../controllers/animes.js'

export const createAnimeRouter = ({ animeModel }) => {
  const animesRouter = Router()
  const animeController = new AnimeController({ animeModel })

  animesRouter.get('/', animeController.getAll)
  animesRouter.post('/', animeController.create)

  animesRouter.get('/:id', animeController.getByid)
  animesRouter.patch('/:id', animeController.update)
  animesRouter.delete('/:id', animeController.delete)

  return animesRouter
}
