import { Request, Response } from 'express'
import { Builder } from 'builder-pattern'

import { ApiResponse } from '@type/typings.js'
import SuccessMessages from '@constants/success-message.js'

import { logger } from '@utils/logger-config.js'

class PingController {
    public async ping(request: Request, response: Response) {
        const requestId = request?.query?.requestId as string
        logger.info({
            message: `Someone ping ...`,
            requestId,
        })
        const res = Builder<ApiResponse<undefined>>()
            .message(SuccessMessages.Pong)
            .success(true)
            .data(undefined)
            .build()
        response.json(res)
    }
}

export default new PingController()
