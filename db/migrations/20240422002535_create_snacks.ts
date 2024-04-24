import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('snacks', (table) => {
    table.uuid('snackId').primary()
    table.uuid('userId').notNullable()
    table.string('name').notNullable()
    table.string('description').notNullable()
    table.boolean('inDiet').notNullable()
    table.timestamp('date').notNullable()
    table.timestamp('createdAt')
    table.timestamp('updatedAt')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('snacks')
}
