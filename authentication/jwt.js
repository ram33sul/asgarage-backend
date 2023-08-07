import jwt from 'jsonwebtoken';

export const jwtSign = (userId) => {
    return jwt.sign({
        userId
    },
    process.env.AUTH_SECRET_KEY,
    {
        expiresIn: '7d'
    })
}

export const jwtSignAdmin = (adminId) => {
    return jwt.sign({
        adminId
    },
    process.env.AUTH_SECRET_KEY_ADMIN,
    {
        expiresIn: '1d'
    })
}