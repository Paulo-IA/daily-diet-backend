import fastify from 'fastify'
import { randomUUID } from 'node:crypto'
import { knex } from './database'
import { env } from './env'

const app = fastify()

app.post('/users', async () => {
  const snack = await knex('users').insert({
    userId: randomUUID(),
    name: 'Lívia',
  })
  return snack
})

app.get('/users', async () => {
  const snack = await knex('users').select()
  return snack
})

app
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log('HTTP server running')
  })
