import fastify from 'fastify'
import cookie from '@fastify/cookie'

import { usersRoutes } from './routes/users'
import { snacksRoutes } from './routes/snacks'
import { authRoute } from './routes/auth'

export const app = fastify()

app.register(cookie)

app.register(authRoute, {
  prefix: 'auth',
})

app.register(usersRoutes, {
  prefix: 'users',
})

app.register(snacksRoutes, {
  prefix: 'snacks',
})
