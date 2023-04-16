class ListType {
  constructor() {
    this.listTypeId = ["board", "shared", "listType"];
    this.listTypes = [
      {
        name: "BLOCKED",
        id: "blocked",
        color: "red",
        icon: "https://cdn.glitch.com/36da036c-f499-46a1-aa9f-1e196ed62696%2Fexclamation-circle-solid.svg?v=1589801701755",
      },
      {
        name: "TODO",
        id: "todo",
        color: "light-gray",
        icon: "https://cdn.glitch.com/36da036c-f499-46a1-aa9f-1e196ed62696%2Fbuffer-brands.svg?v=1589801678820",
      },
      {
        name: "IN PROGRESS",
        id: "inprogress",
        color: "yellow",
        icon: "https://cdn.glitch.com/36da036c-f499-46a1-aa9f-1e196ed62696%2Fangle-double-right-solid.svg?v=1589820143699",
      },
      {
        name: "IN TEST",
        id: "intest",
        color: "blue",
        icon: "https://cdn.glitch.global/36da036c-f499-46a1-aa9f-1e196ed62696/magnifying-glass-solid.svg?v=1681556336950",
      },
      {
        name: "DONE",
        id: "done",
        color: "lime",
        icon: "https://cdn.glitch.com/36da036c-f499-46a1-aa9f-1e196ed62696%2Fcheck-solid.svg?v=1589801687261",
      },
      {
        name: "CLOSED",
        id: "closed",
        color: "green",
        icon: "https://cdn.glitch.com/36da036c-f499-46a1-aa9f-1e196ed62696%2Fcheck-double-solid.svg?v=1589801694645",
      },
    ];
  }

  getTypeById(id) {
    return this.listTypes.find((type) => type.id === id);
  }

  createBoardButton(t) {
    return {
      text: "List Types",
      callback: (t) => this.openListOfLists(t),
      condition: "signedIn",
    };
  }

  async openListOfLists(t) {
    const lists = await t.lists("all");
    const assignedTypes = await t.get(...this.listTypeId, {});
    return await t.popup({
      title: "Board Lists",
      items: lists.map((list) => {
        const type = this.getTypeById(assignedTypes[list.id]);
        return {
          text: list.name + ` (${(type && type.name) || "none"})`,
          callback: (t) =>
            this.openWorkFlowTypes(t, (t, type) => {
              this.assignTypeToList(t, list, type);
              t.closePopup();
            }),
        };
      }),
    });
  }

  async openWorkFlowTypes(t, callback) {
    return t.popup({
      title: "Select Type",
      items: this.listTypes.map((type) => ({
        text: type.name,
        callback: (t) => callback(t, type),
      })),
    });
  }

  async assignTypeToList(t, list, type) {
    const listType = await t.get(...this.listTypeId, {});
    return await t.set(...this.listTypeId, {
      ...listType,
      [list.id]: type.id,
    });
  }
  
  getNameOfListType(listTypeId) {
    const listType = this.listTypes.find((listType) => listType.id === listTypeId);
    return listType?.name ?? listTypeId;
  }
}

window.listType = new ListType();
