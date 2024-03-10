import { createLogger, format, transports } from 'winston'

export const logger = createLogger({
    format: format.combine(
        format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss',
        }),
        format.json(),
    ),
    transports: [
        new transports.Console(),
        new transports.File({ filename: 'combined.log' }),
    ],
})
