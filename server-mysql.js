import { createApp } from './app.js'
import { AnimeModel } from './models/mysql/animes.js'

createApp({ animeModel: AnimeModel })
