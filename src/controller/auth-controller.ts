import jwt from 'jsonwebtoken'
import { v4 as uuid } from 'uuid'
import { NextFunction, Request, Response } from 'express'
import { prismaClient } from '../prisma-client.js'
import { genrateJwtToken } from '../utils/token-genrator.js'

export const authenticate = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const token = req.header('token')
    if (!token) {
        res.json({ succes: false, message: 'Access denied' })
        return
    }
    try {
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
        if (accessToken === token) {
            res.setHeader('userId', id)
            console.log(`${email} authenticated`)
            next()
        } else {
            throw new Error()
        }
    } catch (err) {
        res.status(401)
        res.json({ succes: false, message: err.message || 'Invalid token' })
    }
}

export const unAuthenticate = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    next()
}

export const register = async (req: Request, res: Response) => {
    const { username, email, password } = req.body

    if (!username || !email || !password) {
        res.json({
            succes: false,
            message: 'username, email, and password required',
        })
        return
    }
    const userExists = await prismaClient.user.findUnique({
        where: {
            email,
        },
    })
    if (userExists) {
        res.json({ succes: false, message: 'User already exists' })
        return false
    }

    const id = uuid()
    const accessToken = genrateJwtToken({ email, username, id })
    await prismaClient.user.create({
        data: {
            id,
            email,
            username,
            password,
            token: accessToken,
        },
    })
    res.setHeader('token', accessToken)
    console.log(`${email} registered successfully`)
    res.json({
        succes: true,
        message: 'User registered successfully',
        user: { email, username },
    })
}

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body
    const user = await prismaClient.user.findUnique({
        where: {
            email,
        },
    })
    if (user?.id && user?.password === password) {
        const accessToken = genrateJwtToken({
            email,
            id: user?.id,
            username: user?.username,
        })

        await prismaClient.user.update({
            where: {
                email,
            },
            data: {
                token: accessToken,
            },
        })
        res.setHeader('token', accessToken)
        console.log(`${email} login successfully`)
        res.json({
            succes: true,
            message: 'User logged in successfully',
            user: { email, username: user?.username },
        })
    } else {
        res.json({ succes: false, message: 'Invalid email or password' })
    }
}
