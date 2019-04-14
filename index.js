
const cors = require('cors');

const dbconnection = require('./dbconnection');
var ObjectID = require('mongodb').ObjectID;
const express = require('express');
const app = express();


var bodyParser = require('body-parser'); 

app.use(cors());
var Scraper = require ('images-scraper')
  , google = new Scraper.Google();

const download = require('image-downloader');
const fs = require('fs');


app.use(bodyParser.json());
app.listen(3001,()=>console.log("server is runnig"));



function saveRcnSrch(key,val){ 
    var document = {
        keyword:key,
        url:val
    }
    console.log(document);
    dbconnection.db.collection('beforeSearch').insert(document, function(err, records) {
            if(err){ throw err
            }
    });
}

app.get('/',(re,res)=>{
    res.send("hello");
})



// to get all keywords
// app.get('/recent',(req,res)=>{
//     dbconnection.db.collection('beforeSearch').find().skip(0).limit(15).toArray(function(err,item){
// 			 if(item){
// 				 var resp = {
// 					data:item,
// 					message : 'Success',
// 					responseCode : 200
// 				  } 
//                   res.send(resp);
//                 }
//             }

// });
app.get('/recent',(req,res)=>{
    dbconnection.db.collection('beforeSearch').find().skip(0).limit(10).toArray((err,item)=>{
        if(item){
            var resp = {
                data:item,
                message:"Succes",
                responseCode:200
            }
            res.send(resp);
        }
    })
})



app.post('/imagesearch',(req,res)=>{
    google.list({
        keyword: req.body.tag,
        num: 10,
        detail: true,
        nightmare: {
            show: true
        }
    })
    .then(function (item) {
        //logic to download image
        const imageurls = [];
        for(var i=0;i<item.length;i++){
            var fNm  = '/img'+new Date().getTime()+''+i+'.jpg';
            const options = {
                url: item[i].url,
                dest: __dirname +'/public'+fNm   
              }
              imageurls.push(fNm);
              download.image(options).then(({filename,image})=>{
                  console.log('file saved to ', filename);
              }).catch((err)=>{
                  throw err;
              })
        }
        saveRcnSrch(req.body.tag,imageurls);
        res.send(item); 
    }).catch(function(err) {
        console.log('err', err);
    });

})


 