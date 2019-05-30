//mysql
const mysql = require('nodejs-mysql').default;
let dbConfig = require('../config/db');
const db = mysql.getInstance(dbConfig.mysql);
const sceret = dbConfig.sceret;
let userSql = {
    login: 'select * from user where userName = ?',
};

let JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
let opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = sceret;


module.exports = passport => {
    passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
        //console.log('jwt_payload');
        //console.log(jwt_payload);
        db.exec(userSql.login, [jwt_payload.name])
            .then(rows => {
                //console.log(rows)
                return done(null,rows);
            })
            .catch(e => {
                console.log(e)
            })
    }));
};