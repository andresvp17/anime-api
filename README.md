# ANIME-API

RESTful API that implements the MVC (Model View Controller) pattern built with [Hono](https://hono.dev/) framework and deployed using Cloudflare Workers.

## 🪄 FEATURES

- **RESTful API**: Simple and intuitive endpoints to be used to retrieve data safely.
- **Database Persistance**: Using D1 database provided by Cloudflare.
- **TypeScript Implementation**: Completely typed codebase for better developer experience.
- **Input Validation**: Implemented using zod for request data validation.
- **MVC Implementation**: Model View Controller architecture used to achieve a loose coupling between the components of the app.

## 🛠️ TECH STACK

- **Framework**: [Hono](https://hono.dev/) - Lightweight web framework
- **Runtime**: [Cloudflare Workers](https://workers.cloudflare.com/) - Edge computing platform
- **Database**: [Cloudflare D1](https://developers.cloudflare.com/d1/) - Serverless SQL database
- **Language**: TypeScript
- **Validation**: [Zod](https://zod.dev/) - TypeScript-first schema validation
- **Testing**: [Vitest](https://vitest.dev/) with Cloudflare Workers testing pool
- **Build Tool**: [Wrangler](https://developers.cloudflare.com/workers/wrangler/) - Cloudflare Workers CLI

## 📋 PREREQUISITES

- Node.js 18+
- npm or yarn
- Cloudflare account
- Wrangler CLI installed globally

## 🚀 Usage

### Development

Start the development server:

```bash
npm run dev
```

The API will be available at `http://localhost:8787`

### Deployment

Deploy to Cloudflare Workers:

```bash
npm run deploy
```

### Testing

Run tests:

```bash
npm run test
```

## 📚 API ENDPOINTS

### Get All Animes

```http
GET /api
```

**Response**:

```json
{
  "animes": [
    {
      "id": "14d01567-715f-420d-b7e4-efc884cad463",
      "title": "Death Note",
      "year": 2006,
      "author": "Tsugumi Ohba",
      "episodes": 37,
      "rate": 8,
      "genre": ["Mystery", "Psychological", "Thriller"]
    }
  ]
}
```

### Create Anime

```http
POST /api
Content-Type: application/json

{
  title: 'Berserk',
  episodes: 25,
  rate: 9,
  genre: ['Horror', 'Adventure', 'Action'],
  year: 1997,
  poster:
    'https://m.media-amazon.com/images/M/MV5BZmE1YTFlZWMtYzRkYi00MWU0LWIwODctZmYzMDExZGRkM2NmXkEyXkFqcGc@._V1_.jpg',
  author: 'Kentarou Miura',
}
```

**Response**:

```json
{
  "id": "0fa6a1fc-ab35-4bf7-ae88-499f7db58f01",
  "title": "Berserk",
  "episodes": 25,
  "rate": 9,
  "genre": ["Horror", "Adventure", "Action"],
  "year": 1997,
  "poster": "https://example.com/posters/berserk.jpg",
  "author": "Kentarou Miura"
}
```

### Get a Single Anime

```http
GET /api/{id}
```

**Response**:

```json
{
  "id": "728b2a9a-796c-49af-9cbc-22f85100c2b2",
  "title": "Cowboy Bebop",
  "year": 1998,
  "author": "Shinichirō Watanabe",
  "episodes": 26,
  "rate": 9,
  "poster": "https://example.com/posters/cowboy_bebop.jpg",
  "genre": ["Action", "Adventure", "Sci-Fi"]
}
```

### Update an Anime

```http
PATCH /api/{id}
Content-Type: application/json

{
  title: 'Kimetsu no Yaiba',
}
```

```json
{
  "id": "4549bca5-4562-49bb-b0e6-8464b7edff95",
  "title": "Kimetsu No Yaiba",
  "year": 2019,
  "episodes": 44,
  "rate": 9,
  "poster": "https://example.com/posters/demon_slayer.jpg",
  "genre": ["Action", "Fantasy"]
}
```

### Delete an Anime

```http
DELETE /api/{id}
```

**Response**:

```json
{
  "message": "Anime deleted"
}
```

## 🔧 Configuration Files

- `tsconfig.json` - TypeScript configuration
- `package.json` - Project dependencies and scripts
- `vitest.config.ts` - Test configuration

## 🚦 Error Handling

The application includes comprehensive error handling:

- **400 Bad Request**: Invalid input data or duplicate entries
- **404 Not Found**: URL alias not found
- **500 Internal Server Error**: Database or server errors

## 📝 Scripts

- `npm run dev` - Start development server with Wrangler
- `npm run deploy` - Deploy to Cloudflare Workers (minified)
- `npm run test` - Run Vitest tests with file watching
- `npm run cf-typegen` - Generate TypeScript types from Cloudflare bindings

## 🙏 Acknowledgments

- [Hono](https://hono.dev/) - For the excellent web framework
- [Cloudflare](https://cloudflare.com/) - For the Workers platform and D1 database
- [Zod](https://zod.dev/) - For runtime type validation

**Built with ❤️ using Hono and Cloudflare Workers**
