import jwt from 'jsonwebtoken'
import { logger } from '@utils/logger-config.js'
import { AuthResponse } from '@type/typings.js'

/**
 * The function `generateJwtToken` generates a JWT token with user data and a 1-day expiration.
 * @param data - The `data` parameter in the `genrateJwtToken` function is an object that contains the
 * following properties:
 * @returns A JSON Web Token (JWT) is being returned.
 */
export const genrateJwtToken = (data: AuthResponse, requestId: string) => {
    logger.debug({
        message: 'Genrating new token...',
        requestId,
        data,
    })
    const token = jwt.sign(data, process.env.TOKEN_SECRET, { expiresIn: '1d' })
    logger.debug({
        message: 'Token genrated successfully',
        requestId,
        token,
    })
    return token
}

/**
 * The function `verifyJwtToken` verifies a JWT token and extracts the email and id from its payload.
 * @param {string} [token] - The `token` parameter is a string that represents a JSON Web Token (JWT)
 * that needs to be verified. It is passed to the `verifyJwtToken` function to verify its authenticity
 * and extract the email and id information from it.
 * @returns The function `verifyJwtToken` is returning an object with the properties `email` and `id`
 * extracted from the decoded JWT payload.
 */
export const verifyJwtToken = async (token?: string, requestId?: string) => {
    logger.debug({
        message: 'Verifying token...',
        requestId,
    })
    const { email, id } = (await jwt.verify(
        token,
        process.env.TOKEN_SECRET,
    )) as jwt.JwtPayload

    return { email, id }
}
