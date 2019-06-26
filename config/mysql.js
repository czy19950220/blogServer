// var mysql = require('mysql');
// var config = require('./d;b')
let UserSQL = {
    login: 'SELECT * FROM user WHERE user_name = ? ',
    register: 'INSERT INTO user(user_name,password) VALUES (?,?)',
    getHtml: 'SELECT * FROM blog WHERE blogID = ? ',
    updateHtml: 'UPDATE blog SET blogContent=?,blogName=?,text=? where blogID=?',
    insertHtml: 'INSERT INTO blog(blogContent,blogName,uid,date,text) VALUES (?,?,?,?,?)',
    getBlogs: 'SELECT * FROM blog WHERE uid = ? ',
    deleteBlog: 'DELETE FROM blog WHERE blogID = ? ',

    insert: 'INSERT INTO user(id,name,age) VALUES (?,?,?)',
    queryAll: 'SELECT * FROM mom_newborn  where flag=0 order by BornDate desc',
    getUserById: 'SELECT * FROM user WHERE id = ? ',
    updateUser: 'UPDATE user SET name = ?,age = ? WHERE id = ? ',
    apgarlist: 'SELECT * FROM apgar ',
    score: 'SELECT * FROM newborn_score where userna',
    updateborn: 'UPDATE newborn SET ApgarCode=?,BornDate=?,NewBornCode=?,Sex=?,TimeGo=? where NewBorn_id=?',
    updatemom: 'UPDATE mom SET AreaCode=?,Delivery=?,Name=?,Weight=? where MomCode=?',
    deletebasic: 'UPDATE newborn set flag=1 where NewBorn_id=?',
    password: 'UPDATE users set PassWord=? where UserName=?',
    like: 'SELECT * FROM mom_newborn WHERE ApgarCode LIKE %?% or NewBornCode like %?% or Sex like %?% or Name like %?% or Weight like %?%',
    addnewbornbasic: 'INSERT INTO newborn(NewBorn_id,NewBornCode,ApgarCode,MomCode,Sex,BornDate,TimeGo) VALUES (?,?,?,?,?,?,?)',
    addmombasic: 'INSERT INTO mom(MomCode,Name,AreaCode,Weight,Delivery) VALUES (?,?,?,?,?)',
    selectmom: 'SELECT * FROM mom where MomCode=?',
    selectapgar: 'SELECT ApgarCode FROM userbindapgar where UserCode=?'
}
module.exports = UserSQL
