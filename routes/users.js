let express = require('express');
let router = express.Router();
let crypto = require('crypto')

//mysql
const mysql = require('nodejs-mysql').default;
let dbConfig = require('../config/db');
const db = mysql.getInstance(dbConfig.mysql);
let userSql = {
    login: 'select * from user where userName = ?',
}

/* GET users listing. */

//加密函数
function md5(pwd) {
    let MD5 = crypto.createHash('md5');
    let pass = MD5.update(pwd).digest('base64');
    return pass;
}
router.get('/', function (req, res, next) {
    console.log(req.cookies)
    let user = req.query.user,
        pwd = md5(md5(req.query.pwd).substr(2,5)) + md5(req.query.pwd);//加密后的文字
    //加密
    db.exec(userSql.login, [user])
        .then(rows => {
            if (rows.length != 1) {
                res.send('用户不存在');//用户不存在
            } else if (rows[0].pwd != pwd) {
                res.send('密码错误');//密码错误
            } else {
                req.session.user = user;
                res.header("Access-Control-Allow-Origin", "http://localhost:8080");
                res.cookie("isLogin", true,{maxAge: 1000 * 60 * 60 * 24 * 7, httpOnly: true});
                res.cookie('user', user, {maxAge: 1000 * 60 * 60 * 24 * 7, httpOnly: true});
                console.log(req.session)
                console.log(req.cookies)
                res.send(rows[0].userID.toString());//登录成功
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
router.get('/index', function (req, res, next) {
    console.log('req.cookies')
    console.log(req.cookies)
    console.log('req.session---')
    console.log(req.session)
    if (req.cookies.czyBlog == '') {
        console.log(1111)
    } else {
        console.log(222)
    }
    res.send(req.cookies)
});

router.get('/insert', function (req, res, next) {
    console.log(req.data)
    res.send('1')
});

module.exports = router;
