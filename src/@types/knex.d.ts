import { Knex } from 'knex'

declare module 'knex/types/tables' {
  export interface Tables {
    users: {
      userId: string
      email: string
      password: string
      name: string
      created_at: string
    }
    snacks: {
      snackId: string
      userId: string
      name: string
      description: string
      inDiet: boolean
      date: string
      created_at: string
      updated_at?: string
    }
  }
}
