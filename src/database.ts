import { knex as setupKnex, Knex } from 'knex'

if (process.env.DATABASE_URL) {
    throw new Error('DATABASE URL NOT FOUND')
}

export const config: Knex.Config = {
    client: 'sqlite',
    connection: {
        filename: './db/app.sqlite',
    },
    useNullAsDefault: true,
    migrations: {
        extension: 'ts',
        directory: './db/migrations',
    },
}

export const knex = setupKnex(config)
