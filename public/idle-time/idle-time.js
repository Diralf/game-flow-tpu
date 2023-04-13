class IdleTime {
  async cardBadge(t) {
    const { idList } = await t.card("idList");
    const previousIdList = await t.get(
      "card",
      "shared",
      "previousIdList",
      null
    );
    if (idList !== previousIdList) {
      await t.set("card", "shared", "previousIdList", idList);
      await t.set("card", "shared", "lastListChange", new Date());
    }
    const lastChangeTime = await t.get(
      "card",
      "shared",
      "lastListChange",
      new Date()
    );
    
    const differenceInTime = new Date().getTime() - new Date(lastChangeTime).getTime();
    const differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24));
    
    return {
      text: `${differenceInDays}d`,
      icon: 'https://cdn.glitch.com/36da036c-f499-46a1-aa9f-1e196ed62696%2Fseedling-solid.svg?v=1589913555517',
      // color: "light-gray",
      refresh: 6000
    };
  }
}

window.idleTime = new IdleTime();
