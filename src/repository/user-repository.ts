import prismaClient from '@prisma-client.js'
import { User } from '@prisma/client'
import { logger } from '@utils/logger-config.js'

class UserRepository {
    public async createUser(user: User, requestId: string): Promise<void> {
        logger.debug({
            message: 'Creating new user...',
            requestId,
        })
        await prismaClient.user.create({
            data: user,
        })
        logger.debug({
            message: 'Created new user successfully!',
            requestId,
        })
    }

    public async findUserByEmail(
        email: string,
        requestId: string,
    ): Promise<User> {
        logger.debug({
            message: 'Retrieving user...',
            requestId,
        })
        const user = prismaClient.user.findUnique({
            where: {
                email,
            },
        })
        logger.debug({
            message: 'Retrieved user successfully!',
            requestId,
        })
        return user
    }

    public async findAccessTokenByUserId(
        userId: string,
        requestId: string,
    ): Promise<string> {
        logger.debug({
            message: 'Retrieving user token...',
            requestId,
        })
        const { token } = await prismaClient.user.findUnique({
            where: {
                id: userId,
            },
            select: {
                token: true,
                loggedIn: true,
            },
        })
        logger.debug({
            message: 'Retrieved user token successfully!',
            requestId,
            token,
        })
        return token
    }

    public async isUserExists(
        email: string,
        requestId: string,
    ): Promise<boolean> {
        logger.debug({
            message: 'Checking if user exists...',
            requestId,
        })
        return (
            (await prismaClient.user.findUnique({
                where: {
                    email,
                },
            })) !== null
        )
    }
    public async updateJwtToken(
        email: string,
        token: string,
        requestId: string,
    ): Promise<void> {
        logger.debug({
            message: 'Updating user token...',
            requestId,
        })
        await prismaClient.user.update({
            where: {
                email,
            },
            data: {
                token,
                loggedIn: true,
            },
        })
        logger.debug({
            message: 'Updated user token successfully!',
            requestId,
            token,
        })
    }

    public async logoutUser(userId: string, requestId: string): Promise<User> {
        logger.debug({
            message: 'Updating user token...',
            requestId,
        })
        const data = await prismaClient.user.update({
            where: {
                id: userId,
            },
            data: {
                loggedIn: false,
            },
        })

        logger.debug({
            message: 'Updated logged out entry to db successfully!',
            requestId,
        })
        return data
    }
}

export default new UserRepository()
