import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'

export async function authRoute(app: FastifyInstance) {
  app.post('/', async (request, reply) => {
    const createAuthBodySchema = z.object({
      email: z.string(),
      password: z.string(),
    })

    const { email, password } = createAuthBodySchema.parse(request.body)

    const user = await knex('users')
      .where({
        email,
        password,
      })
      .select()
      .first()

    if (user) {
      return reply.status(200).send()
    }

    return reply.status(404).send({ message: 'User not found!' })
  })
}
