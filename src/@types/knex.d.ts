import { Knex } from 'knex'

declare module 'knex/types/tables' {
  export interface Tables {
    users: {
      userId: string
      name: string
      created_at: string
      sessionId?: string
    }
  }
}
