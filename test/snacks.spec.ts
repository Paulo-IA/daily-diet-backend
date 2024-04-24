import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '../src/app'
import { execSync } from 'node:child_process'
import { randomEmail } from '../src/utils/random-email'

beforeAll(async () => {
  await app.ready()
})

afterAll(async () => {
  await app.close()
})

beforeEach(() => {
  execSync('npm run knex -- migrate:rollback --all')
  execSync('npm run knex -- migrate:latest')
})

describe('Snacks routes', () => {
  it('should be able to create a snack', async () => {
    const email = randomEmail()
    const password = '123'

    await request(app.server).post('/users').send({
      name: 'Paulo Fernandes',
      email,
      password,
    })

    const authUserResponse = await request(app.server).post('/auth').send({
      email,
      password,
    })

    const cookies = authUserResponse.get('Set-Cookie') ?? []

    await request(app.server)
      .post('/snacks')
      .set('Cookie', cookies)
      .send({
        name: 'Almoço',
        description: 'Arroz, feijão, salada, legumes e frango grelhado',
        date: '23/04/2024',
        hour: '12:43',
        inDiet: true,
      })
      .expect(201)
  })

  it('should be able to list all snacks', async () => {
    const email = randomEmail()
    const password = '123'

    await request(app.server).post('/users').send({
      name: 'Paulo Fernandes',
      email,
      password,
    })

    const authUserResponse = await request(app.server).post('/auth').send({
      email,
      password,
    })

    const cookies = authUserResponse.get('Set-Cookie') ?? []

    await request(app.server)
      .post('/snacks')
      .set('Cookie', cookies)
      .send({
        name: 'Almoço',
        description: 'Arroz, feijão, salada, legumes e frango grelhado',
        date: '23/04/2024',
        hour: '12:43',
        inDiet: true,
      })
      .expect(201)

    const listSnacksResponse = await request(app.server)
      .get('/snacks')
      .set('Cookie', cookies)

    const { snackId, userId, date, createdAt, updatedAt } =
      listSnacksResponse.body.snacks[0]

    expect(listSnacksResponse.body.snacks).toEqual([
      expect.objectContaining({
        snackId,
        userId,
        name: 'Almoço',
        description: 'Arroz, feijão, salada, legumes e frango grelhado',
        inDiet: 1,
        date,
        createdAt,
        updatedAt,
      }),
    ])
  })
})
