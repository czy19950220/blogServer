const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const passport = require('passport');

//mysql
const mysql = require('nodejs-mysql').default;
let dbConfig = require('../config/db');
const db = mysql.getInstance(dbConfig.mysql);
const sceret = dbConfig.sceret;
let userSql = {
    login: 'select * from user where userName = ?',
};

/* GET users listing. */

//加密函数
function md5(pwd) {
    let MD5 = crypto.createHash('md5');
    let pass = MD5.update(pwd).digest('base64');
    return pass;
}

router.post('/', function (req, res, next) {
    let user = req.body.username,
        pwd = md5(md5(req.body.password).substr(2, 5)) + md5(req.body.password);//加密后的文字
    //加密
    db.exec(userSql.login, [user])
        .then(rows => {
            if (rows.length != 1) {
                res.send('用户不存在');//用户不存在
            } else if (rows[0].pwd != pwd) {
                res.send('密码错误');//密码错误
            } else {
                //req.session.user = user;
                //jwToken.sign('规则','加密名字','过期时间','箭头函数');
                let rule = {name: user, id: rows[0].userID, identity: rows[0].identity};
                jwt.sign(rule, sceret, {expiresIn: '7d'}, (err, token) => {
                    if (err) throw err;
                    res.json({
                        success: true,
                        token: 'Bearer ' + token
                    })
                });
                //res.send(rows[0].userID.toString());//登录成功
            }
            // do sth. with result in rows
        })
        .catch(e => {
            res.send('err')
            // handle errors
        })
});
router.get('/logout', function (req, res, next) {
    req.session.destroy(function () {
        res.clearCookie("user", {});
        res.clearCookie("connect.sid", {});
        res.cookie("isLogin", "false");
        res.send('111');
    });
});
router.get('/token',
    passport.authenticate('jwt', {session: false}),
    (req, res) => {
        //console.log(req.user)
        res.json({
            userName: req.user[0].userName,
            userID: req.user[0].userID,
            identity: req.user[0].identity
        });
    });

router.get('/insert', function (req, res, next) {
    console.log(req.data);
    res.send('1');
});

module.exports = router;
