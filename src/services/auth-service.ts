import { v4 as uuid } from 'uuid'

import { logger } from '@utils/logger-config.js'
import { genrateJwtToken, verifyJwtToken } from '@utils/token-genrator.js'

import ErrorMessages from '@constants/error-message.js'
import { AuthRequest } from '@type/typings.js'
import userRepository from '@repository/user-repository.js'

class AuthService {
    public async authenticateUser(
        token?: string,
        requestId?: string,
    ): Promise<string> {
        const { id: userId, email } = await verifyJwtToken(token, requestId)
        const accessToken = await userRepository.findAccessTokenByUserId(
            userId,
            requestId,
        )

        if (token !== accessToken) {
            throw new Error()
        }
        logger.info({
            message: `${email} Authenticated`,
            requestId,
        })
        return userId
    }

    public async registerUser(authRequest: AuthRequest, requestId: string) {
        logger.info({
            message: 'Registering new user...',
            authRequest,
            requestId,
        })
        const { username, email, password } = authRequest
        if (!username || !email || !password) {
            throw new Error(ErrorMessages.InvalidCredentials)
        }
        const userExists = await userRepository.isUserExists(email, requestId)
        if (userExists) {
            throw new Error(ErrorMessages.UserAlreadyExists)
        }
        const id = uuid()
        const token = genrateJwtToken({ email, username, id }, requestId)
        const user = {
            password,
            username,
            token,
            email,
            id,
            loggedIn: true,
        }
        await userRepository.createUser(user, requestId)
        logger.info({
            message: 'User new user registered',
            authRequest,
            requestId,
        })
        return {
            accessToken: token,
            user: {
                username,
                email,
                id,
            },
        }
    }

    public async loginUser(authRequest: AuthRequest, requestId: string) {
        const { email, password: pwd } = authRequest
        logger.info({
            message: 'Logging in user...',
            requestId,
            email,
        })
        const { id, username, password } = await userRepository.findUserByEmail(
            email,
            requestId,
        )
        if (password !== pwd) {
            throw new Error(ErrorMessages.InvalidCredentials)
        }
        const accessToken = genrateJwtToken(
            {
                username,
                email,
                id,
            },
            requestId,
        )
        await userRepository.updateJwtToken(email, accessToken, requestId)
        logger.info({
            message: 'User logged in successfully',
            requestId,
            email,
        })
        return {
            accessToken,
            user: {
                username,
                email,
                id,
            },
        }
    }

    public async logoutUser(userId: string, requestId: string) {
        logger.info({
            message: 'Logging out user...',
            requestId,
            userId,
        })

        const data = await userRepository.logoutUser(userId, requestId)
        if (null !== data || !data.loggedIn) {
            throw new Error(ErrorMessages.UserNotFound)
        }
        logger.info({
            message: 'User logged out successfully',
            requestId,
            userId,
        })
    }
}

export default new AuthService()
