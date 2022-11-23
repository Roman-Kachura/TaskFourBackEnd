const bcrypt = require('bcrypt');
const apiErrors = require('../exeption/api-error');
const tokenService = require('../exeption/tokenService');
const mysql = require("mysql");
const dto = require('../exeption/dto');
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_AUTH,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS
});

class AuthController {
    async registration(req, res) {
        const {name, email, password} = req.body;
        connection.query(`select * from users where email='${email}';`, async (e, r) => {
            if (e) return apiErrors.responseError(500, e, res);
            if (r.length) return apiErrors.responseError(406, 'User with this email is already registered!', res);
            const hash = bcrypt.hashSync(password, 7);
            const token = await tokenService.generateToken({name, email});
            const query = `INSERT INTO users(name,email,password,token) values('${name}', '${email}', '${hash}','${token}');`;
            connection.query(query, (e, r) => {
                if (e) return apiErrors.responseError(500, e, res);
                return res.json({
                    id: r.insertId, isBlocked: false, registered: r.reg_date, lastDate: r.last_date, token
                })
            });
        });
    }

    async login(req, res) {
        const {email, password} = req.body;
        const query = `select * from users where email='${email}';`
        connection.query(query, async (e, r) => {
            if (e) return apiErrors.responseError(500, e, res);
            if (r.length === 0) return apiErrors.responseError(404, 'User with this email is not found!', res);
            let u = r[0];
            if (u && !!u.is_blocked) return apiErrors.responseError(423, 'User is blocked!', res);
            const isValidPassword = await bcrypt.compareSync(password, u.password);
            if (!isValidPassword) return apiErrors.responseError(406, 'Email or password is not correct!', res)
            connection.query(`update users set last_date=CURRENT_TIMESTAMP where id='${u.id}';`, (e, r) => {
                if (e) return apiErrors.responseError(500, e, res);
                return res.json(dto.getAuthUserData(u));
            });
        });
    }

    async logout(req, res) {
        const query = `update users set last_date=CURRENT_TIMESTAMP where id=${req.params.id};`;
        connection.query(query, (e, r) => {
            if (e) return apiErrors.responseError(500, e, res);
            return res.json({});
        });
    }
}

module.exports = new AuthController();