import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import { randomUUID } from 'node:crypto'
import { z } from 'zod'

export async function userRoutes(app: FastifyInstance) {
    app.get('/:id', async (request) => {
        const getUserSchema = z.object({
            id: z.string().uuid(),
        })

        const { id } = getUserSchema.parse(request.params)

        const user = await knex('users')
            .select('*')
            .where('user_id', id)
            .first()

        return { user }
    })

    app.post('/', async (request, reply) => {
        const createUserSchema = z.object({
            name: z.string(),
            email: z.string().email(),
            password: z.string().min(6),
        })

        const { name, email, password } = createUserSchema.parse(request.body)

        const newUser = await knex('users')
            .insert({
                user_id: randomUUID(),
                name,
                email,
                password,
            })
            .returning('*')

        return reply.status(201).send(newUser)
    })
}
