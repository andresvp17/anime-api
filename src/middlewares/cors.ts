import { Env } from '@/types/index.d'
import { Hono } from 'hono'
import { cors } from 'hono/cors'

export class Middlewares {
  private honoInstance: Hono<{ Bindings: Env }>

  constructor({ appInstance }: { appInstance: Hono<{ Bindings: Env }> }) {
    this.honoInstance = appInstance
  }

  setupCors() {
    this.honoInstance.use('*', cors())
  }
}
