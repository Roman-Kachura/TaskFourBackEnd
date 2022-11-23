const ApiError = require('../exeption/api-error');
const tokenService = require('../exeption/tokenService');

module.exports = async function (req, res, next) {
    try {
        const authorizationHeaders = req.headers.authorization;
        if (!authorizationHeaders) {
            return ApiError.responseError(401, 'Unauthorized!', res)
        }

        const token = authorizationHeaders.split(' ')[1];

        if (!token) {
            return ApiError.responseError(401, 'Unauthorized!', res)
        }

        const userData = await tokenService.validateAccessToken(token);

        if (!userData) {
            return ApiError.responseError(401, 'Unauthorized!', res)
        }
        next();
    } catch (e) {
        return ApiError.responseError(401, 'Unauthorized!', res)
    }
}