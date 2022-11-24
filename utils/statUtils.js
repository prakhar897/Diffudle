module.exports = {
    calculateSummaryStats(attemptNumber, success) {

        let played = 0;
        for (var attemptDate in attemptNumber){
            if(attemptNumber[attemptDate] > 1 || success[attemptDate] == true)
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

        let winPercentage = 0;
        if(played > 0)
            winPercentage = Math.round((win*100)/played);
            
        let summaryStats = {
            Played: played,
            WinPercentage: winPercentage,
            latestStreak: latestStreak,
            maxStreak: maxStreak,
            winDistribution: winDistribution
        };

        return summaryStats;
    },

    shareTwitterLink(currentVisiblePositions, name, date){

        var greenTile = "🟩";
        var blackTile = "⬛";
        

        var result = "";

        for(var i=0;i<name.length;i++){
            if(name[i] == "/" ){
                result += "/";
            } else if(currentVisiblePositions.includes(i)){
                result += greenTile;
            } else {
                result += blackTile;
            }
        }

        var twitterDate = date.replace("-","").replace("-","");
        var begin = "https://twitter.com/intent/tweet?";
        var text= "text=" + result + "%0a%0a";
        var hashtags="&hashtags=Diffudle,Diffudle_"+twitterDate;
        var twitterlink = begin+text+hashtags;
        return twitterlink;
    }
};
