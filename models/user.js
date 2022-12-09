class User {

    constructor(ipAddress, attemptNumberDateMap, successDateMap, visiblePositionsDateMap) {
        this.attemptNumberDateMap = attemptNumberDateMap || {};
        this.successDateMap = successDateMap || {};
        this.visiblePositionsDateMap = visiblePositionsDateMap || {}; 
    }
};

module.exports = User;

