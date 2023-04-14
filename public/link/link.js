class Links {
  constructor() {
    this.childesTitle = "Childes";
    this.parentsTitle = "Parents";
    this.childesFieldName = "childes";
    this.parentsFieldName = "parents";

    this.defaultOptions = {
      singleParent: false,
      singleChild: false,
      isCreateAllowed: false,
    };
  }

  async addBothLink(t, toCard, options) {
    await this.addLink(
      t,
      options.currentCard,
      toCard,
      options.fieldName,
      options.reverseFieldName,
      options.single
    );
    await this.addLink(
      t,
      toCard,
      options.currentCard,
      options.reverseFieldName,
      options.fieldName,
      options.reverseSingle
    );
  }

  async addLink(t, fromCard, toCard, fieldName, reverseField, single) {
    if (!single) {
      const links = await t.get(fromCard.id, "shared", fieldName, []);
      await t.set(fromCard.id, "shared", fieldName, [...links, toCard.id]);
    } else {
      const [oldLink] = await t.get(fromCard.id, "shared", fieldName, []);
      if (oldLink) {
        await this.removeLink(t, oldLink, fromCard.id, reverseField);
        await this.removeLink(t, fromCard.id, oldLink, fieldName);
      }
      await t.set(fromCard.id, "shared", {
        [fieldName]: [toCard.id],
        [fieldName + "Card"]: toCard,
      });
    }
  }

  async removeBothLink(t, toId, options) {
    await this.removeLink(t, options.currentCardId, toId, options.fieldName);
    await this.removeLink(
      t,
      toId,
      options.currentCardId,
      options.reverseFieldName
    );

    await this.removeSingle(
      t,
      options.currentCardId,
      options.fieldName,
      options.single
    );
    await this.removeSingle(
      t,
      toId,
      options.reverseFieldName,
      options.reverseSingle
    );
  }

  async removeLink(t, fromId, toId, fieldName) {
    const links = await t.get(fromId, "shared", fieldName, []);
    await t.set(
      fromId,
      "shared",
      fieldName,
      links.filter((link) => link !== toId)
    );
  }

  async removeSingle(t, fromId, fieldName, single) {
    if (single) {
      await t.set(fromId, "shared", fieldName + "Card", null);
    }
  }

  async openStartMenu(t, options) {
    const type = await t.get("card", "shared", "cardType");
    const availableTypes = options.direction
      ? await this.getAvailableTypes(t, type, options.direction)
      : [type];
    console.log({ availableTypes });
    const isAddEnabled =
      (!options.single || options.linkCount === 0) && availableTypes.length > 0;
    const isCreateEnabled = isAddEnabled && options.isCreateAllowed;
    const isRemoveEnabled = options.linkCount > 0;
    const items = [];
    if (isCreateEnabled) {
      items.push({
        text: " > Create New",
        callback: (t, opts) => {
          this.createLink(t, options);
        },
      });
    }
    if (isAddEnabled) {
      items.push({
        text: " > Add Exists",
        callback: async (t, opts) => this.openFullList(t, options),
      });
    }

    if (isRemoveEnabled) {
      items.push({
        text: " > Remove Linked",
        callback: async (t, opts) => this.openLinkedList(t, options),
      });
    }

    const cards = await t.cards("id", "name", "idShort");
    const links = await t.get(
      options.currentCardId,
      "shared",
      options.fieldName,
      []
    );
    const linkedCards = cards.filter((card) => links.includes(card.id));

    items.push(
      ...linkedCards.map((card) => ({
        text: card.name,
        callback: (t) => t.showCard(card.id),
      }))
    );

    return t.popup({
      title: "Link to Card",
      items,
    });
  }

  async openFullList(t, options) {
    const cards = await t.cards("id", "name", "idShort");
    const links = await t.get(
      options.currentCardId,
      "shared",
      options.fieldName,
      []
    );
    const unlinkedCards = cards
      .filter((card) => !links.includes(card.id))
      .filter((card) => card.id !== options.currentCardId);
    const availableCards = await this.filterList(
      t,
      unlinkedCards,
      options.currentCardId,
      options.direction
    );
    return t.popup({
      title: "Add Link",
      search: {
        count: 10, // number of items to display at a time
        placeholder: "Search Card to Link",
        empty: "No cards found",
      },
      items: availableCards.map((card) => ({
        text: `#${card.idShort} ${card.name}`,
        callback: async (t) => {
          await this.addBothLink(t, card, options);
          return t.closePopup();
        },
      })),
    });
  }

  async openLinkedList(t, options) {
    const cards = await t.cards("id", "name", "idShort");
    const links = await t.get(
      options.currentCardId,
      "shared",
      options.fieldName,
      []
    );
    const linkedCards = cards.filter((card) => links.includes(card.id));
    return t.popup({
      title: "Remove Link",
      search: {
        count: 10,
        placeholder: "Search Card to Link",
        empty: "No cards found",
      },
      items: linkedCards.map((card) => ({
        text: `#${card.idShort} ${card.name}`,
        callback: async (t) => {
          await this.removeBothLink(t, card.id, options);
          return t.closePopup();
        },
      })),
    });
  }

  async defineCardDetailBadge(t, options) {
    options.currentCard = await t.card("id", "name");
    options.currentCardId = options.currentCard.id;

    let data = await t.get("card", "shared", options.fieldName, []);
    const cardIds = (await t.cards("id")).map((card) => card.id);
    const actualLinks = data.filter((link) => cardIds.includes(link));
    if (
      actualLinks.length !== data.length ||
      data.some((link, index) => !actualLinks.includes(link))
    ) {
      await t.set("card", "shared", options.fieldName, actualLinks);
      data = actualLinks;
    }
    options.linkCount = data.length;
    let text = data.length;

    if (options.single) {
      const linkedCard = await t.get(
        "card",
        "shared",
        options.fieldName + "Card"
      );
      text = linkedCard ? linkedCard.name : "Empty";
    }

    return {
      title: options.title,
      text,
      callback: (t) => this.openStartMenu(t, options),
    };
  }

  async childesCardDetailBadge(t, options = {}) {
    options = {
      ...this.defaultOptions,
      fieldName: this.childesFieldName,
      reverseFieldName: this.parentsFieldName,
      title: this.childesTitle,
      single: options.singleChild,
      reverseSingle: options.singleParent,
      direction: 1,
      ...options,
    };
    return this.defineCardDetailBadge(t, options);
  }

  async parentsCardDetailBadge(t, options = {}) {
    options = {
      ...this.defaultOptions,
      fieldName: this.parentsFieldName,
      reverseFieldName: this.childesFieldName,
      title: this.parentsTitle,
      single: options.singleParent,
      reverseSingle: options.singleChild,
      direction: -1,
      ...options,
    };
    return this.defineCardDetailBadge(t, options);
  }
  
  async findParentCardIcon(t, cardId, fieldName) {
    const parentCard = await t.get(cardId, "shared", fieldName + "Card");
    if (!parentCard) {
      return null;
    }
    const cardIcon = await window.cardIcon.getCardIcon(t, parentCard.id);
    if (cardIcon) {
      return cardIcon;
    }
    return await this.findParentCardIcon(t, parentCard.id, fieldName);
  }

  async singleCardBadge(t, fieldName) {
    const card = await t.get("card", "shared", fieldName + "Card");
    if (!card) {
      return {};
    }
    const cardIcon = await this.findParentCardIcon(t, "card", fieldName);
    return {
      icon:
        cardIcon?.icon ??
        "https://cdn.glitch.com/1b42d7fe-bda8-4af8-a6c8-eff0cea9e08a%2Frocket-ship.png?1494946700421",
      text: card.name,
      color: cardIcon?.color,
    };
  }

  async parentSingleCardBadge(t) {
    return this.singleCardBadge(t, this.parentsFieldName);
  }

  async filterList(t, cards, currentCardId, direction) {
    const typeCards = await Promise.all(
      cards.map((card) => t.get(card.id, "shared", window.cardType.fieldName))
    );
    const currentCardType = await t.get(
      currentCardId,
      "shared",
      window.cardType.fieldName
    );

    const availableTypes = await this.getAvailableTypes(
      t,
      currentCardType,
      direction
    );
    if (!availableTypes) {
      return [];
    }

    return cards
      .map((card, index) => ({ card, type: typeCards[index] }))
      .filter(
        ({ type }) => !!availableTypes.find((typeObj) => typeObj.name === type)
      )
      .map(({ card }) => card);
  }

  selectLevel(current, direction) {
    return current + direction;
  }

  async getAvailableTypes(t, currentCardType, direction) {
    const typeRelations = await window.cardType.getTypesRelations(t);
    const currentCardLevelIndex = await window.cardType.findTypeLevelIndex(
      t,
      currentCardType
    );
    const availableTypes = typeRelations
      .filter((level, index) => {
        if (direction < 0) return index < currentCardLevelIndex;
        if (direction > 0) return index > currentCardLevelIndex;
        return true;
      })
      .flat();
    return availableTypes;
  }

  async createLink(t, options) {
    console.log(options);
  }
}

window.Links = Links;
window.links = new Links();
