let express = require('express');
let router = express.Router();
// 导入MySQL模块
let mysql = require('mysql');
let dbConfig = require('../config/db');
let userSQL = require('../config/mysql');
// 使用DBConfig.js的配置信息创建一个MySQL连接池
let pool = mysql.createPool(dbConfig.mysql);
let FroalaEditor = require('../node_modules/wysiwyg-editor-node-sdk/lib/froalaEditor.js');
let serverIP = 'http://47.103.42.176:19680';
//let serverIP = 'http://47.103.42.176:11365';
let serverIP2 = 'http://localhost:3003';

//froala-editor img
//如果想要在自己的电脑上跑后台，需要修改后台代码的froala.js 里的‘http://192.168.100.135:3003’，将其修改为自己的地址

router.post('/upload_images/', (req, res) => {
    FroalaEditor.Image.upload(req, '../public/images/', function (err, data) {
        // Return data.
        if (err) {
            //console.log(err)
            return res.send(JSON.stringify(err));
        }
        //data.link='http://192.168.100.135:3003'+data.link.replace("..","");
        data.link = serverIP + data.link.replace("..", "");
        //console.log(data)
        res.send(data);
    });
});
router.route('/deleteImage').post(function (req, res) {
    //console.log(req.body.src)
    FroalaEditor.Image.delete(req.body.src.replace(`${serverIP}/`, ""), function (err) {
        if (err) {
            console.log(err)
            return res.status(404).end(JSON.stringify(err));
        }
        return res.end();
    });
});
router.route('/listpic').get((req, res) => {
    FroalaEditor.Image.list('../public/images/', function (err, data) {
        if (err) {
            return res.status(404).end(JSON.stringify(err));
        }
        for (let i = 0; i < data.length; i++) {
            data[i].thumb = serverIP+'/public/images/' + data[i].tag;
            data[i].url = serverIP+'/public/images/' + data[i].tag;
            //http://czy-15736873451.club:11365/public/images/4af5894cd3871f628b15e4bec9bab9d1f10562b6.png
            console.log(data[i].url)
        }
        return res.send(data);
    });
})
//froala-editor files
//大致操作同上，但是如果想要修改可以提交的文件类型，需要修改源代码在node_modules里找到该插件下的file.js进行修改，讲validation给注释掉即可
router.route('/uploadfile').post((req, res) => {
    // Store file.
    //console.log(req)
    FroalaEditor.File.upload(req, '../public/uploadfiles/', function (err, data) {
        // Return data.
        if (err) {
            console.log(err)
            return res.send(JSON.stringify(err));
        }
        data.link = serverIP + data.link.replace("..", "");
        res.send(data);
    });
})
router.route('/uploadvideo').post((req, res) => {
    // Store file.
    //console.log(req)
    FroalaEditor.File.upload(req, '../public/uploadfiles/', function (err, data) {
        // Return data.
        if (err) {
            console.log(err)
            return res.send(JSON.stringify(err));
        }
        data.link = serverIP + data.link.replace("..", "");
        console.log(data)
        res.send(data);
    });
})
//froala-editor 重新加载HTML代码
router.route('/getHtml').post((req, res) => {
    pool.getConnection(function (err, connection) {
        let blogID = req.body.blogID ||1;
        console.log(blogID)
        connection.query(userSQL.getHtml, blogID, function (err, result) {
            //console.log(result)
            if (err) {
                res.send(500);
                console.log(err);
            }
            if (result.length !== 1) {
                res.json({
                    result: {
                        code: -1,
                        getHtml: '<p>路径不正确,请检查</p>'
                    }
                })
            } else {
                res.json({
                    result: {
                        code: 1,
                        getHtml: result[0].blogContent,
                        blogName: result[0].blogName,
                        uid: result[0].uid
                    }
                })
            }
            connection.release();
        });
    })
})
//上传HTML
router.route('/uploadHtml').post((req, res) => {
    pool.getConnection(function (err, connection) {
        let gethtml = req.body.html;
        let titleName = req.body.titleName || 'diyi';
        let blogID = 1;//数据库有没有该文章
        let uid = req.body.uid || 1;//
        if (blogID) {//有
            connection.query(userSQL.updateHtml, [gethtml, titleName, blogID, uid], function (err, result) {
                //console.log(result)
                if (err) {
                    res.send(500);
                    console.log(err);
                }
                //console.log(gethtml)
                //console.log(getUrl)
                connection.release();
                res.send('1');
            });
        } else {//没有
            connection.query(userSQL.insertHtml, [gethtml, titleName], function (err, result) {
                //console.log(result)
                if (err) {
                    res.send(500);
                    console.log(err);
                }
                //console.log(gethtml)
                //console.log(getUrl)
                connection.release();
                res.send('2');
            });
        }
    })
})

module.exports = router;
