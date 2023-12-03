import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('users', (table) => {
        table.uuid('user_id').primary()
        table.string('name').notNullable()
        table.string('email').notNullable()
        table.string('password').notNullable()
        table.integer('total_meals').defaultTo(0)
        table.integer('total_meal_inside_diet').defaultTo(0)
        table.integer('total_meal_outsite_diet').defaultTo(0)
    })
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('users')
}
