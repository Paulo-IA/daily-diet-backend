import fastify from 'fastify'
import { randomUUID } from 'node:crypto'
import { knex } from './database'

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
    port: 3333,
  })
  .then(() => {
    console.log('HTTP server running')
  })
