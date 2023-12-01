import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('meals', (table) => {
        table.uuid('id').primary()
        table.string('name').notNullable()
        table.string('description').notNullable()
        table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
        table.boolean('in_diet').defaultTo(true)
        table
            .uuid('user_id')
            .references('id')
            .inTable('users')
            .onDelete('CASCADE')
    })
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('meals')
}
