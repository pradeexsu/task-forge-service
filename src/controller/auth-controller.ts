import { Request, Response } from 'express'
import { Builder } from 'builder-pattern'

import { ApiResponse, AuthResponse } from '@type/typings.js'
import ErrorMessages from '@constants/error-message.js'
import SuccessMessages from '@constants/success-message.js'

import authService from '@services/auth-service.js'
import { TOKEN_HEADER_KEY } from '@constants/const.js'
import { logger } from '@utils/logger-config.js'

class AuthController {
    public async register(request: Request, response: Response) {
        const { username, email, password } = request.body
        const requestId = request.query.requestId as string
        try {
            logger.info({
                message: `Registering new user with email: ${email}`,
                requestId,
            })
            const { accessToken, user } = await authService.registerUser(
                {
                    username,
                    password,
                    email,
                },
                requestId,
            )
            response.setHeader(TOKEN_HEADER_KEY, accessToken)
            logger.info({
                message: `${email} registered successfully`,
                requestId,
            })
            const res = Builder<ApiResponse<AuthResponse>>()
                .message(SuccessMessages.UserSignedUp)
                .success(true)
                .data(user)
                .build()
            response.json(res)
        } catch (error) {
            logger.error({
                message: `Failed to register user with email: ${email}`,
                requestId,
                error,
            })
            const res = Builder<ApiResponse<never>>()
                .message(error.message || ErrorMessages.SignUpFailed)
                .success(false)
                .build()
            response.json(res)
        }
    }

    public async login(request: Request, response: Response) {
        const { email, password } = request.body
        const requestId = request.query.requestId as string

        logger.info({
            message: `Logging in user with email: ${email}`,
            requestId,
        })
        try {
            const { accessToken, user } = await authService.loginUser(
                {
                    password,
                    email,
                },
                requestId,
            )
            response.setHeader(TOKEN_HEADER_KEY, accessToken)
            logger.info({
                message: `${email} logged in successfully`,
                requestId,
            })
            const res = Builder<ApiResponse<AuthResponse>>()
                .message(SuccessMessages.UserLoggedIn)
                .success(true)
                .data(user)
                .build()
            response.json(res)
        } catch (error) {
            logger.error({
                message: `Failed to log in user with email: ${email}`,
                requestId,
                error,
            })
            const res = Builder<ApiResponse<never>>()
                .message(error.message || ErrorMessages.LogInFailed)
                .success(false)
                .build()
            response.json(res)
        }
    }
}

export default new AuthController()
