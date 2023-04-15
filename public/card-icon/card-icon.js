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
  
  buildBoardButton(t) {
    this.getTypesMap(t);
    return {
      text: 'Update Labels',
      callback: async (t) => {
        const allCards = await t.cards('id', 'labels');
        const labelsToAdd = await Promise.all(allCards.map(card => this.getRootLabelIfNeed(t, card.id, card.labels)));
        
        const cardsWithoutLabels = allCards
          .map((card, index) => {
            const labelToAdd = labelsToAdd[index];
            if (labelToAdd) {
              return {
                cardId: card.id,
                labelToAdd,
              }
            }
            return null;
          })
          .filter(Boolean);
        console.log({cardsWithoutLabels});
        cardsWithoutLabels.forEach(({ cardId, labelToAdd }) => {
          window.addLabelToCard(t, cardId, labelToAdd.id);
        });
        // console.log({ board: await t.board('all'), cards: await t.cards('all') });
        // await this.getLabelOfRoot(t, cardId);
        // await window.addLabelToCard(t, cardId, labelId);
      },
      condition: 'signedIn'
    }
  }
  
  buildCardButton(t) {
    return {
      icon: "https://cdn.glitch.com/1b42d7fe-bda8-4af8-a6c8-eff0cea9e08a%2Frocket-ship.png?1494946700421",
      text: "Update Label",
      callback: async (t) => {
        await this.addLabelToCurrentCard(t);
      }
    }
  }
  
  async addLabelToCurrentCard(t) {
    const card = await t.card('id', 'labels');
    this.addRootLabelToCard(t, card.id, card.labels);
  }
  
  async getRootLabelIfNeed(t, cardId, cardLabels) {
    const rootCard = await this.getRootCard(t, cardId);
    if (rootCard) {
      const [firstLabel] = await this.getLabelsOfCard(t, rootCard.id);
      if (firstLabel) {
        const isContains = cardLabels.find(label => label.id === firstLabel.id);
        if (!isContains) {
          return firstLabel;
        }
      }
    }
    return null;
  }
  
  async addRootLabelToCard(t, cardId, cardLabels) {
    const labelToAdd = await this.getRootLabelIfNeed(t, cardId, cardLabels);
    if (labelToAdd) {
      await window.addLabelToCard(t, cardId, labelToAdd.id);
    }
  }
  
  async getRootCard(t, cardId, result = null) {
    const parentsCard = await t.get(cardId, 'shared', 'parentsCard');
    if (!parentsCard) {
      return result;
    }
    return await this.getRootCard(t, parentsCard.id, parentsCard);
  }
  
  async getLabelsOfCard(t, cardId) {
    const cards = await t.cards('id', 'labels');
    const card = cards.find(card => card.id === cardId);
    return card.labels;
  }
}

window.cardIcon = new CardIcon();