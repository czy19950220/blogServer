const path = require('path');
const fs = require('fs');
/**
 * 同步递归创建路径
 *
 * @param  {string} dir   处理的路径
 * @param  {function} cb  回调函数
 */
let dirExists = function(dir, cb) {
    let pathinfo = path.parse(dir)
    console.log(dir)
    console.log(pathinfo.dir)
    if (!fs.existsSync(pathinfo.dir)) {
        dirExists(pathinfo.dir,function() {
            fs.mkdirSync(pathinfo.dir)
        })
    }
    cb && cb()
}

dirExists(path.join(__dirname, 'demo/test2/123/2/3/1/1/'))
module.exports = dirExists;