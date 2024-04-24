import { afterAll, beforeAll, beforeEach, describe, it } from 'vitest'
import request from 'supertest'
import { app } from '../src/app'
import { randomEmail } from '../src/utils/random-email'
import { execSync } from 'node:child_process'

describe('Users routes', () => {
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
})
