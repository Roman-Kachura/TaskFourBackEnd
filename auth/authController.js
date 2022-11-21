const bcrypt = require('bcrypt');
const tokenService = require('../services/tokenService');
const mysql = require("mysql");
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_AUTH,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS
});
const dto = require('../dto/dto');

class AuthController {
    async registration(req, res, next) {
        const {name, email, password} = req.body;

        connection.query(`select * from itransition.users where email='${email}';`, async (e, r) => {
            if (e) next(e);
            if (!!r && r.length) next({message: 'User with this email is already registered!'});
            const hash = bcrypt.hashSync(password, 7);
            const {accessToken, refreshToken} = await tokenService.generateToken({name, email});
            const query = `INSERT INTO users(name,email,password,access_token,refresh_token) values('${name}', '${email}', '${hash}','${accessToken}','${refreshToken}');`;
            connection.query(query, (e, r) => {
                if (e) next(e);
                res.cookie('refreshToken', refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true});
                return res.json({
                    id: r.insertId,
                    isBlocked: false,
                    registered: r.reg_date,
                    lastDate: r.last_date,
                    name,
                    email,
                    accessToken,
                    refreshToken
                })
            });
        });
    }

    async login(req, res, next) {
        const {email, password} = req.body;
        connection.query(`select * from itransition.users where email='${email}';`, async (e, r) => {
            if (!r.length) next({message: 'User with this email is not found!'});
            if (!!r[0].is_blocked) next({message: 'User is blocked!'});
            const isValidPassword = await bcrypt.compareSync(password, r[0].password);
            if (!isValidPassword) next({message: 'Email or password is not correct!'});
            const {accessToken, refreshToken} = await tokenService.generateToken({name: r[0].name, email});
            const user = {
                id: r[0].id,
                isBlocked: !!r[0].is_blocked,
                name: r[0].name,
                registered: r[0].reg_date,
                lastDate: r[0].last_date,
                email,
                accessToken,
                refreshToken
            };
            const query = `update users set refresh_token='${refreshToken}', access_token='${accessToken}',last_date=CURRENT_TIMESTAMP where id='${r[0].id}'`;
            connection.query(query, (e, r) => {
                if (e) next(e);
                res.cookie('refreshToken', refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true});
                res.json(user);
            });
        });
    }

    async logout(req, res, next) {
        const query = `update users set refresh_token=null, access_token=null,last_date=CURRENT_TIMESTAMP where id=${req.params.id};`;
        connection.query(query, (e, r) => {
            if (e) next(e);
            res.clearCookie('refreshToken');
            return res.json({
                status: 'You are unauthorized!'
            });
        });
    }
}

module.exports = new AuthController();