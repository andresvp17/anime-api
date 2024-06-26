import cors from 'cors'

const ACCEPTED_ORIGINS = [
  'http://localhost:1234',
  'http://localhost:8080',
  'http://localhost:4321',
  'https://main--a-pi-nime.netlify.app'
]

export const corsMiddleware = ({ acceptedOrigins = ACCEPTED_ORIGINS } = {}) => {
  return cors({
    origin: (origin, callback) => {
      if (acceptedOrigins.includes(origin) || !origin) {
        return callback(null, true)
      }

      if (!origin) {
        return callback(null, true)
      }

      return callback(new Error('Not allowed by CORS'))
    }
  })
}
