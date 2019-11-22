const express = require('express');
const app = express();
const path = require('path');
const router = express.Router();

router.get('/',function(req,res){
    res.sendFile(path.join(__dirname+'/index.html'));
  });

app.use(express.static(__dirname + '/javascript'));
app.use(express.static(__dirname + '/css'));
app.use(express.static(__dirname + '/assets'));

app.use('/', router);
app.listen(8000, function () {
  console.log('Example app listening on port 8000!')
})