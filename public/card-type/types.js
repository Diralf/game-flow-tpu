class CardType extends window.AbstractList {
  constructor() {
    super();
    this.fieldName = 'cardType';
    this.title = 'Card Type';
    this.default = 'TASK';
    this.colors = [
        ['purple', '#403294'],
        ['blue', '#0747A6'],
        ['sky', '#008DA6'],
        ['green', '#00a61c'],
        ['yellow', '#a58300'],
        ['orange', '#af5800'],
    ];
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

    this.typesRelations = [
      ['epic'],
      ['story', 'bug'],
      ['task']
    ]
  }

  async getTypesRelations(t) {
    return await t.get('board', 'shared', 'boardCardTypes', this.typesRelations);
  }

  async getTypesMap(t) {
    const boardTypes = await this.getTypesRelations(t);
    if (boardTypes.length > 0) {
      const types = [];
      for (const level of boardTypes) {
        types.push(...level);
      }
      let colors = [];
      const typesMap = types.map(typeObj => {
        const type = typeObj.name;
        if (colors.length === 0) {
          colors = [...this.colors];
        }
        const customCollor = typeObj.color && typeObj.umlColor ? [typeObj.color, typeObj.umlColor] : null;
        const color = customCollor ?? (type.toLowerCase().includes('bug') ? ['red', '#BF2600'] : colors.shift());
        const customIcon = typeObj.icon ? `https://cdn.glitch.com/36da036c-f499-46a1-aa9f-1e196ed62696%2F${typeObj.icon}` : null;
        const icon = type.toLowerCase().includes('bug') 
          ? 'https://cdn.glitch.com/36da036c-f499-46a1-aa9f-1e196ed62696%2Fbug-solid.svg?v=1589800839792' 
          : 'https://cdn.glitch.com/36da036c-f499-46a1-aa9f-1e196ed62696%2Fcogs-solid.svg?v=1589801018782';
        return [
          type,
          {
            name: type,
            shortName: typeObj.shortName ?? type,
            color: undefined,//color[0],
            umlColor: color[1],
            icon: customIcon ?? icon,
          }
        ];
      })
      return new Map(typesMap);
    }
    return this.typesMap;
  }
  
  async findTypeLevelIndex(t, currentCardType) {
    const typeRelations = await this.getTypesRelations(t);
    return typeRelations.findIndex(level => !!level.find((typeObj) => typeObj.name === currentCardType))
  }

  async getTypeRelation(t, currentCardType, direction) {
    console.log('getTypeRelation');
    const typeRelations = await this.getTypesRelations(t);
    const currentCardLevelIndex = await this.findTypeLevelIndex(t, currentCardType);
    const availableTypes = typeRelations[currentCardLevelIndex + direction];
    return availableTypes || [];
  }

  buildBoardButton(t) {
    this.getTypesMap(t);
    return {
      text: 'Define Card Types',
      callback: (t) => t.popup({
        title: 'Define Card Types',
        url: './card-type/define-types.html'
      }),
      condition: 'signedIn'
    }

  }
}

window.cardType = new CardType();
