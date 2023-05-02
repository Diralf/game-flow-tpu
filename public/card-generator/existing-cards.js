import {getCheckItems} from "../common/create-checklist.js";

export const getExistingCards = async (t) => {
    const allCards = await t.cards('id', 'name', 'shortLink', 'url', 'labels', 'checklists');
    return await Promise.all(allCards.map(async (card) => {
        const shortUrl = card.url.split(card.shortLink)[0] + card.shortLink;
        const data = await t.get(card.id, 'shared');
        const checklists = await Promise.all(card.checklists.map(async (checklist) => {
            const checkItems = checklist.checkItems ?? await getCheckItems(t, checklist.id);
            return {
                ...checklist,
                checkItems,
            };
        }));
        return {
            ...card,
            checklists,
            shortUrl,
            parentName: data?.parentsCard?.name ?? null,
            plugin: data,
        };
    }));
};