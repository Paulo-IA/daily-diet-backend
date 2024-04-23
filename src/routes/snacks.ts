import { randomUUID } from 'crypto'
import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'

export async function snacksRoutes(app: FastifyInstance) {
  app.get('/', async () => {
    const snacks = await knex('snacks').select('*')

    return { snacks }
  })

  app.post('/', async (request, reply) => {
    const userId = randomUUID() // trocar para session id (resgatar do cookie)

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
  })
}
