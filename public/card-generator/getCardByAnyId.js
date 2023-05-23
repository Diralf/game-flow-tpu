export const getCardByAnyId = (cards, targetId, targetName = null) => {
    return cards.find((card) => {
        return card.id === targetId ||
            card.desc?.includes(`\`tempId=${targetId}\``) ||
            card.name === targetName;
    });
}

export const getCheckListById = (checklists, targetId, targetName = null) => {
    return checklists.find((checklist) => {
        return checklist.id === targetId ||
            checklist.name.replace(/\*\*[\w ]+\*\*/, '').trim() === targetName;
    });
}