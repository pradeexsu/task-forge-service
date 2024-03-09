import { Request, Response } from 'express'
import { Builder } from 'builder-pattern'

import { ApiResponse, AuthResponse } from '@type/typings.js'
import ErrorMessages from '@constants/error-message.js'
import SuccessMessages from '@constants/success-message.js'

import AuthService from '@services/auth-service.js'
import { TOKEN_HEADER_KEY } from '@constants/const.js'

class AuthController {
    public async register(req: Request, res: Response) {
        const { username, email, password } = req.body
        try {
            const { accessToken, user } = await AuthService.registerUser({
                username,
                email,
                password,
            })
            res.setHeader(TOKEN_HEADER_KEY, accessToken)
            console.log(`${email} registered successfully`)
            res.json(
                Builder<ApiResponse<AuthResponse>>()
                    .message(SuccessMessages.UserSignedUpSuccessfully)
                    .success(true)
                    .data(user)
                    .build(),
            )
        } catch (error) {
            res.json(
                Builder<ApiResponse<never>>()
                    .message(error.message || ErrorMessages.SignUpFailed)
                    .success(false)
                    .build(),
            )
        }
    }

    public async login(req: Request, res: Response) {
        const { email, password } = req.body
        console.log(AuthService.loginUser)
        try {
            const { accessToken, user } = await AuthService.loginUser({
                email,
                password,
            })
            res.setHeader(TOKEN_HEADER_KEY, accessToken)
            console.log(`${email} login successfully`)
            res.json(
                Builder<ApiResponse<AuthResponse>>()
                    .message(SuccessMessages.UserLoggedInSuccessfully)
                    .success(true)
                    .data(user)
                    .build(),
            )
        } catch (error) {
            res.json(
                Builder<ApiResponse<never>>()
                    .message(error.message || ErrorMessages.LogInFailed)
                    .success(false)
                    .build(),
            )
        }
    }
}

export default new AuthController()
