var express = require("express");
var	app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var dotenv = require('dotenv');


dotenv.config();
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine","ejs");
app.use(express.static(__dirname+ "/public"));


//var url = process.env.DATABASEURL;
//mongoose.connect(url,{ useNewUrlParser: true, useUnifiedTopology: true });



app.get('/', function (req, res) {
  res.render('index' , {title: "Saas App"});
});


app.listen(process.env.PORT,function(req,res){
	console.log(`Listening on port ${process.env.PORT}`);
});