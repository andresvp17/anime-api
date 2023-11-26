import { validateAnimeRequest, validatePartialAnime } from '../schemas/animes.js'

export class AnimeController {
  constructor ({ animeModel }) {
    this.animeModel = animeModel
  }

  getAll = async (req, res) => {
    const { genre } = req.query
    const animes = await this.animeModel.getAll({ genre })
    res.json({ animes })
  }

  getByid = async (req, res) => {
    const { id } = req.params
    const anime = await this.animeModel.getById({ id })

    if (!anime) {
      return res
        .json({ message: 'No anime found' })
        .status(404)
    }

    res.json({ anime })
  }

  create = async (req, res) => {
    const result = validateAnimeRequest(req.body)

    if (result.error) {
      return res
        .json({ error: JSON.parse(result.error.message) })
        .status(400)
        .end()
    }

    await this.animeModel.create({ input: result.data })

    res.status(201).end()
  }

  update = async (req, res) => {
    const result = validatePartialAnime(req.body)

    if (!result.success) {
      return res
        .json({ error: JSON.parse(result.error.message) })
        .status(400)
        .end()
    }

    const { id } = req.params
    const updatedAnime = await this.animeModel.update({ id, input: result.data })

    if (updatedAnime === false) {
      return res
        .json({ message: 'Anime not found' })
        .status(404)
        .end()
    }

    return res.json(updatedAnime)
  }

  delete = async (req, res) => {
    const { id } = req.params
    const deleteMovie = await this.animeModel.delete({ id })

    if (deleteMovie === false) {
      res
        .status(404)
        .json({ message: 'Anime not found' })
        .end()
    }

    return res
      .json({ message: 'Anime Deleted' })
      .status(204)
  }
}
