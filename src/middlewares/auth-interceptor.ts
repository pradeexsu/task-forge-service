import { Builder } from 'builder-pattern'
import { NextFunction, Request, Response } from 'express'

import ErrorMessages from '@constants/error-message.js'
import { logger } from '@utils/logger-config.js'
import AuthService from '@services/auth-service.js'
import { ApiResponse } from '@type/typings.js'
import { TOKEN_HEADER_KEY, USERID_HEADER_KEY } from '@constants/const.js'

class AuthInterceptor {
    public async authenticate(req: Request, res: Response, next: NextFunction) {
        const token = req.header(TOKEN_HEADER_KEY)
        try {
            const id = await AuthService.authenticateUser(token)
            res.setHeader(USERID_HEADER_KEY, id)
            next()
        } catch (err) {
            logger.info({
                message: 'Failed Authentication',
                token: token,
            })
            res.status(401).json(
                Builder<ApiResponse<never>>()
                    .message(err.message || ErrorMessages.Unauthorized)
                    .success(false)
                    .build(),
            )
        }
    }
    public async unAuthenticate(_: Request, __: Response, next: NextFunction) {
        next()
    }
}

export default new AuthInterceptor()
