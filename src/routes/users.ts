import { randomUUID } from 'crypto'
import { knex } from '../database'
import { FastifyInstance } from 'fastify'
import { z } from 'zod'

export async function usersRoutes(app: FastifyInstance) {
  app.get('/', async () => {
    const users = await knex('users').select('*')

    return { users }
  })

  app.post('/', async (request, reply) => {
    const createUserBodySchema = z.object({
      name: z.string(),
      email: z.string(),
      password: z.string(),
    })

    const { name, email, password } = createUserBodySchema.parse(request.body)

    const user = await knex('users')
      .where({
        email,
      })
      .select()
      .first()

    if (!user) {
      await knex('users').insert({
        userId: randomUUID(),
        name,
        email,
        password,
      })

      return reply.status(201).send()
    }

    return reply.status(404).send({ message: 'User already signed up' })
  })
}
