module.exports = {
    getCurrentDate() {
        return new Date().toISOString().split('T')[0];
    }
};
