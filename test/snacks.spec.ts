import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '../src/app'
import { execSync } from 'node:child_process'
import { randomEmail } from '../src/utils/random-email'
import { object } from 'zod'

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

    await request(app.server).post('/snacks').set('Cookie', cookies).send({
      name: 'Almoço',
      description: 'Arroz, feijão, salada, legumes e frango grelhado',
      date: '23/04/2024',
      hour: '12:43',
      inDiet: true,
    })

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

  it('should be able to update a snack', async () => {
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
      description: 'Arroz, feijão, salada, legumes e frango grelhado',
      date: '23/04/2024',
      hour: '12:43',
      inDiet: true,
    })

    const listSnacksResponse = await request(app.server)
      .get('/snacks')
      .set('Cookie', cookies)

    const { snackId, description } = listSnacksResponse.body.snacks[0]

    expect(description).toEqual(
      'Arroz, feijão, salada, legumes e frango grelhado',
    )

    await request(app.server)
      .put(`/snacks/${snackId}`)
      .set('Cookie', cookies)
      .send({
        name: 'Almoço',
        description: 'Arroz, feijoada, salada, legumes e frango grelhado',
        date: '23/04/2024',
        hour: '12:43',
        inDiet: true,
      })

    const updatedListSnackResponse = await request(app.server)
      .get('/snacks')
      .set('Cookie', cookies)

    const descriptionUpdated =
      updatedListSnackResponse.body.snacks[0].description

    expect(descriptionUpdated).toEqual(
      'Arroz, feijoada, salada, legumes e frango grelhado',
    )
  })

  it('should be able to delete an snack', async () => {
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
      description: 'Arroz, feijão, salada, legumes e frango grelhado',
      date: '23/04/2024',
      hour: '12:43',
      inDiet: true,
    })

    const listSnacksResponse = await request(app.server)
      .get('/snacks')
      .set('Cookie', cookies)

    const { snackId } = listSnacksResponse.body.snacks[0]

    await request(app.server)
      .delete(`/snacks/${snackId}`)
      .set('Cookie', cookies)
      .expect(200)
  })

  it('should be able to get a single snack', async () => {
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

    const listAllSnacksResponse = await request(app.server)
      .get('/snacks')
      .set('Cookie', cookies)

    const { snackId, userId, date, createdAt } =
      listAllSnacksResponse.body.snacks[0]

    console.log(snackId)

    const listSingleSnackResponse = await request(app.server)
      .get(`/snacks/${snackId}`)
      .set('Cookie', cookies)

    expect(listSingleSnackResponse.body.snack).toEqual([
      expect.objectContaining({
        snackId,
        userId,
        name: 'Almoço',
        description: 'Arroz, frango, e salada',
        inDiet: 1,
        date,
        createdAt,
        updatedAt: null,
      }),
    ])
  })
})
