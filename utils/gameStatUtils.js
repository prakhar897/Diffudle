const FirestoreClient = require('../clients/firestoreClient');
var GameStats = require('../models/gameStats');

module.exports = {
    async updateGameStats(date, attemptNumber, success){
        if(attemptNumber != 2 && success != true)
            return;

        let currentStats = await FirestoreClient.getCollection('gameStats', date);
        if(!currentStats)
            currentStats = new GameStats(0,0);
        newStats = currentStats;
        
        if (attemptNumber == 2){
            newStats.players += 1;
        } else if (success == true){
            newStats.winners += 1
        }
        
        FirestoreClient.save('gameStats', date, newStats);
    },

    getGameStats(date){
        let currentStats = FirestoreClient.getCollection('gameStats', date);
        if(!currentStats)
            currentStats = new GameStats(0,0);
        return currentStats;
    },

    calculateGameSolvingPercentage(stats){
        if(!stats || !stats.players || stats.players == 0)
            return 0;
        return Math.floor((stats.winners*100)/stats.players);
    }
}