class LinkInStatus {

    async createBadges(t) {
        return listType.listTypes.map(type => ({
            dynamic: async () => {
                const countsForType = await this.countForStatus(t);
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
}

window.linkInStatus = new LinkInStatus();
