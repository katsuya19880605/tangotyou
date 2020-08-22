var express = require('express');
var router = express.Router();
var fs = require('fs'); //追加

/* GET home page. */
router.get('/', function (req, res, next) {
  if (req.session.loginID != undefined){
    let file = [];  
    let fileNameArray = [];
    let fileName = fs.readdirSync("public/csv"); //パス直下のファイルやディレクトリ名全てが文字列の配列で返ってくる
    for(let i in fileName){
      var cut_str = '_';
      var index   = fileName[i].indexOf(cut_str); //'_'が含まれるファイル名を検索
      //先頭の文字を切り出してセッションIDと照合
      if (req.session.loginID == fileName[i].substr(0,index) ){
        file.push(fileName[i]);
        fileNameArray.push(fileName[i].slice(index + 1)); //該当したファイル名を配列に追加
      }    
    };

      let opt = {
        fname_cnt: '',
        cnt_data: '',
        quantity: '',
        at_data:'',
        file: file,
        fileName: fileNameArray
      };
        
      res.render('personal',opt);

  }else{
    res.redirect('/');
  }
  
});






router.post('/',function(req, res, next){
  if (req.session.loginID != undefined){
    let file = [];  
    let fileNameArray = [];
    let fileName = fs.readdirSync("public/csv"); //パス直下のファイルやディレクトリ名全てが文字列の配列で返ってくる
    for(let i in fileName){
      var cut_str = '_';
      var index   = fileName[i].indexOf(cut_str); //'_'が含まれるファイル名を検索
      //先頭の文字を切り出してセッションIDと照合
      if (req.session.loginID == fileName[i].substr(0,index) ){
        file.push(fileName[i]);
        fileNameArray.push(fileName[i].slice(index + 1)); //該当したファイル名を配列に追加
      }    
    };

        

        //*****ファイルを書き込む******************
        let fname_cnt = req.body.fname_cnt;
        let O_Data = req.body.O_Data;
    
        console.log("fname_cnt＝"+fname_cnt);
        fs.writeFile('public/csv/'+file[fname_cnt] , O_Data , (err) => {
          if (err) {
              console.log("エラーが発生しました。" + err);
              throw err
          }else {
              console.log("ファイルが正常に書き出しされました");
            }
        });


      //*****データをejsに戻す******************
      let now_cnt =Number(req.body.now_cnt);
      let quantity =Number(req.body.quantity);
      let str =req.body.S_Data;
      let tmp = str.split("\n");
      let S_Array = [];
      for (let i = 0; i < tmp.length; ++i) {
        tmp[i] = tmp[i].replace(/\r/g, '\\n');
        S_Array[i] = tmp[i].split(',');
      }


      let S_str = '';
      S_Array.forEach(function(rowvals) {
          let row = rowvals.join(",");
          S_str  += row;
      });
    
     

      let opt = {
        fname_cnt: fname_cnt,
        cnt_data: now_cnt,
        quantity: quantity,
        at_data: S_str,
        file: file,
        fileName: fileNameArray
      };
        
      res.render('personal',opt);

      
 }else{  //セッションIDなければトップにリダイレクト
 res.redirect('/');
 }

});

module.exports = router;
