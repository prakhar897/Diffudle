function calculateWinHistogram(winDistribution, totalWins) {

    winDistributionHistogram = [];
    for (let win of winDistribution) {
        if (win == 0) {
            winDistributionHistogram.push(0);
        } else {
            let value = Math.round((win * 8) / totalWins);
            winDistributionHistogram.push(value);
        }
    }
    return winDistributionHistogram;
}

function convertWinHistogramToSemanticNames(winHistogram) {
    const semanticColumnNames = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight'];
    let winHistogramNames = [];
    for(win of winHistogram){
        winHistogramNames.push(semanticColumnNames[win-1]);
    }
    return winHistogramNames;
}

module.exports = {
    calculateSummaryStats(attemptNumber, success) {

        let played = 0;
        for (var attemptDate in attemptNumber) {
            if (attemptNumber[attemptDate] > 1 || success[attemptDate] == true)
                played++;
        }

        let totalWins = 0;
        let winDistribution = [0, 0, 0, 0, 0, 0];
        var latestStreak = 0, maxStreak = 0;
        for (var attemptDate in success) {
            if (success[attemptDate] == true) {
                winDistribution[attemptNumber[attemptDate]-1]++;
                totalWins++;
                latestStreak++;
            } else if (latestStreak > maxStreak) {
                maxStreak = latestStreak;
                latestStreak = 0;
            } else {
                latestStreak = 0;
            }
        }

        if (latestStreak > maxStreak) {
            maxStreak = latestStreak;
        }

        let winPercentage = 0;
        if (played > 0)
            winPercentage = Math.round((totalWins * 100) / played);

        let winHistogram = calculateWinHistogram(winDistribution, totalWins);
        let winHistogramNames = convertWinHistogramToSemanticNames(winHistogram);

        let summaryStats = {
            played: played,
            winPercentage: winPercentage,
            latestStreak: latestStreak,
            maxStreak: maxStreak,
            winDistribution: winDistribution,
            winHistogramNames: winHistogramNames
        };

        return summaryStats;
    },

    shareTwitterLink(currentVisiblePositions, name, date, attempts) {

        var greenTile = "🟩";
        var blackTile = "⬛";
        var twitterDate = date.replace("-", "").replace("-", "");
        console.log(attempts);

        var firstLine = "Diffudle%20" + date;
        var secondLine = "Attempts:%20" + attempts + "/6"; 
        var result = "";

        for (var i = 0; i < name.length; i++) {
            if (name[i] == "/") {
                result += "/";
            } else if (currentVisiblePositions.includes(i)) {
                result += greenTile;
            } else {
                result += blackTile;
            }
        }
        
        var fourthLine = "PlayHere:%20https://diffudle.com";

        var begin = "https://twitter.com/intent/tweet?";
        var text = "text=" + firstLine + "%0a" + secondLine + "%0a" + result + "%0a%0a" + fourthLine + "%0a%0a";
        var hashtags = "&hashtags=Diffudle,Diffudle_" + twitterDate;
        var twitterlink = begin + text + hashtags;
        return twitterlink;
    }
};
