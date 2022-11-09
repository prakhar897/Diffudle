const e = require("express");

module.exports = {
    calculateSummaryStats(attemptNumber, success) {

        let played = 0;
        for (var attemptDate in attemptNumber){
            if(attemptNumber[attemptDate] > 1)
                played++;
        }

        let win = 0;
        let winDistribution = [0,0,0,0,0,0,0,0,0,0];
        var latestStreak = 0, maxStreak =0;
        for(var attemptDate in success) {
            if(success[attemptDate] == true){
                winDistribution[attemptNumber[attemptDate]]++;
                win++;
                latestStreak++;
            } else if(latestStreak > maxStreak){
                maxStreak = latestStreak;
                latestStreak = 0;
            } else {
                latestStreak = 0;
            }
        }

        if(latestStreak>maxStreak){
            maxStreak = latestStreak;
        }

        let winPercentage = Math.round((win*100)/played);
        let summaryStats = {
            Played: played,
            WinPercentage: winPercentage,
            latestStreak: latestStreak,
            maxStreak: maxStreak,
            winDistribution: winDistribution
        };

        return summaryStats;
    },
};
