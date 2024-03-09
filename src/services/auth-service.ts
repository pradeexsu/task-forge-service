import { v4 as uuid } from 'uuid'
import jwt from 'jsonwebtoken'

import { logger } from '@utils/logger-config.js'
import prismaClient from '@prisma-client.js'
import { genrateJwtToken } from '@utils/token-genrator.js'

import ErrorMessages from '@constants/error-message.js'
import { AuthRequest } from '@type/typings.js'

class AuthService {
    public async authenticateUser(token?: string): Promise<string> {
        if (!token) throw new Error()
        const { email, id } = jwt.verify(
            token,
            process.env.TOKEN_SECRET,
        ) as jwt.JwtPayload
        const { token: accessToken } = await prismaClient.user.findUnique({
            where: {
                id,
            },
            select: {
                token: true,
            },
        })

        if (token !== accessToken) {
            throw new Error()
        }
        logger.info({
            message: `${email} Authenticated`,
        })
        return id
    }

    public async registerUser(authRequest: AuthRequest) {
        const { username, email, password } = authRequest
        if (!username || !email || !password) {
            throw new Error(ErrorMessages.InvalidCredentials)
        }
        const userExists = await prismaClient.user.findUnique({
            where: {
                email,
            },
        })
        if (userExists) {
            throw new Error(ErrorMessages.UserExists)
        }
        const id = uuid()
        const accessToken = genrateJwtToken({ email, username, id })
        const createdUser = await prismaClient.user.create({
            data: {
                id,
                email,
                username,
                password,
                token: accessToken,
            },
        })

        return {
            accessToken,
            user: {
                id: createdUser.id,
                email: createdUser.email,
                username: createdUser.username,
            },
        }
    }

    public async loginUser(authRequest: AuthRequest) {
        const { email, password: pwd } = authRequest
        const { id, username, password } = await prismaClient.user.findUnique({
            where: {
                email,
            },
        })
        if (password !== pwd) {
            throw new Error(ErrorMessages.InvalidCredentials)
        }
        const accessToken = genrateJwtToken({
            username,
            email,
            id,
        })

        const updatedUser = await prismaClient.user.update({
            where: {
                email,
            },
            data: {
                token: accessToken,
            },
        })

        return {
            accessToken,
            user: {
                id: updatedUser.id,
                email: updatedUser.email,
                username: updatedUser.username,
            },
        }
    }
}

export default new AuthService()
