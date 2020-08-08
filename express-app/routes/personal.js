var express = require('express');
var router = express.Router();
var fs = require('fs'); //追加

/* GET home page. */
router.get('/', function (req, res, next) {
  if (req.session.loginID != undefined){
    let file = [];  
    let fileName = fs.readdirSync("public/csv"); //パス直下のファイルやディレクトリ名全てが文字列の配列で返ってくる
    for(let i in fileName){
      var cut_str = '_';
      var index   = fileName[i].indexOf(cut_str); //'_'が含まれるファイル名を検索
      //先頭の文字を切り出してセッションIDと照合
      if (req.session.loginID == fileName[i].substr(0,index) ){
         file.push(fileName[i].slice(index + 1)); //該当したファイル名を配列に追加
      }    
    };
      let opt = {
        data: req.session.loginID,
        file: file
      };
        
      res.render('personal',opt);

  }else{
    res.redirect('/');
  }
  
});

module.exports = router;
