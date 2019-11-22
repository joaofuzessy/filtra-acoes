const express = require('express');
const app = express();
const path = require('path');
const router = express.Router();

router.get('/',function(req,res){
    res.sendFile(path.join(__dirname+'/index.html'));
  });

  router.get(['/index.html', '/'],function(req,res){
    res.sendFile(path.join(__dirname+'/index.html'));
  });

router.get(['/sobre', '/sobre.html'],function(req,res){
res.sendFile(path.join(__dirname+'/sobre.html'));
});

app.use("/css", express.static(__dirname + '/css'));
app.use("/javascript", express.static(__dirname + '/javascript'));
app.use("/assets", express.static(__dirname + '/assets'));


app.use('/', router);
app.listen(8080, function () {
  console.log('Filtra Ações rodando na porta 8080!')
})