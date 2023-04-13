class Depends extends Links {
    constructor() {
        super();
        this.childesTitle = 'Related To';
        this.parentsTitle = 'Depends On';
        this.childesFieldName = 'relates';
        this.parentsFieldName = 'depends';
    }

    selectLevel(current, direction) {
        return current;
    }
}

window.depends = new Depends();
