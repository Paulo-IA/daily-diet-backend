import { FastifyInstance } from 'fastify'
import { checkIfUserIsLoggedIn } from '../middlewares/check-if-user-is-logged-in'
import { knex } from '../database'

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
}
