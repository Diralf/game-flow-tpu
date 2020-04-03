const cardData = (t, field) => t.get("card", "shared", field);

class AbstractList {
  constructor() {
    this.fieldName = 'AbstractList';
    this.title = 'AbstractList';
    this.typesMap = new Map();
  }

  openPopup(t) {
    return t.popup({
      title: this.title,
      items: Array.from(this.typesMap).map(([typeKey, type]) => ({
        text: type.name,
        callback: async (t, opts) => {
          await t.set("card", "shared", this.fieldName, typeKey);
          t.closePopup();
        }
      }))
    });
  }

  async cardBadge(t) {
    return [
      await cardData(t, this.fieldName),
      data => {
        const type = this.typesMap.get(data) || {};
        return {
          text: type.shortName || type.name,
          color: type.color
        };
      }
    ];
  }

  async cardDetailBadge(t) {
    return [
      await cardData(t, this.fieldName),
      data => {
        const type = this.typesMap.get(data) || {};
        return {
          title: this.title,
          text: type.name || "No",
          color: type.color,
          callback: t => this.openPopup(t)
        };
      }
    ];
  }
}

window.AbstractList = AbstractList;
