import { Anime } from '@/types/index.d'
import { z } from 'zod'

export const animeSchema = z.object({
  title: z.string({ message: 'Anime title needs to be declared' }),
  year: z.number().int().min(1940).max(2025),
  author: z.string(),
  episodes: z.number().int().min(1),
  rate: z.number().min(0).max(10),
  poster: z.string().url({ message: 'Poster needs to be valid' }),
  genre: z.array(
    z.enum([
      'Mystery',
      'Action',
      'Adventure',
      'Drama',
      'Fantasy',
      'Horror',
      'Psychological',
      'Thriller',
      'Comedy',
      'Superhero',
      'Mecha',
      'Sci-Fi',
      'Martial Arts',
    ])
  ),
})

export function validateAnimeRequest(anime: Anime) {
  return animeSchema.safeParse(anime)
}

export function validatePartialAnime(anime: Anime) {
  return animeSchema.partial().safeParse(anime)
}
