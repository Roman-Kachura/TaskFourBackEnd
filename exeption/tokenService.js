const jwt = require("jsonwebtoken");

class TokenService {
    async generateToken(payload) {
        return  await jwt.sign(payload, process.env.JWT_ACCESS_TOKEN, {expiresIn: '30d'});
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