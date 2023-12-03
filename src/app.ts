import fastify from 'fastify'

import { userRoutes, mealRoutes } from './routes'

export const app = fastify()

app.register(userRoutes, {
    prefix: 'user',
})

app.register(mealRoutes, {
    prefix: 'meal',
})
