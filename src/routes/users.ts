import { randomUUID } from 'crypto'
import { knex } from '../database'
import { FastifyInstance } from 'fastify'
import { z } from 'zod'

export async function usersRoutes(app: FastifyInstance) {
  app.post('/', async (request, reply) => {
    const createUserBodySchema = z.object({
      name: z.string(),
    })

    const { name } = createUserBodySchema.parse(request.body)

    await knex('users').insert({
      userId: randomUUID(),
      name,
    })

    reply.status(201).send()
  })

  app.get('/', async () => {
    const users = await knex('users').select()
    return { users }
  })
}
