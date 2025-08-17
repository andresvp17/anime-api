import { App } from '@/index'
import { Anime, Env } from '@/types/index.d'
import { Hono } from 'hono'
import { it, describe, expect, beforeAll, beforeEach } from 'vitest'
import { env, createExecutionContext, ProvidedEnv } from 'cloudflare:test'
import { tablesCreationQueries } from '@/utils/sql'
import animes from '../../animes.json'

interface TestEnv extends ProvidedEnv {
  ANIME_DB: D1Database
}

const testEnv = env as TestEnv
const anime = animes[0] as Anime
const baseUrl = 'http://127.0.0.1:8787/api'
const ctx = createExecutionContext()

let app: Hono<{ Bindings: Env }> = new App().getHonoInstance()

const testAnimeToCreate = {
  title: 'Berserk',
  episodes: 25,
  rate: 9,
  genre: ['Horror', 'Adventure', 'Action'],
  year: 1997,
  poster:
    'https://m.media-amazon.com/images/M/MV5BZmE1YTFlZWMtYzRkYi00MWU0LWIwODctZmYzMDExZGRkM2NmXkEyXkFqcGc@._V1_.jpg',
  author: 'Kentarou Miura',
} satisfies Omit<Anime, 'id'>

const changeTitle = {
  title: 'Cowboy beeboop',
}

const setupDatabase = async () => {
  for (const query of tablesCreationQueries) {
    await testEnv.ANIME_DB.prepare(query).run()
  }
}

const seedData = async () => {
  await testEnv.ANIME_DB.batch([
    testEnv.ANIME_DB.prepare(
      `
        INSERT INTO animes (id, title, year, author, episodes, rate, poster, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
        `
    ).bind(
      anime.id,
      anime.title,
      anime.year,
      anime.author || null,
      anime.episodes,
      anime.rate,
      anime.poster
    ),
    ...anime.genre.map((genre) =>
      testEnv.ANIME_DB.prepare(
        'INSERT INTO anime_genres (anime_id, genre) VALUES (?, ?)'
      ).bind(anime.id, genre)
    ),
  ])
}

const getFirstAnimeId = async () => {
  const response = await app.fetch(new Request(baseUrl), testEnv, ctx)
  const { animes } = (await response.json()) as { animes: Anime[] }
  return animes[0].id
}

beforeAll(async () => {
  await setupDatabase()
})

beforeEach(async () => {
  await seedData()
})

describe('test API endpoints', () => {
  it('should return status 200', async () => {
    const response = await app.fetch(new Request(baseUrl), env, ctx)
    expect(response.status).toBe(200)
  })

  it('should post an anime', async () => {
    const request = new Request(baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testAnimeToCreate),
    })

    const response = await app.fetch(request, env, ctx)
    const { anime }: { anime: Anime } = await response.json()

    expect(response.status).toBe(201)
    expect(anime).toMatchObject({
      title: testAnimeToCreate.title,
      episodes: testAnimeToCreate.episodes,
      rate: testAnimeToCreate.rate,
      year: testAnimeToCreate.year,
      poster: testAnimeToCreate.poster,
      author: testAnimeToCreate.author,
    })
    expect(anime.genre).toEqual(testAnimeToCreate.genre)
  })

  it('should update an anime', async () => {
    const animeId = await getFirstAnimeId()
    const patchRequest = new Request(`${baseUrl}/${animeId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(changeTitle),
    })
    const patchResponse = await app.fetch(patchRequest, env, ctx)
    expect(patchResponse.status).toBe(200)

    const getResponse = await app.fetch(
      new Request(`${baseUrl}/${animeId}`),
      env,
      ctx
    )
    const { anime }: { anime: Anime } = await getResponse.json()
    expect(anime.title).toBe(changeTitle.title)
  })

  it('should delete an anime', async () => {
    const animeId = await getFirstAnimeId()
    const deleteRequest = new Request(`${baseUrl}/${animeId}`, {
      method: 'DELETE',
    })

    const deleteResponse = await app.fetch(deleteRequest, env, ctx)
    const text = await deleteResponse.json()
    expect(text).toStrictEqual({ message: 'Anime deleted' })
  })
})
