class LinksInDesc {
  async createBadge(t) {
    const currentCard = await t.card("desc");
    let count = 0;
    try {
      count = window.cardListCount(currentCard.desc);
    } catch {}
    if (count === 0) {
      return null;
    }
    return {
      icon: "https://cdn.glitch.global/36da036c-f499-46a1-aa9f-1e196ed62696/pen-solid.svg?v=1682442258600",
      color: 'light-gray',
      text: count,
    };
  }
}

window.linksInDesc = new LinksInDesc();
