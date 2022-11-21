require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const app = express();
const authRouter = require('./auth/authRouter');
const usersRouter = require('./users/usersRouter');
const port = process.env.PORT || 3020;
const errorMiddlewares = require('./middlewares/error-middlewares');
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL
}));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use('/auth', authRouter);
app.use('/users', usersRouter);
app.use(errorMiddlewares);
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});