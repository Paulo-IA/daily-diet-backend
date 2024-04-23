import { randomUUID } from 'crypto'
import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'
import { checkIfUserIsLoggedIn } from '../middlewares/check-if-user-is-logged-in'
import {
  formatDateAndHour,
  getDateInString,
} from '../utils/format-date-and-hour'

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

      const dateDb = formatDateAndHour(date, hour)
      const createdAt = getDateInString()

      await knex('snacks').insert({
        snackId: randomUUID(),
        userId,
        name,
        description,
        date: dateDb,
        inDiet,
        created_at: createdAt,
      })

      reply.status(201).send()
    },
  )

  app.put(
    '/:id',
    {
      preHandler: [checkIfUserIsLoggedIn],
    },
    async (request, reply) => {
      const createSnacksParamsSchema = z.object({
        id: z.string(),
      })

      const { id } = createSnacksParamsSchema.parse(request.params)

      const createSnacksBodySchema = z.object({
        name: z.string(),
        description: z.string(),
        date: z.string(),
        hour: z.string(),
        inDiet: z.boolean(),
      })

      const { name, description, date, hour, inDiet } =
        createSnacksBodySchema.parse(request.body)

      const dateDb = formatDateAndHour(date, hour)

      const updatedAt = getDateInString()

      await knex('snacks').where('snackId', id).update({
        name,
        description,
        date: dateDb,
        inDiet,
        updated_at: updatedAt,
      })

      reply.status(200).send()
    },
  )
}
