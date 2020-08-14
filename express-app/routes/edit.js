var express = require('express');
var router = express.Router();
var fs = require('fs');
const path = require('path');



router.get('/',function(req, res, next){
    //セッションIDの有無をチェック
    if (req.session.loginID != undefined){
        
        let file = [];
        let fileNameArray = [];
        let fileName = fs.readdirSync("public/csv"); //パス直下のファイルやディレクトリ名全てが文字列の配列で返ってくる
        for(let i in fileName){
            var cut_str = '_';
            var index   = fileName[i].indexOf(cut_str); //'_'が含まれるファイル名を検索
            //先頭の文字を切り出してセッションIDと照合
            if (req.session.loginID == fileName[i].substr(0,index) ){
                file.push(fileName[i]); //該当したファイル名を配列に追加
                fileNameArray.push(fileName[i].slice(index + 1)); //ファイル名からIDを除いて配列に追加
            }    
        };
        
        let opt = {
            msg:'',
            file: file,
            fileName: fileNameArray
        };
        res.render('edit',opt);
    
    }else{  //セッションIDなければトップにリダイレクト
    res.redirect('/');
    }
});


router.post('/',function(req, res, next){


     //セッションIDの有無をチェック
     if (req.session.loginID != undefined){
        
            let data = req.body.data;
            let name = req.body.name;
            let key = req.session.loginID+'_';
        
            // ファイル名にid_が含まれるかチェック
            if(name.match(key) != null){
                console.log("編集");
                 //*****ファイルを書き込む******************
                fs.writeFile('public/csv/'+name , data , (err) => {
                    if (err) {
                        console.log("エラーが発生しました。" + err)
                        throw err
                    }else {
                        console.log("ファイルが正常に書き出しされました")
                    }
                    res.redirect('personal');
                });
        
            }else{
                let upName = path.basename(name); //ファイル名を取り出す
                let upName2=upName.replace(/C:\\fakepath\\/g ,""); //C:\\fakepath\\を除去
                let upName3= key+upName2; //idを先頭に追加
                console.log("アップロード"+upName3);
        
                 //*****ファイルを書き込む******************
                fs.writeFile('public/csv/'+upName3 , data , (err) => {
                    if (err) {
                        console.log("エラーが発生しました。" + err);
                        throw err
                    }else {
                        console.log("ファイルが正常に書き出しされました");

                        //ファイル名の検索処理
                        let file = [];
                        let fileNameArray = [];
                        //パス直下のファイルやディレクトリ名全てが文字列の配列で返ってくる
                        let fileName = fs.readdirSync("public/csv"); 
                        for(let i in fileName){
                            var cut_str = '_';
                            var index   = fileName[i].indexOf(cut_str); //'_'が含まれるファイル名を検索
                            //先頭の文字を切り出してセッションIDと照合
                            if (req.session.loginID == fileName[i].substr(0,index) ){
                                file.push(fileName[i]); //該当したファイル名を配列に追加
                                fileNameArray.push(fileName[i].slice(index + 1)); //ファイル名からIDを除いて配列に追加
                            }    
                        };
        
                        let opt = {
                            msg:'アップロード成功！',
                            file: file,
                            fileName: fileNameArray
                        };
                        res.render('edit',opt);
                        
                    }
                });
            };





    
    }else{  //セッションIDなければトップにリダイレクト
    res.redirect('/');
    }
    
});
module.exports = router;