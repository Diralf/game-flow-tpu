class CardType extends window.AbstractList {
  constructor() {
    super();
    this.fieldName = 'cardType';
    this.title = 'Card Type';
    this.typesMap = new Map([
      [
        "task",
        {
          name: "◰ TASK",
          shortName: " ◰ ",
          color: "sky"
        }
      ],
      [
        "story",
        {
          name: "⍟ STORY",
          shortName: " ⍟ ",
          color: "blue"
        }
      ],
      [
        "bug",
        {
          name: "○ BUG",
          shortName: " ○ ",
          color: "red"
        }
      ],
      [
        "epic",
        {
          name: "∿ EPIC",
          shortName: " ∿ ",
          color: "purple"
        }
      ]
    ]);
  }
}

window.cardType = new CardType();
