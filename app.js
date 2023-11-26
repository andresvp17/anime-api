import express from 'express'
import { createAnimeRouter } from './router/animes-router.js'
import { corsMiddleware } from './middlewares/cors.js'

export const createApp = ({ animeModel }) => {
  const app = express()
  app.use(express.json())

  app.use(corsMiddleware())
  app.disable('x-powered-by')

  app.use('/animes', createAnimeRouter({ animeModel }))

  const PORT = process.env.PORT ?? 1234

  app.listen(PORT, () => {
    console.log('Server Initialized')
  })
}
