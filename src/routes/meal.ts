import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import { randomUUID } from 'node:crypto'
import { z } from 'zod'

export async function mealRoutes(app: FastifyInstance) {
    app.get('/:id', async (request) => {
        const getMealSchema = z.object({
            id: z.string().uuid(),
        })

        const { id } = getMealSchema.parse(request.params)

        const meal = await knex('meals').select('*').where('id', id).first()

        return { meal }
    })

    app.post('/', async (request, reply) => {
        const createMealSchema = z.object({
            name: z.string(),
            description: z.string(),
            in_diet: z.boolean(),
            user_id: z.string(),
        })

        const { name, description, in_diet, user_id } = createMealSchema.parse(
            request.body,
        )

        const newMeal = await knex('meals')
            .insert({
                id: randomUUID(),
                name,
                description,
                in_diet,
                user_id,
            })
            .returning('*')

        const columnToUpdate = in_diet
            ? 'total_meal_inside_diet'
            : 'total_meal_outside_diet'

        await knex('users')
            .where('user_id', user_id)
            .increment(columnToUpdate, 1)

        return reply.status(201).send(newMeal)
    })

    app.delete('/:id', async (request, reply) => {
        const deleteMealSchema = z.object({
            id: z.string().uuid(),
        })

        const { id } = deleteMealSchema.parse(request.params)

        await knex('meals').where('id', id).del()

        return reply.status(200).send('Refeição deletada com sucesso!')
    })
}
