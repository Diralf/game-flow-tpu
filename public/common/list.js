class AbstractList {
  constructor() {
    this.fieldName = 'AbstractList';
    this.title = 'AbstractList';
    this.typesMap = new Map();
    this.default = null;
    this.icon = null;
  }

  async openPopup(t) {
    return t.popup({
      title: this.title,
      items: Array.from((await this.getTypesMap(t))).map(([typeKey, type]) => ({
        text: type.name,
        callback: async (t, opts) => {
          await t.set("card", "shared", this.fieldName, typeKey);
          t.closePopup();
        }
      }))
    });
  }

  async getPreviousValue(t, currentId) {
    const typedMap = Array.from(await this.getTypesMap(t));
    const prevPair = typedMap.find(([key, value]) => value.prevId === currentId);
    if (prevPair) {
      await t.set('card', 'shared', this.fieldName, prevPair[0]);
      return prevPair[1];
    }
    return null;
  }

  async cardBadge(t) {
    let data = await t.get("card", "shared", this.fieldName);
    if (data === undefined || data === null) {
      await t.set('card', 'shared', this.fieldName, this.default);
      data = this.default;
    }
    const typedMap = await this.getTypesMap(t);
    const type = typedMap.get(data) ?? (await this.getPreviousValue(t, data)) ?? {};
    if (type.hidden) {
      return null;
    }
    if (type?.name?.toUpperCase() === 'NO') {
      return null;
    }
    return {
      text: type.shortName ?? type.name,
      color: type.color,
      icon: type.icon || this.icon
    };
  }

  async cardDetailBadge(t) {
    const data = await t.get("card", "shared", this.fieldName, this.default);
    const type = (await this.getTypesMap(t)).get(data) || {};
    return {
      title: this.title,
      text: type.name || "No",
      color: type.color,
      callback: t => this.openPopup(t)
    };
  }

  async getTypesMap(t) {
    return this.typesMap;
  }

  getNameOfItem(id) {
    console.log({id, item: this.typesMap.get(id), map: this.typesMap});
    return this.typesMap.get(id) ?? id;
  }
}

window.AbstractList = AbstractList;
