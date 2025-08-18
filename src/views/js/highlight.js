const code = document.querySelector('#code-display')
const form = document.querySelector('#form')
const loadingText = document.querySelector('[data-loading]')
const baseUrl = 'https://apinime.andresvp257.workers.dev/api'

async function fetchCode({ query = '?title=naruto%20shippuden' } = {}) {
  try {
    loadingText.style.display = 'inline'
    code.style.display = 'none'
    const response = await fetch(`${baseUrl}${query}`)

    if (!response.ok) {
      throw new Error('Network response was not ok')
    }

    const { animes } = await response.json()
    if (animes.length > 0) {
      code.textContent = JSON.stringify(animes, null, 2)
      hljs.highlightElement(code)
    }
  } catch (error) {
    code.textContent = 'Error fetching code or no results found.'
    throw error
  } finally {
    loadingText.style.display = 'none'
    code.style.display = 'block'
  }
}

const handleSubmit = async (evt) => {
  evt.preventDefault()
  const formData = new FormData(form)
  let query = formData.get('search-input').trim()

  if (query.includes(' ')) {
    query = query.replaceAll(' ', '%20')
  }

  if (query) {
    await fetchCode({ query: `?${query}` })
  }
}

await fetchCode()
form.addEventListener('submit', handleSubmit)
