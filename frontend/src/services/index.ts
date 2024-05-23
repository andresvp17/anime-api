const BASE_URL = 'https://anime-api-production-d0f2.up.railway.app/animes'

export const getInput = async (input: string) => {
    return fetch(`${BASE_URL  }${input}`)
      .then((res) => {
        if (!res.ok) {
            throw { error: true, message: 'Something went wrong!' }
        }

        return res.json()
      })
      .then(({ animes }) => animes)
}