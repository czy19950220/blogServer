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

let http = require('http');
let iconv = require('iconv-lite');//转码
let request = require('request');
let cheerio = require('cheerio');//DOM


router.post('/search', (req, res) => {
    let searchText = req.body.searchText;
    let url = 'http://m.b5200.net/modules/article/waps.php?keyword=' + encodeURI(searchText);
    request.get({url: url, encoding: null}, function (err, response, body) {
        let buf = iconv.decode(body, 'gbk');
        let $ = cheerio.load(buf);
        //console.log($('.line a').text());
        //console.log($('html').html());
        let arr = [],
            arr2 = [],
            result1 = [],
            result2 = [];
        $('.line a').each(function (index, el) {
            //console.log($(this).text())
            arr.push($(this).attr('href'))
            arr2.push($(this).text())
        });
        for(let i=0;i<arr.length;i+=3){
            result1.push(arr.slice(i,i+3));
            result2.push(arr2.slice(i,i+3));
        }
        res.json({
            data: result1,
            data2: result2
        })
    });

});

module.exports = router;
