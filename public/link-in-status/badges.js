class LinkInStatus {

    async createBadges(t) {
        const countsForType = await this.countForStatus(t);
        return listType.listTypes.map(type => ({
            dynamic: async () => {
                const text = countsForType[type.id] ? countsForType[type.id].length : null;
                return {
                    text,
                    color: type.color,
                    icon: text && type.icon,
                    refresh: 60
                }
            }
        }));
    }

    async createDetailBadges(t) {
        const countsForType = await this.countForStatus(t);
        return listType.listTypes.map(type => {
            return countsForType[type.id] ? {
                title: 'Status',
                text: `${type.name} (${countsForType[type.id].length})`,
                icon: type.icon,
                color: type.color,
                callback: (t) => t.popup({
                    title: 'Cards in status: ' + type.name,
                    items: countsForType[type.id].map(card => ({
                        text: card.name,
                        callback: (t) => t.showCard(card.id)
                    }))
                })
            } : {};
        });
    }

    async getAllChildren(t, cardId = 'card') {
        try {
            const children = await t.get(cardId, 'shared', window.links.childesFieldName, []);
            let nextChildren = [];
            for (const childId of children) {
                const nextChild = await this.getAllChildren(t, childId);
                nextChildren.push(...nextChild);
            }

            return [...children, ...nextChildren];
        } catch (e) {
            console.error(e);
            return [];
        }
    }

    async countForStatus(t) {
        const countsInList = {};
        const savedLinks = await this.getAllChildren(t);
        const lists = await t.lists('all');

        for (const link of savedLinks) {
            for (const list of lists) {
                const card = list.cards.find(card => card.id === link);
                if (card) {
                    if (!countsInList[list.id]) countsInList[list.id] = [];
                    countsInList[list.id].push(card);
                    break;
                }
            }
        }

        const assigned = await t.get(...listType.listTypeId);
        const countsForType = {};
        for (const listId of Object.keys(countsInList)) {
            const typeId = assigned[listId];
            if (!typeId) continue;
            if (!countsForType[typeId]) countsForType[typeId] = [];
            countsForType[typeId].push(...countsInList[listId]);
        }
        return countsForType;
    }

    async createChecklistBadge(t) {
        const countsForType = await this.countForStatus(t);
        return {
            dynamic: async (t) => {
                const currentCard = await t.card('id', 'badges');
                const allCards = await t.cards('id', 'badges');
                const { checkItemsChecked, checkItems } = await this.getAllChecklistChildren(t, allCards, currentCard.id);
                if (checkItems > 0 && checkItems !== currentCard?.badges?.checkItems) {
                    return {
                        text: `All: ${checkItemsChecked}/${checkItems}`,
                        // color: 'blue',
                        refresh: 60
                    }
                }
                return null;
            }
        };
    }

    async getAllChecklistChildren(t, cards, cardId) {
        try {
            const currentCard = cards.find(card => card.id === cardId);
            let checkItems = currentCard.badges?.checkItems ?? 0;
            let checkItemsChecked = currentCard.badges?.checkItemsChecked ?? 0;

            const children = await t.get(cardId, 'shared', window.links.childesFieldName, []);
            for (const childId of children) {
                const child = await this.getAllChecklistChildren(t, cards, childId);
                checkItems += child.checkItems;
                checkItemsChecked += child.checkItemsChecked;
            }

            return { checkItems, checkItemsChecked };
        } catch (e) {
            console.error(e);
            return { checkItems: 0, checkItemsChecked: 0 };
        }
    }
}

window.linkInStatus = new LinkInStatus();
