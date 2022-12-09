module.exports = {
    convertDateFormat(queryDate, todayDate) {
        if(queryDate === undefined)
            return todayDate.toISOString().split('T')[0];
        return queryDate;
    }
};
