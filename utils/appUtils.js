var User = require('../models/user');

module.exports = {
    convertDateFormat(queryDate, todayDate) {
        if(queryDate === undefined)
            return todayDate.toISOString().split('T')[0];
        return queryDate;
    },

    isQueryDateInPastOrPresent(queryDate,todayDate) {
        todayDate.setDate(todayDate.getDate() + 2);
        var todayDateFormatted = todayDate.toISOString().split('T')[0];
        if(queryDate<=todayDateFormatted)
            return true;
        else
            return false;
    },

    getUserData(user,formattedDate){
        if (!user) {
            let newUser = new User({}, {}, {});
            newUser.attemptNumberDateMap[formattedDate] = 1;
            newUser.successDateMap[formattedDate] = false;
            newUser.visiblePositionsDateMap[formattedDate] = [];
            user = newUser;
        }

        if (user.attemptNumberDateMap[formattedDate] == null) {
            user.attemptNumberDateMap[formattedDate] = 1;
            user.successDateMap[formattedDate] = false;
            user.visiblePositionsDateMap[formattedDate] = [];
        }

        return user;
    }
};
