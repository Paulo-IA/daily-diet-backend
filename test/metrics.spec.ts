import { afterAll, beforeEach, beforeAll, describe, expect, it } from 'vitest'
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

describe('Metrics routes', () => {
  it.only('should be able to show the total of snacks', async () => {
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

    await request(app.server).post('/snacks').set('Cookie', cookies).send({
      name: 'Almoço',
      description: 'Arroz, frango, e salada',
      date: '23/04/2024',
      hour: '11:45',
      inDiet: true,
    })

    await request(app.server).post('/snacks').set('Cookie', cookies).send({
      name: 'Jantar',
      description: 'Batata, bife, e cebola',
      date: '23/04/2024',
      hour: '20:13',
      inDiet: false,
    })

    await request(app.server).post('/snacks').set('Cookie', cookies).send({
      name: 'Jantar',
      description: 'Pizzada',
      date: '24/04/2024',
      hour: '23:34',
      inDiet: false,
    })

    const metricsTotalResponse = await request(app.server)
      .get('/snacks/metrics/total')
      .set('Cookie', cookies)

    expect(metricsTotalResponse.body.totalSnacks).toEqual(3)
  })
})
