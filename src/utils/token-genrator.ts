import jwt from 'jsonwebtoken'

/**
 * The function `generateJwtToken` generates a JWT token with user data and a 1-day expiration.
 * @param data - The `data` parameter in the `genrateJwtToken` function is an object that contains the
 * following properties:
 * @returns A JSON Web Token (JWT) is being returned.
 */
export const genrateJwtToken = (data: {
    email: string
    id: string
    username: string
}) => {
    return jwt.sign(data, process.env.TOKEN_SECRET, { expiresIn: '1d' })
}
