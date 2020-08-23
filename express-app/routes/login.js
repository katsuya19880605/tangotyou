var express = require('express');
var router = express.Router();
var mysql =require('mysql');  //追加


//MySQLの設定情報 MAMP用
var mysql_setting = {
    host : 'localhost',
    user : 'tangouser',
    password : 'tangopw',
    port : 3306,
    database: 'tango'
};

// var mysql_setting = {
//     host : 'us-cdbr-east-02.cleardb.com',
//     user : 'bfed9e31c6ea20',
//     password : 'd48043a8',
//     //port : 8889,
//     database: 'heroku_8359ae4e95655d7'
// };

//HEROKU用
// var mysql_setting = {
//     host : 'us-cdbr-east-02.cleardb.com',
//     user: "bc6ad563b3e02b",
//     password: "cd98ab61",
//     database: "heroku_568920a38321ad7"
// };



//GETのアクセス処理
router.get('/',(req, res, next) => {

    let opt ={
        message: ''
    };
    res.render('./login.ejs', opt);
})

//POSTのアクセス処理
router.post('/',(req, res, next) => {

     //コネクションの用意
     var connection = mysql.createConnection(mysql_setting);
     //データベースに接続
     connection.connect();
     //データを取り出す
     let sql = "select * from user where mailadd=? and password=?";
     let dt = [req.body.mailadd, req.body.password];

     connection.query(sql, dt,function(error, results, fields){

             //データベースアクセス完了時の処理
             if(error == null) {
                if(results.length != 0){
                    let loginID=results[0].id;
                    //IDをセッションのデータに入れる
                    req.session.loginID=loginID;
                    res.redirect('/personal');
                    
                }else{
                    var data ={
                        message: 'メールアドレスとパスワードが<br>一致しません。'
                    };
                    console.log("NG"+data);
                    res.render('login.ejs', data);
                }
            }
         });
         //接続を解除
         connection.end();
})

module.exports = router;
