var express = require("express");
var app = express();
var bodyParser = require('body-parser');
const path = require('path')
var dotenv = require('dotenv');
var User = require('./models/user');
var Question = require('./models/question');

const FirestoreClient = require('./clients/firestoreClient');
const StatUtils = require('./utils/statUtils');

var TOTAL_QUESTIONS = 3;


dotenv.config({ path: path.resolve('../KeysManager/Diffudle/.env') });
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.set('trust proxy', true)



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
        user.currentVisiblePositions = [];
        await FirestoreClient.save('users', req.ip, user);
    }

    const questionRefId = now + "--" + user.attemptNumber[now];
    console.log(questionRefId);

    const question = await FirestoreClient.getCollection('questions', questionRefId);
    //console.log(question);

    const summaryStats = StatUtils.calculateSummaryStats(user.attemptNumber, user.success);
    res.render('index', {summaryStats: summaryStats, attemptNumber: user.attemptNumber[now],
         currentVisiblePosition: user.currentVisiblePositions, question: question, success: user.success[now] });
    
});

app.post('/', async function (req, res) {

    let now = new Date().toISOString().split('T')[0];
    const user = await FirestoreClient.getCollection('users', req.ip);
    const questionRefId = now + "--" + user.attemptNumber[now];
    const question = await FirestoreClient.getCollection('questions', questionRefId);

    let newVisiblePositions = [];
    for (var i = 0; i < question.name.length; i++) {
        if (user.currentVisiblePositions.includes(i) || question.name.toUpperCase()[i] == req.body.guessedPrompt[i]) {
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

app.post('/hint', async function( req , res) {

    let now = new Date().toISOString().split('T')[0];
    const user = await FirestoreClient.getCollection('users', req.ip);
    const questionRefId = now + "--" + user.attemptNumber[now];
    const question = await FirestoreClient.getCollection('questions', questionRefId);


    const canBeReveleadPostions = [];
    for(var i=0; i< question.name.length;i++){
        if(!user.currentVisiblePositions.includes(i) && question.name[i] != "/"){
            canBeReveleadPostions.push(i);
        }
    }

    const shuffledCanBeReveleadPostions = canBeReveleadPostions.sort(() => 0.5 - Math.random());
    const noOfPositonsRevelead = Math.ceil([...question.name].filter(x => !x.includes("/")).length/8);
    let revealingPositions = shuffledCanBeReveleadPostions.slice(0, noOfPositonsRevelead);

    var guessedPrompt = "";

    for(var i =0; i< question.name.length;i++){
        if(revealingPositions.includes(i)){
            guessedPrompt += question.name[i];
        } else {
            guessedPrompt += "-";
        }
    }

    let newVisiblePositions = [];
    for (var i = 0; i < question.name.length; i++) {
        if (user.currentVisiblePositions.includes(i) || question.name[i] == guessedPrompt[i]) {
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