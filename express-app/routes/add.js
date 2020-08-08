var express = require('express');
var router = express.Router();
var mysql =require('mysql');  //追加



//GET処理
router.get('/',function(req, res, next){
    var email =req.query.email;

    var msg = 'email：' + email;
    res.render('add', 
    {
        title: 'アカウントを作成しました。',
        message:msg
    });
});

module.exports = router;
