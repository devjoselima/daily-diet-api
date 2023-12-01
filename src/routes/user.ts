import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import { randomUUID } from 'node:crypto'
import { z } from 'zod'

export async function userRoutes(app: FastifyInstance) {
    app.post('/', async (request, reply) => {
        const createUserSchema = z.object({
            name: z.string(),
            email: z.string().email(),
            password: z.string().min(6),
        })

        const { name, email, password } = createUserSchema.parse(request.body)

        await knex('users').insert({
            user_id: randomUUID(),
            name,
            email,
            password,
        })

        return reply.status(201).send()
    })
}
