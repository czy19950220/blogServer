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
let FroalaEditor = require('../node_modules/wysiwyg-editor-node-sdk/lib/froalaEditor.js');
let serverIP = 'http://118.25.73.39:3003';
//let serverIP = 'http://47.103.42.176:11365';
let serverIP2 = 'http://localhost:3003';


/**
 * 同步递归创建路径
 * @param  {string} dir   处理的路径
 * @param  {function} cb  回调函数
 */
function dirExists(dir, cb) {
    let pathinfo = path.parse(dir)
    if (!fs.existsSync(pathinfo.dir)) {
        console.log(!fs.existsSync(pathinfo.dir))
        dirExists(pathinfo.dir, function () {
            fs.mkdirSync(pathinfo.dir)
        })
    }
    cb && cb()
}

//froala-editor img
//如果想要在自己的电脑上跑后台，需要修改后台代码的froala.js 里的‘http://192.168.100.135:3003’，将其修改为自己的地
router.post('/upload_images/', (req, res) => {
    dirExists(path.join(__dirname, `/${req.query.id}/images/${req.query.id}`), () => {
        FroalaEditor.Image.upload(req, `../routes/${req.query.id}/images/`, function (err, data) {
            // Return data.
            if (err) {
                console.log(err)
                return res.send(JSON.stringify(err));
            }
            //console.log(data)
            //data.link='http://192.168.100.135:3003'+data.link.replace("..","");
            data.link = serverIP + data.link.replace("..", "");

            res.send(data);
        });
    })

});
router.route('/deleteImage').post(function (req, res) {
    //console.log(req.body.src)
    /*dirExists(path.join(__dirname, `/${req.query.id}/images/${req.query.id}`),()=>{*/
    FroalaEditor.Image.delete(req.body.src.replace(`${serverIP}/`, ""), function (err) {
        if (err) {
            console.log(err)
            return res.status(404).end(JSON.stringify(err));
        }
        return res.end();
    });
    /*})*/
});
router.route('/listpic').get((req, res) => {
    dirExists(path.join(__dirname, `/${req.query.id}/images/${req.query.id}`), () => {
        FroalaEditor.Image.list(`../routes/${req.query.id}/images/`, function (err, data) {
            if (err) {
                return res.status(404).end(JSON.stringify(err));
            }
            for (let i = 0; i < data.length; i++) {
                data[i].thumb = serverIP + `/routes/${req.query.id}/images/` + data[i].tag;
                data[i].url = serverIP + `/routes/${req.query.id}/images/` + data[i].tag;
                //http://czy-15736873451.club:11365/public/images/4af5894cd3871f628b15e4bec9bab9d1f10562b6.png
                console.log(data[i].url)
            }
            return res.send(data);
        });
    })
})
//froala-editor files
//大致操作同上，但是如果想要修改可以提交的文件类型，需要修改源代码在node_modules里找到该插件下的file.js进行修改，讲validation给注释掉即可
router.route('/uploadfile').post((req, res) => {
    // Store file.
    //console.log(req)
    dirExists(path.join(__dirname, `/${req.query.id}/uploadfiles/${req.query.id}`), () => {
        FroalaEditor.File.upload(req, `../routes/${req.query.id}/uploadfiles/${req.query.id}`, function (err, data) {
            // Return data.
            if (err) {
                console.log(err)
                return res.send(JSON.stringify(err));
            }
            data.link = serverIP + data.link.replace("..", "");
            res.send(data);
        });
    })
})
router.route('/uploadvideo').post((req, res) => {
    // Store file.
    //console.log(req)
    dirExists(path.join(__dirname, `/${req.query.id}/uploadfiles/${req.query.id}`), () => {
        FroalaEditor.File.upload(req, `../routes/${req.query.id}/uploadfiles/${req.query.id}`, function (err, data) {
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

})
//froala-editor 重新加载HTML代码
router.route('/getHtml').post((req, res) => {
    pool.getConnection(function (err, connection) {
        let blogID = req.query.blogID || 1;
        console.log(blogID)
        connection.query(userSQL.getHtml, blogID, function (err, result) {
            //console.log(result)
            if (err) {
                res.send(500);
                console.log(err);
            }
            //console.log(result)
            if (result.length !== 1) {
                res.json({
                    result: {
                        code: -1,
                        getHtml: '<p>路径不正确,请检查，可以编写新文章</p>'
                    }
                })
            } else {
                res.json({
                    result: {
                        code: 1,
                        getHtml: result[0].blogContent,
                        blogName: result[0].blogName,
                        uid: result[0].uid,
                        text: result[0].text
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
        let titleName = req.body.titleName;
        let blogID = req.body.blogID;//数据库有没有该文章
        let uid = req.body.uid;//文章拥有人id
        let blogNameTag = req.body.blogNameTag;//文章标签
        connection.query(userSQL.getHtml, blogID, function (err, result) {
            if (err) {
                res.send(500);
                console.log(err);
            }
            if (result.length !== 1) {
                connection.query(userSQL.insertHtml, [gethtml, titleName, uid, new Date(), blogNameTag], function (err, result) {
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
            } else {
                connection.query(userSQL.updateHtml, [gethtml, titleName, blogNameTag, blogID], function (err, result) {
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
            }
        })
    })
})
//获取全部博客信息
router.route('/getBlogs').post((req, res) => {
    let uid = req.body.uid;
    pool.getConnection(function (err, connection) {
        connection.query(userSQL.getBlogs, uid, function (err, result) {
            if (err) {
                res.send(500);
                console.log(err);
            }
            if (result.length !== -1) {
                for (let i = 0; i < result.length; i++) {
                    delete(result[i].blogContent)
                }
                res.json({
                    code: 200,
                    result: result
                })
                connection.release();
            }else {
                res.send('-1')
                connection.release();
            }
        })
    })
})
//删除博客
router.route('/deleteBlog').post((req, res) => {
    let blogID = req.body.blogID;
    pool.getConnection(function (err, connection) {
        connection.query(userSQL.deleteBlog, blogID, function (err, result) {
            if (err) {
                res.send(500);
                console.log(err);
            }
            if (result.affectedRows == 1){
                res.send('200')
            }else {
                res.send('-1')
            }
            connection.release();
        })
    })
})
//修改博客信息
router.route('/updateBlog').post((req, res) => {
    let name = req.body.name;
    let text = req.body.text;
    let blogID = req.body.blogID;
    pool.getConnection(function (err, connection) {
        connection.query(userSQL.deleteBlog, blogID, function (err, result) {
            if (err) {
                res.send(500);
                console.log(err);
            }
            console.log(result)
            if (result.affectedRows == 1){
                res.send('200')
            }else {
                res.send('-1')
            }
            connection.release();
        })
    })
})
module.exports = router;
