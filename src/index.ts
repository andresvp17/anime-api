import { Hono } from 'hono'
import { Middlewares } from './middlewares/cors'
import { AnimeModel as DatabaseAnimeModel } from './models/database/index'
import { Routes } from './router/routes'
import { DatabaseConnection } from './connection'
import { HTTPException } from 'hono/http-exception'
import { type Env } from './types/index'

export class App {
  private readonly hono: Hono<{ Bindings: Env }>
  private readonly middlewares: Middlewares
  private isSetup: boolean = false

  constructor() {
    this.hono = new Hono<{ Bindings: Env }>()
    this.middlewares = new Middlewares({ appInstance: this.hono })
    this.setupMiddlewares()
    this.setupRoutes()
    this.errorHandler()
  }

  private setupMiddlewares() {
    this.middlewares.setupCors()

    this.hono.use('*', async (ctx, next) => {
      if (!this.isSetup) {
        try {
          await DatabaseConnection.initialize(ctx.env.ANIME_DB)
          DatabaseAnimeModel.initialize(ctx.env.ANIME_DB)

          this.isSetup = true
        } catch (error) {
          console.error('Failed to initialize database:', error)
          return ctx.json({ error: 'Database initialization failed' }, 500)
        }
      }
      await next()
    })
  }

  private setupRoutes() {
    Routes.setupRoutes({
      appInstance: this.hono,
      model: DatabaseAnimeModel,
    })
    this.hono.get('/', (c) => {
      return c.json({
        message: 'Anime API with Cloudflare D1',
        version: '1.0.0',
        status: this.isSetup ? 'ready' : 'initializing',
      })
    })

    this.hono.get('/health', (c) => {
      return c.json({
        status: 'ok',
        database: this.isSetup ? 'connected' : 'initializing',
      })
    })
  }

  private errorHandler() {
    this.hono.onError((err, ctx) => {
      if (err instanceof HTTPException) {
        return err.getResponse()
      }

      console.error(err)
      return ctx.json({ message: 'Internal Server Error' }, 500)
    })
  }

  public getHonoInstance() {
    return this.hono
  }
}

const app = new App()
export default app.getHonoInstance()
