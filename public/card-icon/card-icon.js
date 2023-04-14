class CardIcon extends window.AbstractList {
  constructor() {
    super();
    this.fieldName = 'cardIcon';
    this.title = 'Card Icon';
    this.default = -1;
    // this.icon = 'https://cdn.glitch.global/36da036c-f499-46a1-aa9f-1e196ed62696/icons-solid.svg?v=1681470772937'
    this.typesMap = new Map([
      [
        -1,
        {
          name: "No",
          shortName: '',
        }
      ],
      [
        0,
        {
          name: "Art",
          shortName: '',
          icon: 'https://cdn.glitch.global/36da036c-f499-46a1-aa9f-1e196ed62696/palette-solid.svg?v=1681469763884',
          color: "purple"
        }
      ],
      [
        1,
        {
          name: "Music",
          shortName: '',
          color: "sky",
          icon: "https://cdn.glitch.global/36da036c-f499-46a1-aa9f-1e196ed62696/music-solid.svg?v=1681469770275"
        }
      ],
      [
        2,
        {
          name: "Code",
          shortName: '',
          color: "blue",
          icon: "https://cdn.glitch.global/36da036c-f499-46a1-aa9f-1e196ed62696/code-solid.svg?v=1681469757712"
        }
      ],
      [
        3,
        {
          name: "Narrative",
          shortName: '',
          color: "green",
          icon: "https://cdn.glitch.global/36da036c-f499-46a1-aa9f-1e196ed62696/feather-solid.svg?v=1681469751076"
        }
      ],
      [
        4,
        {
          name: "Game Design",
          shortName: '',
          color: "orange",
          icon: "https://cdn.glitch.global/36da036c-f499-46a1-aa9f-1e196ed62696/gamepad-solid.svg?v=1681469745413"
        }
      ],
      [
        5,
        {
          name: "Level Design",
          shortName: '',
          color: "yellow",
          icon: "https://cdn.glitch.global/36da036c-f499-46a1-aa9f-1e196ed62696/chess-knight-solid.svg?v=1681469741734"
        }
      ]
    ]);
  }
  
  async getCardIcon(t, cardId) {
    const cardIconId = await t.get(cardId, "shared", "cardIcon");
    if (cardIconId >= 0) {
      return this.typesMap.get(cardIconId);
    }
    return null;
  }
}

window.cardIcon = new CardIcon();