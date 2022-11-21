const mysql = require("mysql");
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_AUTH,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS
});
const dto = require('../dto/dto');

class UsersController {
    getUser(req, res, next) {
        const query = `select * from users where id='${req.params.id}';`;
        connection.query(query, (e, r) => {
            if (e) next(e);
            return res.json(dto.userDto(r[0]));
        })
    }

    getAllUsers(req, res, next) {
        const query = `select * from users;`;
        connection.query(query, (e, r) => {
            if (e) next(e);
            const users = r.map(u => dto.userDto(u))
            return res.json(users);
        })
    }

    updateUsers(req, res, next) {
        const query = `UPDATE users set is_blocked=${req.body.isBlocked} WHERE id IN (${req.body.users});`;
        connection.query(query, (e, r) => {
            if (e) next(e);
            return res.json({status: 'Success'})
        });
    }

    deleteUsers(req, res, next) {
        const query = `delete from users WHERE id IN (${req.body});`;
        connection.query(query, (e, r) => {
            if (e) next(e);
            return res.json({status: 'Success'})
        });
    }
}

module.exports = new UsersController();