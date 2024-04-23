import { randomUUID } from 'crypto'
import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'
import { checkIfUserIsLoggedIn } from '../middlewares/check-if-user-is-logged-in'

export async function snacksRoutes(app: FastifyInstance) {
  app.get(
    '/',
    {
      preHandler: [checkIfUserIsLoggedIn],
    },
    async (request) => {
      const { userLoggedIn } = request.cookies

      const snacks = await knex('snacks')
        .where('userId', userLoggedIn)
        .select('*')

      return { snacks }
    },
  )

  app.post(
    '/',
    {
      preHandler: [checkIfUserIsLoggedIn],
    },
    async (request, reply) => {
      const userId = request.cookies.userLoggedIn

      const createSnacksBodySchema = z.object({
        name: z.string(),
        description: z.string(),
        date: z.string(),
        hour: z.string(),
        inDiet: z.boolean(),
      })

      const { name, description, date, hour, inDiet } =
        createSnacksBodySchema.parse(request.body)

      const dateDb = `${date}${hour}` // alterar, entender melhor a função date (Date -> String)

      await knex('snacks').insert({
        snackId: randomUUID(),
        userId,
        name,
        description,
        date: dateDb,
        inDiet,
      })

      reply.status(201).send()
    },
  )
}
