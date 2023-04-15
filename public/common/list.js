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

  async cardBadge(t) {
    let data = await t.get("card", "shared", this.fieldName);
    if (data === undefined || data === null) {
      await t.set('card', 'shared', this.fieldName, this.default);
      data = this.default;
    }
    const type = (await this.getTypesMap(t)).get(data) || {};
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
}

window.AbstractList = AbstractList;
