class Question {

    constructor(name, style, image) {
        this.name = name || null;
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