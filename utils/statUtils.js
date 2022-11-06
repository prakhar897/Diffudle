module.exports = {
    calculateSummaryStats(attemptNumber, success) {

        let played = 0;
        for (var attemptDate in attemptNumber){
            if(attemptNumber[attemptDate] > 1)
                played++;
        }

        let win = 0;
        for(var attemptDate in success) {
            if(success[attemptDate] == true)
                win++;
        }

        let winPercentage = Math.round((win*100)/played);
        let summaryStats = {
            Played: played,
            WinPercentage: winPercentage,
        };

        return summaryStats;
    },
};
