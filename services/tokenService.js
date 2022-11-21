const jwt = require("jsonwebtoken");

class TokenService {
    async generateToken(payload) {
        const accessToken = await jwt.sign(payload, process.env.JWT_ACCESS_TOKEN, {expiresIn: '1d'});
        const refreshToken = await jwt.sign(payload, process.env.JWT_REFRESH_TOKEN, {expiresIn: '30d'});
        return {accessToken, refreshToken}
    }

    async validateAccessToken(token) {
        try {
            const userData = await jwt.verify(token, process.env.JWT_ACCESS_TOKEN);
            return userData;
        } catch (e) {
            return null
        }
    }
};

module.exports = new TokenService();