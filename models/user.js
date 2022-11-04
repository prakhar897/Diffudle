class User {

    constructor(ipAddress, attemptNumber, success, currentVisiblePositions) {
        this.ipAddress = ipAddress || null;
        this.attemptNumber = attemptNumber || {};
        this.success = success || {};
        this.currentVisiblePositions = currentVisiblePositions || [];
        
    }

    getIPAddress(){
        return this.ipAddress;
    }

    setIPAddress(ipAddress){
        this.ipAddress = ipAddress;
    }
};

module.exports = User;

