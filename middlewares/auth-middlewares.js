const ApiError = require('../exeption/api-error');
const tokenService = require('../services/tokenService');

module.exports = async function (req, res, next) {
    try {
        const authorizationHeaders = req.headers.authorization;
        if (!authorizationHeaders) {
            return next(ApiError.UnauthorizedError());
        }

        const accessToken = authorizationHeaders.split(' ')[1];

        if (!accessToken) {
            return next(ApiError.UnauthorizedError());
        }

        const userData = await tokenService.validateAccessToken(accessToken);

        if (!userData) {
            return next(ApiError.UnauthorizedError());
        }

        req.user = userData;
        next();
    } catch (e) {
        return next(ApiError.UnauthorizedError());
    }
}