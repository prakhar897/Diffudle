var express = require("express");
var app = express();
var bodyParser = require('body-parser');
var dotenv = require('dotenv');
var User = require('./models/user');
var Question = require('./models/question');
const FirestoreClient = require('./clients/FirestoreClient');

var TOTAL_QUESTIONS = 3;


dotenv.config();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));



app.get('/', async function (req, res) {

    let now = new Date().toISOString().split('T')[0];
    let user = await FirestoreClient.getCollection('users', req.ip);

    if (!user) {
        let newUser = new User(req.ip, {},{}, []);
        newUser.attemptNumber[now] = 1;
        newUser.success[now] = false;
        await FirestoreClient.save('users',req.ip, newUser);
        user = newUser;
    }

    if (user.attemptNumber[now] == null) {
        user.attemptNumber[now] = 1;
        user.success[now] = false;
        await FirestoreClient.save('users', req.ip, user);
    }

    const questionRefId = now + "--" + user.attemptNumber[now];
    const question = await FirestoreClient.getCollection('questions', questionRefId);

    res.render('index', { currentVisiblePosition: user.currentVisiblePositions, question: question });
    
});

app.post('/', async function (req, res) {

    let now = new Date().toISOString().split('T')[0];

    const user = await FirestoreClient.getCollection('users', req.ip);

    const questionRefId = now + "--" + user.attemptNumber[now];
    const question = await FirestoreClient.getCollection('questions', questionRefId);

    let newVisiblePositions = [];
    for (var i = 0; i < question.name.length; i++) {
        if (question.name[i].toLowerCase() == req.body.guessedPrompt[i].toLowerCase()) {
            newVisiblePositions.push(i);
        }
    }

    user.currentVisiblePositions = newVisiblePositions;
    
    if (newVisiblePositions.length == question.name.length) {
        user.success[now] =  true;
    } else {
        user.attemptNumber[now]++;
    }

    await FirestoreClient.save('users', req.ip, user);
    res.redirect("/");

});




app.listen(process.env.PORT, function (req, res) {
    console.log(`Listening on port ${process.env.PORT}`);
});