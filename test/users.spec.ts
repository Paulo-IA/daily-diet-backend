import { afterAll, beforeAll, beforeEach, describe, it } from 'vitest'
import request from 'supertest'
import { app } from '../src/app'
import { randomEmail } from '../src/utils/random-email'
import { execSync } from 'node:child_process'

describe('User and auth routes', () => {
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

  it('should be able to create a user', async () => {
    await request(app.server)
      .post('/users')
      .send({
        name: 'Paulo Fernandes',
        email: randomEmail(),
        password: '123',
      })
      .expect(201)
  })

  it('should be able to auth an user', async () => {
    const email = randomEmail()
    const password = '123'

    await request(app.server)
      .post('/users')
      .send({
        name: 'Paulo Fernandes',
        email,
        password,
      })
      .expect(201)

    await request(app.server)
      .post('/auth')
      .send({
        email,
        password,
      })
      .expect(200)
  })
})
