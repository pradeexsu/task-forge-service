import { PrismaClient } from '@prisma/client'
import { logger } from '@utils/logger-config.js'

const prismaClient = new PrismaClient()
prismaClient
    .$connect()
    .then(() => {
        logger.info({
            message: 'Prisma Connection Success!!',
        })
    })
    .catch((err) => {
        logger.error({
            message: 'Prisma Connection Failed!!',
            error: err,
        })
    })
export default prismaClient
