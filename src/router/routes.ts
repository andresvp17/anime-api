import { Hono } from 'hono'
import { AnimeController } from '../controllers/anime'
import { AbstractAnimeModel, Env } from '@/types/index.d'

export class Routes {
  private static honoInstance: Hono<{ Bindings: Env }>
  private static modelInstance: typeof AbstractAnimeModel
  private static animeController: AnimeController

  private constructor() {}

  static setupRoutes({
    appInstance,
    model,
  }: {
    appInstance: Hono<{ Bindings: Env }>
    model: typeof AbstractAnimeModel
  }) {
    this.honoInstance = appInstance
    this.modelInstance = model

    this.animeController = new AnimeController({
      animeModel: this.modelInstance,
    })

    this.honoInstance.get('/api', this.animeController.getAll)
    this.honoInstance.post('/api', this.animeController.create)
    this.honoInstance.get('/api/:id', this.animeController.getById)
    this.honoInstance.patch('/api/:id', this.animeController.update)
    this.honoInstance.delete('/api/:id', this.animeController.delete)
  }
}
