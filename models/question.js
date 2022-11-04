class Question {

    constructor(name, style, image, attemptNumber, date) {
        this.name = name || null;
        this.attemptNumber = attemptNumber || null;
        this.date = date || null;
        this.style = style || null;
        this.image = image || null;
    }

    getName(){
        return this.name;
    }

    setName(name){
        this.name = name;
    }
};


module.exports = Question;