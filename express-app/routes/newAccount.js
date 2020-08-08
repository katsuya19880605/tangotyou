var express = require('express');
var router = express.Router();
var mysql = require('mysql'); //追加
const fs = require('fs'); //filesystem モジュールを使用する
const { check, validationResult } = require('express-validator/check')


//MySQLの設定情報
// var mysql_setting = {
//     host: 'localhost',
//     user: 'tangouser',
//     password: 'tangopw',
//     port: 3306,
//     database: 'tango'
// };
var mysql_setting = {
    host : 'us-cdbr-east-02.cleardb.com',
    user : 'bfed9e31c6ea20',
    password : 'd48043a8',
    //port : 8889,
    database: 'heroku_8359ae4e95655d7'
};

//GETのアクセス処理
router.get('/', (req, res, next) => {
    let data = {
        content: '',
        form: {
            mailadd: '',
            password: '',
        },
        errorMessage: ''
    }
    res.render('newAccount.ejs', data);
})



// POSTのアクセス処理
router.post('/',  
    //ルール
    [
        check('email')
        .isEmail().withMessage('メールアドレスを入力して下さい'),

        check('password')
        .isLength({ min: 4 }).withMessage('パスワードは4文字以上です')
        .matches(/\d/).withMessage('パスワードに数値を含めて下さい'),

        check('password')
        .custom((value, { req }) => {
            if(req.body.password !== req.body.password2) {
            throw new Error('パスワード（確認）と一致しません');
        } return true;})

    ], (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {

        const errors_array = errors.array()

        res.render('./newAccount.ejs', {
            content: '',
            form: {
                email: req.body.email,
                password: req.body.password,
            },
            errorMessage: errors_array
        })


    } else {    //エラーない時

       
        //コネクションの用意
        var connection = mysql.createConnection(mysql_setting);
        //データベースに接続
        connection.connect();
        let sql0 = "select * from user where mailadd=?";
        let sql1 = "insert into user set mailadd=?, password=?";
        let sql2 = "select * from user where mailadd=? and password=?";
        let dt1 = [req.body.email];
        let dt2 = [req.body.email, req.body.password];
        
        let judg = -1;
        //DB登録されたレコードのidを取得

        //1回目：DBのメールアドレスかパスワードが該当した場合エラー
        connection.query(sql0, dt1, function (error, results, fields) {
            if (results != "") {
                judg = 0;
                console.log("judg1:"+judg+ " results:" + results[0]);
                let data = {
                    content: '入力されたメールアドレスは既に登録されています。',
                    form: {
                        mailadd: '',
                        password: ''
                    },
                    errorMessage: ''
                }
                res.render('newAccount.ejs', data);
            
            } else {
                judg = 1;
                console.log("judg1:"+judg+ " results:" + results[0]);
            }
            

            if(judg ==1){

                //2回目：SQL 該当なければ新規アカウント追加
                connection.query(sql1, dt2, function (error, results, fields) {
                    //データベースアクセス完了時の処理
                    if (error == null) {
                        console.log('insert success!');
                    }else{
                        console.log('insert error!');
                    };
                });

                //3回目：SQL DBに追加されたレコードのidを取得
                connection.query(sql2, dt2, function (error, results, fields) {
                    if (results.length != 0) {
                        //idをファイル名に追加
                        let NewFileName = 'public/csv/' + results[0].id + '_tango.csv';
                        console.log('NewFileName=' + NewFileName)

                        fs.copyFile('public/csv/tango.csv', NewFileName, (err) => {
                            if (err) {
                                console.log("エラーが発生しました。" + err)
                                throw err
                            }else {
                                console.log("ファイルをコピーしました。")
                            }
                        });
    
                        res.redirect('/add?email=' +
                            req.body.email);
                    }
                });
                //接続を解除
                connection.end();
            }
        });
    }
});
module.exports = router;