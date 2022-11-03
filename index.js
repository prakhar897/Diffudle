var express = require("express");
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var dotenv = require('dotenv');
var User = require('./models/user');
var Question = require('./models/question');
const FirestoreClient = require('./FirestoreClient');

var TOTAL_QUESTIONS = 3;


dotenv.config();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));



var url = process.env.DATABASEURL;
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });



app.get('/', function (req, res) {

    let now = new Date().toLocaleDateString();

    await FirestoreClient.save('users', abc);


    User.findOne({
        IPAddress: req.ip
    }, function (err, user) {

        if (!user) {
            let newUser = new User({
                IPAddress: req.ip,
                CurrentVisiblePositions: [],
                AttemptNumber: {},
                Success: {}
            });
            
            let abc = {
                IPAddress: req.ip,
                CurrentVisiblePositions: [],
                AttemptNumber: {},
                Success: {},
                Id: req.ip
            };

            newUser.AttemptNumber.set(now, 1);
            newUser.Success.set(now, false);

            User.create(newUser);
            
            user = newUser;
        }

        if (user.AttemptNumber.get(now) == null) {
            user.AttemptNumber.set(now, 1);
            user.Success.set(now, false);
            user.save();
        }


        
        
        

        Question.findOne({
            date: now,
            attemptNumber: user.AttemptNumber.get(now) % TOTAL_QUESTIONS
        }, function (err, question) {
            console.log(question);
            res.render('index', { stats: user.stats, currentVisiblePosition: user.CurrentVisiblePositions, question: question });
        })


    });
});

app.post('/', function (req, res) {
    let now = new Date().toLocaleDateString();
    User.findOne({
        IPAddress: req.ip,
    }, function (err, user) {

        Question.findOne({
            date: now,
            attemptNumber: user.AttemptNumber.get(now) % TOTAL_QUESTIONS
        }, function (err, question) {

            let newVisiblePositions = [];
            for (var i = 0; i < question.name.length; i++) {
                if (question.name[i].toLowerCase() == req.body.guessedPrompt[i].toLowerCase()) {
                    newVisiblePositions.push(i);
                }
            }

            user.CurrentVisiblePositions = newVisiblePositions;
            
            if (newVisiblePositions.length == question.name.length) {
                user.Success.set(now, true);
            } else {
                user.AttemptNumber.set(now, Number(user.AttemptNumber.get(now)) + 1);
            }

            user.save(function (err, resuult){
                res.redirect("/");
            });
            
        })
    });



});




app.listen(process.env.PORT, function (req, res) {
    console.log(`Listening on port ${process.env.PORT}`);
});