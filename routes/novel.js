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

//搜索
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
        for (let i = 0; i < arr.length; i += 3) {
            result1.push(arr.slice(i, i + 3));
            result2.push(arr2.slice(i, i + 3));
        }
        res.json({
            data: result1,
            data2: result2
        })
    });

});
//详情
router.post('/detail', (req, res) => {
    let novelUrl = req.body.novelUrl;

    let url = 'http://m.b5200.net' + novelUrl;
    request.get({url: url, encoding: null}, function (err, response, body) {
        let buf = iconv.decode(body, 'gbk');
        let $ = cheerio.load(buf);
        let arr = [],
            arr2 = [];
        //书籍状态
        $('.block p').each(function (index, el) {
            arr.push($(this).text())
        });
        $('.block_txt2 a').each(function (index, el) {
            //console.log($(this).text())
            arr2.push($(this).attr('href'))
        });
        let result = arr.filter((i, v) => i != '');
        let block = {
            novelName: [$('.block h2').text(), arr2[0]],
            author: [result[0], arr2[2]],
            classify: [result[1], arr2[3]],
            state: result[2],
            update: result[3],
            newest: [result[4], arr2[4]]
        };
        //目录，下载
        let ablum_read = [];
        let ablum_read_url = [];
        $('.ablum_read span a').each(function (index, el) {
            ablum_read.push($(this).text())
            ablum_read_url.push($(this).attr('href'))
        });
        //简介
        let intro_info = $('.intro_info').text();
        //章节chapter
        let chapter = [], chapter_url = [];
        $('.chapter li a').each(function (index, el) {
            chapter.push($(this).text())
            chapter_url.push($(this).attr('href'))
        });
        if (err) {
            res.send('500')
        }
        res.json({
            coverSrc: $('.cover img').attr('src').toString(),
            block: block,
            ablum_read: [ablum_read, ablum_read_url],
            intro_info: intro_info,
            chapters: [chapter, chapter_url]
        })
    });

});
//阅读
router.post('/read', (req, res) => {
    let chapter = req.body.chapter;
    let url = 'http://m.b5200.net' + encodeURI(chapter);
    request.get({url: url, encoding: null}, function (err, response, body) {
        let buf = iconv.decode(body, 'gbk');
        let $ = cheerio.load(buf);
        let result1 = [];
        let result2 = [];
        let currentName = $('#content .title').text();
        $('.text p').each(function (index, el) {
            result1.push($(this).text())
        });
        $('.navigator-nobutton a').each(function (index, el) {
            result2.push($(this).attr('href'))
        });
        res.json({
            text: result1,
            navigator: result2,
            currentName:currentName
        })
    });
});
//目录
router.post('/chapters', (req, res) => {
    let chapter = req.body.chapter;
    let url = 'http://m.b5200.net' + chapter;
    request.get({url: url, encoding: null}, function (err, response, body) {
        let buf = iconv.decode(body, 'gbk');
        let $ = cheerio.load(buf);
        let result1 = [];
        let result2 = [];
        let result3 = [];
        $('.chapter li a').each(function (index, el) {
            result1.push($(this).text())
        });
        $('.chapter li a').each(function (index, el) {
            result2.push($(this).attr('href'))
        });
        $('.page a').each(function (index, el) {
            result3.push($(this).attr('href'))
        });
        res.json({
            chapters: result1,
            chapters_url: result2,
            chapters_max: result3
        })
    });
});
module.exports = router;
