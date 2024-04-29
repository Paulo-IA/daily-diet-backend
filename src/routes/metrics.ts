import { FastifyInstance } from 'fastify'
import { checkIfUserIsLoggedIn } from '../middlewares/check-if-user-is-logged-in'
import { knex } from '../database'
import { getBetterSequence } from '../utils/betterSequence'

export async function metricsRoutes(app: FastifyInstance) {
  app.get(
    '/total',
    {
      preHandler: [checkIfUserIsLoggedIn],
    },
    async () => {
      const snacks = await knex('snacks').select()

      const totalSnacks = snacks.length

      return { totalSnacks }
    },
  )

  app.get(
    '/inDiet',
    {
      preHandler: [checkIfUserIsLoggedIn],
    },
    async () => {
      const snacksInDiet = await knex('snacks').where('inDiet', true).select()

      const totalOfSnacksInDiet = snacksInDiet.length

      return { totalOfSnacksInDiet }
    },
  )

  app.get(
    '/outDiet',
    {
      preHandler: [checkIfUserIsLoggedIn],
    },
    async () => {
      const snacksOutDiet = await knex('snacks').where('inDiet', false).select()

      const totalOfSnacksOutDiet = snacksOutDiet.length

      return { totalOfSnacksOutDiet }
    },
  )

  app.get(
    '/betterSequence',
    {
      preHandler: [checkIfUserIsLoggedIn],
    },
    async () => {
      const snacks = await knex('snacks').select()

      const betterSequence = getBetterSequence(snacks)

      return { betterSequence }
    },
  )
}
