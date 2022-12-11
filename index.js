var express = require("express");
var app = express();
var bodyParser = require('body-parser');
const path = require('path')
var dotenv = require('dotenv');
var cookieParser = require('cookie-parser');


var User = require('./models/user');
var Question = require('./models/question');

const FirestoreClient = require('./clients/firestoreClient');
const StatUtils = require('./utils/statUtils');
const AppUtils = require('./utils/appUtils');
const GameStatUtils = require("./utils/gameStatUtils");

dotenv.config({ path: path.resolve('../KeysManager/Diffudle/.env') });
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(cookieParser());

//TODO: Remove after moving to cookies
app.set('trust proxy', true)


app.get('/', async function (req, res) {
    try{
        
        let formattedDate = AppUtils.convertDateFormat(req.query.date, new Date());
        let user = req.cookies.userData;
        let gameStats = await GameStatUtils.getGameStats(formattedDate)
    

        if (!user) {
            let newUser = new User({}, {}, {});
            newUser.attemptNumberDateMap[formattedDate] = 1;
            newUser.successDateMap[formattedDate] = false;
            newUser.visiblePositionsDateMap[formattedDate] = [];
            res.cookie("userData", newUser);
            user = newUser;
        }

        if (user.attemptNumberDateMap[formattedDate] == null) {
            user.attemptNumberDateMap[formattedDate] = 1;
            user.successDateMap[formattedDate] = false;
            user.visiblePositionsDateMap[formattedDate] = [];
            res.cookie("userData", user);
        }
        

        const questionRefId = formattedDate + "--" + user.attemptNumberDateMap[formattedDate];
        const question = await FirestoreClient.getCollection('questions', questionRefId);

        const summaryStats = StatUtils.calculateSummaryStats(user.attemptNumberDateMap, user.successDateMap);
        const twitterLink = StatUtils.shareTwitterLink(user.visiblePositionsDateMap[formattedDate], question.name, formattedDate, user.attemptNumberDateMap[formattedDate]);
        const gameSolvingPercentage = GameStatUtils.calculateGameSolvingPercentage(gameStats);

        if(user.attemptNumberDateMap[formattedDate] == 7 || user.successDateMap[formattedDate] == true){
            let [question1, question2, question3, question4, question5, question6] = await Promise.all([
                FirestoreClient.getCollection('questions', formattedDate + "--1"),
                FirestoreClient.getCollection('questions', formattedDate + "--2"),
                FirestoreClient.getCollection('questions', formattedDate + "--3"),
                FirestoreClient.getCollection('questions', formattedDate + "--4"),
                FirestoreClient.getCollection('questions', formattedDate + "--5"),
                FirestoreClient.getCollection('questions', formattedDate + "--6")
            ]);
            

            res.render('finished', {summaryStats: summaryStats, attemptNumber: user.attemptNumberDateMap[formattedDate],
                currentVisiblePositions: user.visiblePositionsDateMap[formattedDate], question: question, success: user.successDateMap[formattedDate],
                name: question.name, twitterLink: twitterLink, gameSolvingPercentage: gameSolvingPercentage,
                question1: question1, question2: question2, question3: question3, question4: question4, question5: question5, question6: question6, formattedDate: formattedDate });
        }
        else
            res.render('index', {summaryStats: summaryStats, attemptNumber: user.attemptNumberDateMap[formattedDate],
                currentVisiblePositions: user.visiblePositionsDateMap[formattedDate], question: question, success: user.successDateMap[formattedDate],
                name: question.name, twitterLink: twitterLink, gameSolvingPercentage: gameSolvingPercentage, formattedDate: formattedDate });

    } catch (error) {
        let formattedDate = req.query.date || AppUtils.convertDateFormat(new Date());
        console.log("ERROR DATE:" + formattedDate);
        console.log("ERROR REQ:" + JSON.stringify(req.body));
        console.log("ERROR IP:" + JSON.stringify(req.ip));
        console.log("ERROR body:" + error);
        console.log("ERROR STACK TRACE: " + error.stack);
    }
});

