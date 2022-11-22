class User {

    constructor(ipAddress, attemptNumber, success, currentVisiblePositions, guessHistory) {
        this.ipAddress = ipAddress || null;
        this.attemptNumber = attemptNumber || {};
        this.success = success || {};
        this.currentVisiblePositions = currentVisiblePositions || [];
        this.guessHistory = guessHistory || {};
        
    }

    getIPAddress(){
        return this.ipAddress;
    }

    setIPAddress(ipAddress){
        this.ipAddress = ipAddress;
    }
};

module.exports = User;

