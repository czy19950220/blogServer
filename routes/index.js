var express = require('express');
var router = express.Router();
// 导入MySQL模块
let mysql = require('mysql');
let dbConfig = require('../config/db');
let userSQL = require('../config/mysql');
// 使用DBConfig.js的配置信息创建一个MySQL连接池
let pool = mysql.createPool(dbConfig.mysql);
/* GET home page. */
router.get('/', function(req, res, next) {
    let userIP = req.ip.match(/\d+\.\d+\.\d+\.\d+/)[0];
    pool.getConnection(function (err, connection) {
        connection.query(userSQL.insertIP, (userIP), function (err, result) {
            if (err) {
                //res.send(500);
                console.log(err);
                connection.release();
                res.render('index', { title: err });
            }else {
                connection.release();
                res.render('index', { title: '请检查路径' });
            }
        })
    });

});

module.exports = router;
