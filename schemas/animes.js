import * as z from 'zod'

export const animeSchema = z.object({
  title: z.string({ invalid_type_error: 'Anime title needs to be declared' }),
  year: z.number().int().min(1940).max(2023),
  author: z.string(),
  episodes: z.number().int().min(1),
  rate: z.number().min(0).max(5),
  poster: z.string().url({ message: 'Poster needs to be valid' }),
  genre: z.array(z.enum(['mystery', 'action']))
})

export function validateAnimeRequest (anime) {
  return animeSchema.safeParse(anime)
}

export function validatePartialAnime (anime) {
  return animeSchema.partial().safeParse(anime)
}
