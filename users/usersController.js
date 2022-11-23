const ApiError = require('../exeption/api-error');
const dto = require('../exeption/dto');
const mysql = require("mysql");
const apiErrors = require("../exeption/api-error");
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_AUTH,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS
});

class UsersController {
    getUser(req, res) {
        const query = `select * from users where id='${req.params.id}';`;
        connection.query(query, (e, r) => {
            if (e) ApiError.responseError(500, e, res);
            return res.json(dto.getUserData(r[0]));
        })
    }

    getAllUsers(req, res, next) {
        const query = `select * from users;`;
        connection.query(query, (e, r) => {
            if (e) return apiErrors.responseError(500, e, res);
            const users = r.map(u => dto.getUserData(u))
            return res.json(users);
        })
    }

    updateUsers(req, res, next) {
        const query = `UPDATE users set is_blocked=${req.body.isBlocked} WHERE id IN (${req.body.users});`;
        connection.query(query, (e, r) => {
            if (e) return apiErrors.responseError(500, e, res);
            return res.json({})
        });
    }

    deleteUsers(req, res, next) {
        const query = `delete from users WHERE id IN (${req.body});`;
        connection.query(query, (e, r) => {
            if (e) return apiErrors.responseError(500, e, res);
            return res.json({status: 'Success'})
        });
    }
}

module.exports = new UsersController();