const jwt = require("jsonwebtoken")
const {PrismaClient} = require("@prisma/client");
const ApiError = require("../../../exceptions/ApiError");
const UserDto = require("../../../dto/UserDto");

class TokenService {
    prisma = new PrismaClient()

    generateTokens(payload) {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn: '1h'})
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn: '30d'})
        return {
            accessToken, refreshToken
        }
    }

    validateAccessToken(token) {
        const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET)
        return new UserDto(userData)
    }

    validateRefreshToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET)
            return new UserDto(userData)
        } catch (e) {
            return null
        }
    }

    async saveToken(userId, refreshToken) {
        return this.prisma.users.update({where: {id: userId}, data: {refreshToken}});
    }

    async removeToken(refreshToken) {
        const userData = this.validateRefreshToken(refreshToken)
        return this.prisma.users.update({where: {id: userData.id}, data: {refreshToken: null}})
    }

    async refreshToken(refreshToken) {
        const userData = this.validateRefreshToken(refreshToken)
        if (!userData) {
            throw ApiError.UnauthorizedError()
        }

        const userFromDB = await this.prisma.users.findFirst({where: {id: userData.id}})
        if (!userFromDB) {
            throw ApiError.UnauthorizedError()
        }
        if (userFromDB.refreshToken !== refreshToken) {
            throw ApiError.UnauthorizedError()
        }
        const userDto = new UserDto(userData)
        const tokens = this.generateTokens({...userDto})
        await this.saveToken(userDto.id, tokens.refreshToken)
        return {...tokens, user: userDto}
    }
}

module.exports = new TokenService()