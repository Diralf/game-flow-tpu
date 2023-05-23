class CardIcon extends window.AbstractList {
  constructor() {
    super();
    this.fieldName = "cardIcon";
    this.title = "Card Icon";
    this.default = -1;
    // this.icon = 'https://cdn.glitch.global/36da036c-f499-46a1-aa9f-1e196ed62696/icons-solid.svg?v=1681470772937'
    this.typesMap = new Map([
      [
        -1,
        {
          name: "No",
          shortName: "",
        },
      ],
      [
        0,
        {
          name: "Art",
          shortName: "",
          icon: "https://cdn.glitch.global/36da036c-f499-46a1-aa9f-1e196ed62696/palette-solid.svg?v=1681469763884",
          color: "purple",
        },
      ],
      [
        1,
        {
          name: "Music",
          shortName: "",
          color: "sky",
          icon: "https://cdn.glitch.global/36da036c-f499-46a1-aa9f-1e196ed62696/music-solid.svg?v=1681469770275",
        },
      ],
      [
        2,
        {
          name: "Code",
          shortName: "",
          color: "blue",
          icon: "https://cdn.glitch.global/36da036c-f499-46a1-aa9f-1e196ed62696/code-solid.svg?v=1681469757712",
        },
      ],
      [
        3,
        {
          name: "Narrative",
          shortName: "",
          color: "green",
          icon: "https://cdn.glitch.global/36da036c-f499-46a1-aa9f-1e196ed62696/feather-solid.svg?v=1681469751076",
        },
      ],
      [
        4,
        {
          name: "Game Design",
          shortName: "",
          color: "orange",
          icon: "https://cdn.glitch.global/36da036c-f499-46a1-aa9f-1e196ed62696/gamepad-solid.svg?v=1681469745413",
        },
      ],
      [
        5,
        {
          name: "Level Design",
          shortName: "",
          color: "yellow",
          icon: "https://cdn.glitch.global/36da036c-f499-46a1-aa9f-1e196ed62696/chess-knight-solid.svg?v=1681469741734",
        },
      ],
      [
        6,
        {
          name: "Main Menu",
          shortName: "",
          color: "purple",
          icon: "https://cdn.glitch.global/36da036c-f499-46a1-aa9f-1e196ed62696/house-solid.svg?v=1682021356206",
        },
      ],
      [
        7,
        {
          name: "Pause Menu",
          shortName: "",
          color: "purple",
          icon: "https://cdn.glitch.global/36da036c-f499-46a1-aa9f-1e196ed62696/circle-pause-solid.svg?v=1682021363052",
        },
      ],
      [
        8,
        {
          name: "Levels Map",
          shortName: "",
          color: "sky",
          icon: "https://cdn.glitch.global/36da036c-f499-46a1-aa9f-1e196ed62696/map-solid.svg?v=1682020938260",
        },
      ],
      [
        9,
        {
          name: "Characters",
          shortName: "",
          color: "green",
          icon: "https://cdn.glitch.global/36da036c-f499-46a1-aa9f-1e196ed62696/person-solid.svg?v=1682021368210",
        },
      ],
      [
        10,
        {
          name: "Game Mechanic",
          shortName: "",
          color: "blue",
          icon: "https://cdn.glitch.global/36da036c-f499-46a1-aa9f-1e196ed62696/gears-solid.svg?v=1682021374247",
        },
      ],
      [
        11,
        {
          name: "Location",
          shortName: "",
          color: "orange",
          icon: "https://cdn.glitch.global/36da036c-f499-46a1-aa9f-1e196ed62696/map-location-dot-solid.svg?v=1682021379356",
        },
      ],
      [
        12,
        {
          name: "Cut-scene",
          shortName: "",
          color: "pink",
          icon: "https://cdn.glitch.global/36da036c-f499-46a1-aa9f-1e196ed62696/video-solid.svg?v=1682021384683",
        },
      ],
      [
        13,
        {
          name: "NPC",
          shortName: "",
          color: "lime",
          icon: "https://cdn.glitch.global/36da036c-f499-46a1-aa9f-1e196ed62696/users-solid.svg?v=1682021389886",
        },
      ],
      [
        14,
        {
          name: "Items",
          shortName: "",
          color: "blue",
          icon: "https://cdn.glitch.global/36da036c-f499-46a1-aa9f-1e196ed62696/boxes-stacked-solid.svg?v=1682079314187",
        },
      ],
      [
        15,
        {
          name: "Entities",
          shortName: "",
          color: "pink",
          icon: "https://cdn.glitch.global/36da036c-f499-46a1-aa9f-1e196ed62696/paw-solid.svg?v=1682079319823",
        },
      ],
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
      text: "Update Labels",
      icon: "https://cdn.glitch.global/36da036c-f499-46a1-aa9f-1e196ed62696/magnifying-glass-solid.svg?v=1681556336950",
      callback: async (t) => {
        const allCards = await t.cards("id", "labels");
        const labelsToAdd = await Promise.all(
          allCards.map((card) =>
            this.getAllNewParentLabels(t, card.id, card.labels)
          )
        );

        const cardsWithoutLabels = allCards
          .map((card, index) => {
            const labelToAdd = labelsToAdd[index];
            if (labelToAdd && labelToAdd.length > 0) {
              return {
                cardId: card.id,
                labelToAdd,
              };
            }
            return null;
          })
          .filter(Boolean);
        cardsWithoutLabels.forEach(({ cardId, labelToAdd }) => {
          labelToAdd.forEach((label) => {
            window.addLabelToCard(t, cardId, label.id);
          });
        });
      },
      condition: "signedIn",
    };
  }

  buildCardButton(t) {
    return {
      icon: "https://cdn.glitch.com/1b42d7fe-bda8-4af8-a6c8-eff0cea9e08a%2Frocket-ship.png?1494946700421",
      text: "Update Label",
      callback: async (t) => {
        await this.addLabelToCurrentCard(t);
      },
    };
  }

  async addLabelToCurrentCard(t) {
    const card = await t.card("id", "labels");
    this.addAllNewParentLabelsToCard(t, card.id, card.labels);
  }

  async getAllNewParentLabels(t, cardId, cardLabels) {
    const allParentLabels = await this.getAllParentLabels(t, cardId);
    const newLabels = allParentLabels.filter(
      (parentLabel) => !cardLabels.find((label) => label.id === parentLabel.id)
    );
    return newLabels;
  }

  async addAllNewParentLabelsToCard(t, cardId, cardLabels = []) {
    const labelsToAdd = await this.getAllNewParentLabels(t, cardId, cardLabels);
    if (labelsToAdd) {
      await Promise.all(
        labelsToAdd.map((label) => window.addLabelToCard(t, cardId, label.id))
      );
    }
  }

  async getAllParentLabels(t, cardId) {
    const parentsCard = await t.get(cardId, "shared", "parentsCard");
    if (!parentsCard) {
      return [];
    }
    const labels = (await this.getLabelsOfCard(t, parentsCard.id)).filter(
      (label) => label.name.includes("*")
    );
    const nextLabels = await this.getAllParentLabels(t, parentsCard.id);
    return [...labels, ...nextLabels];
  }

  async getLabelsOfCard(t, cardId) {
    const cards = await t.cards("id", "labels");
    const card = cards.find((card) => card.id === cardId);
    return card?.labels ?? [];
  }
}

window.cardIcon = new CardIcon();