app.post('/', async function (req, res) {
    try{
        let formattedDate =  AppUtils.convertDateFormat(req.query.date, new Date());
        let user = req.cookies.userData;
        const questionRefId = formattedDate + "--" + user.attemptNumberDateMap[formattedDate];
        const question = await FirestoreClient.getCollection('questions', questionRefId);
        const guessedPrompt = req.body.guessedPrompt;

        let newVisiblePositions = [];
        for (var i = 0; i < question.name.length; i++) {
            if (user.visiblePositionsDateMap[formattedDate].includes(i) || question.name.toUpperCase()[i] == guessedPrompt.toUpperCase()[i]) {
                newVisiblePositions.push(i);
            }
        }

        user.visiblePositionsDateMap[formattedDate] = newVisiblePositions;
        
        if (newVisiblePositions.length == question.name.length) {
            user.successDateMap[formattedDate] =  true;
        } else {
            user.attemptNumberDateMap[formattedDate]++;
        }
        res.cookie("userData", user);
        console.log("Calling Update Stats. IP:" + req.ip + " AN:" + user.attemptNumberDateMap[formattedDate] + 
        " SUCCC: " + user.successDateMap[formattedDate] + " Date: " + formattedDate);
        GameStatUtils.updateGameStats(formattedDate, user.attemptNumberDateMap[formattedDate], user.successDateMap[formattedDate]);
        res.redirect("/?date="+formattedDate);

    } catch (error) {
        let formattedDate = req.query.date || AppUtils.convertDateFormat(new Date());
        console.log("ERROR DATE:" + formattedDate);
        console.log("ERROR REQ:" + JSON.stringify(req.body));
        console.log("ERROR IP:" + JSON.stringify(req.ip));
        console.log("ERROR body:" + error);
        console.log("ERROR STACK TRACE: " + error.stack);
    }

});

app.post('/hint', async function( req , res) {
    try{
        let formattedDate = AppUtils.convertDateFormat(req.query.date, new Date());
        let user = req.cookies.userData;
        console.log(JSON.stringify(user));
        const questionRefId = formattedDate + "--" + user.attemptNumberDateMap[formattedDate];
        const question = await FirestoreClient.getCollection('questions', questionRefId);


        const canBeReveleadPostions = [];
        for(var i=0; i< question.name.length;i++){
            if(!user.visiblePositionsDateMap[formattedDate].includes(i) && question.name[i] != "/"){
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
            if (user.visiblePositionsDateMap[formattedDate].includes(i) || question.name.toUpperCase()[i] == guessedPrompt.toUpperCase()[i]) {
                newVisiblePositions.push(i);
            }
        }

        user.visiblePositionsDateMap[formattedDate] = newVisiblePositions;
        
        if (newVisiblePositions.length == question.name.length) {
            user.successDateMap[formattedDate] =  true;
        } else {
            user.attemptNumberDateMap[formattedDate]++;
        }

        res.cookie("userData", user);
        console.log("Calling Update Stats. IP:" + req.ip + " AN:" + user.attemptNumberDateMap[formattedDate] + 
        " SUCCC: " + user.successDateMap[formattedDate] + " Date: " + formattedDate);
        GameStatUtils.updateGameStats(formattedDate, user.attemptNumberDateMap[formattedDate], user.successDateMap[formattedDate]);

        res.redirect("/?date="+formattedDate);
    } catch (error) {
        let formattedDate = req.query.date || AppUtils.convertDateFormat(new Date());
        console.log("ERROR DATE:" + formattedDate);
        console.log("ERROR REQ:" + JSON.stringify(req.body));
        console.log("ERROR IP:" + JSON.stringify(req.ip));
        console.log("ERROR body:" + error);
        console.log("ERROR STACK TRACE: " + error.stack);
    }

});

app.get("/archive",async function( req , res) {
    let user = await FirestoreClient.getCollection('users', req.ip);    
    const summaryStats = StatUtils.calculateSummaryStats(user.attemptNumberDateMap, user.successDateMap);
    res.render('archiveCalender',{summaryStats: summaryStats, success: false, attemptNumber: 1});
});

app.post("/archive",async function( req , res) {
    res.redirect("/?date="+req.query.date);
});

app.get('*', function(req, res){
    res.render('404');
  });

app.listen(process.env.PORT, function (req, res) {
    console.log(`Listening on port ${process.env.PORT}`);
});