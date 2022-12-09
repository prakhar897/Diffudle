module.exports = {
    convertDateFormat(date) {
        return date.toISOString().split('T')[0];
    }
};
