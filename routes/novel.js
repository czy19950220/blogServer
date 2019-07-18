let express = require('express');
let router = express.Router();
let path = require('path');
let fs = require('fs');
// 导入MySQL模块
let mysql = require('mysql');
let dbConfig = require('../config/db');
let userSQL = require('../config/mysql');
// 使用DBConfig.js的配置信息创建一个MySQL连接池
let pool = mysql.createPool(dbConfig.mysql);
let serverIP = 'http://118.25.73.39:3003';
let axios = require('axios');

router.post('/search', (req, res) => {
    let url = 'http://m.b5200.net/modules/article/waps.php?keyword=%E4%B8%80%E5%93%81%E9%81%93%E9%97%A8';
    params = {};
    axios.defaults.headers.get['Content-Type'] = 'application/json;charse=gbk';

    axios({
        method: 'get',
        url: url,
        headers: {
            'Content-type': 'application/x-www-form-urlencoded;charse=gbk'
        }
    }).then((response) => {
        console.log(response.data);
        let reader = new FileReader();
        reader.readAsText(response.data, "GBK");
        reader.onload = function(e) {
            console.log(reader.result);
            res.json({
                result: reader.result
            })
        };
    }).catch((error) => {
            console.log(error);
        }
    );

});

module.exports = router;
