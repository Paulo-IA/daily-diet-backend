import { randomUUID } from 'crypto'
import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'
import { checkIfUserIsLoggedIn } from '../middlewares/check-if-user-is-logged-in'
import { formatDateAndHour, getDateInString } from '../utils/time-functions'

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

  app.get(
    '/:id',
    {
      preHandler: [checkIfUserIsLoggedIn],
    },
    async (request) => {
      const createGetSingleSnackSchema = z.object({
        id: z.string().uuid(),
      })

      const snackId = createGetSingleSnackSchema.parse(request.params).id

      const snack = await knex('snacks').where('snackId', snackId).select('*')

      return { snack }
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
        createdAt,
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
      const createUpdateSnacksParamsSchema = z.object({
        id: z.string().uuid(),
      })

      const { id } = createUpdateSnacksParamsSchema.parse(request.params)

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

      const updateSnackResponse = await knex('snacks')
        .where('snackId', id)
        .update({
          name,
          description,
          date: dateDb,
          inDiet,
          updatedAt,
        })

      if (!updateSnackResponse) {
        reply.status(400).send()
      }

      reply.status(200).send()
    },
  )

  app.delete(
    '/:id',
    {
      preHandler: [checkIfUserIsLoggedIn],
    },
    async (request, reply) => {
      const createDeleteParamsSchema = z.object({
        id: z.string().uuid(),
      })

      const { id } = createDeleteParamsSchema.parse(request.params)

      const response = await knex('snacks').where('snackId', id).del()

      if (!response) {
        reply.status(400).send()
      }

      reply.status(200).send()
    },
  )
}
