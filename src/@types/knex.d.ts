import { Knex } from 'knex'

declare module 'knex/types/tables' {
  export interface Tables {
    users: {
      userId: string
      email: string
      password: string
      name: string
      createdAt: string
    }
    snacks: {
      snackId: string
      userId: string
      name: string
      description: string
      inDiet: boolean
      date: string
      createdAt: string
      updatedAt?: string
    }
  }
}
