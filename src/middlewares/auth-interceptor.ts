import { Builder } from 'builder-pattern'
import { NextFunction, Request, Response } from 'express'

import ErrorMessages from '@constants/error-message.js'
import { logger } from '@utils/logger-config.js'
import AuthService from '@services/auth-service.js'
import { ApiResponse } from '@type/typings.js'
import { REQUESTID_HEADER_KEY, TOKEN_HEADER_KEY } from '@constants/const.js'

class AuthInterceptor {
    public async authenticate(req: Request, res: Response, next: NextFunction) {
        const token = req.header(TOKEN_HEADER_KEY)
        const requestId = req.header(REQUESTID_HEADER_KEY)
        try {
            logger.info({
                message: 'Authenticating user...',
                requestId,
                token,
            })
            const userId = await AuthService.authenticateUser(token, requestId)
            req.query.requestId = requestId
            req.query.userId = userId
            next()
        } catch (err) {
            logger.info({
                message: 'Failed Authentication',
                requestId,
                token,
            })
            res.status(401).json(
                Builder<ApiResponse<never>>()
                    .message(err.message || ErrorMessages.Unauthorized)
                    .success(false)
                    .build(),
            )
        }
    }
    public async attachRequestId(
        req: Request,
        __: Response,
        next: NextFunction,
    ) {
        const requestId = req.header(REQUESTID_HEADER_KEY)
        req.query.requestId = requestId
        console.log('reviced a requestId :', requestId)
        next()
    }
}

export default new AuthInterceptor()
