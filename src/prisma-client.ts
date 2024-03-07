import { PrismaClient } from '@prisma/client'

export const prismaClient = new PrismaClient()
prismaClient
    .$connect()
    .then(() => {
        console.log('Prisma Connection Success!!')
    })
    .catch((err) => {
        console.log(process.env.DATABASE_URL)
        console.log(err)

        console.log('Prisma Connection Failed!!')
    })
