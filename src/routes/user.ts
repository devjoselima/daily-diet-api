import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import { randomUUID } from 'node:crypto'
import { z } from 'zod'

export async function userRoutes(app: FastifyInstance) {
    app.get('/:id', async (request, reply) => {
        try {
            const getUserSchema = z.object({
                id: z.string().uuid(),
            })

            const { id } = getUserSchema.parse(request.params)

            const user = await knex('users')
                .select('*')
                .where('user_id', id)
                .first()

            if (!user) {
                return reply.status(404).send({ error: 'Id is not found' })
            }

            return { user }
        } catch (error) {
            console.error(error)
            return reply.status(500).send({ error: 'Internal Server Error' })
        }
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

    app.delete('/:id', async (request, reply) => {
        const deleteUserSchema = z.object({
            id: z.string().uuid(),
        })

        const { id } = deleteUserSchema.parse(request.params)

        await knex('users').where('user_id', id).del()

        return reply.status(200).send('Usuário deletado com sucesso!')
    })
}
