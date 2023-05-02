export const jsonToCardsList = (legendJson, tasksJson, currentCardId) => {
    const legendArray = legendJsonToArray(legendJson);
    return tasksJsonToCardList({
        tasksJson, legendArray, parentId: currentCardId, parentCard: { id: currentCardId },
    });
};

export const legendJsonToArray = (legendJson) => {
    const value = legendJson?.[0];
    if (!value) {
        return [];
    }
    return [value.name, ...legendJsonToArray(value.children)];
}

const tasksJsonToCardList = ({
    tasksJson,
    legendArray,
    parentId,
    parentCard = null,
    level = 0,
    parentRequestsCard = false,
    checklistOwnerCard = null,
    deepForCheckList = null,
    tempIdPrefix = 'TEMP_',
}) => {
    const mdTasks = tasksJson;
    const taskType = legendArray[level];
    const cards = mdTasks.map((mdTask, index) => {
        const id = mdTask.metadata?.id
            ?? mdTask.metadata?.checklist
            ?? mdTask.metadata?.checklistItem
            ?? `${tempIdPrefix}${parentId}_${index}`;
        const shouldHaveCard = isShouldHaveCard(mdTask, parentRequestsCard);
        return ({
            id,
            name: mdTask.name,
            parentId,
            parentCard,
            taskType,
            label: mdTask.metadata?.label,
            mdTask,
            shouldHaveCard,
            shouldHaveChildrenCards: shouldHaveChildrenCards(mdTask, parentRequestsCard),
            checklistOwnerCard: deepForChildrenChecklist(mdTask) ? id : checklistOwnerCard,
            deepForCheckList: deepForChildrenChecklist(mdTask) ?? (deepForCheckList !== null ? deepForCheckList + 1 : null),
            shouldHaveChecklist: shouldHaveChecklist(deepForCheckList, shouldHaveCard),
            shouldHaveChecklistItem: shouldHaveChecklistItem(deepForCheckList, shouldHaveCard),
        });
    });
    const childrenCards = cards
        .flatMap(card => {
            return tasksJsonToCardList({
                tasksJson: card.mdTask.children ?? [],
                legendArray,
                parentId: card.id,
                parentCard: card,
                level: level + 1,
                parentRequestsCard: card.shouldHaveChildrenCards,
                checklistOwnerCard: card.checklistOwnerCard === card.id ? card : card.checklistOwnerCard,
                deepForCheckList: card.deepForCheckList,
                tempIdPrefix: '',
            });
        });
    return [...cards, ...childrenCards];
}

const isShouldHaveCard = (mdTask, parentRequestsCard) => {
    const toValue = mdTask.metadata?.to;
    const haveId = mdTask.metadata?.id;
    return !haveId && (
        toValue === 'CARD' ||
        toValue === 'ALL_CARDS' ||
        toValue === 'MULTI_CHECKLIST_CARD' ||
        toValue === 'SINGLE_CHECKLIST_CARD' ||
        parentRequestsCard
    );
}

const shouldHaveChildrenCards = (mdTask, parentRequestsCard) => {
    const toValue = mdTask.metadata?.to;
    return toValue === 'ALL_CARDS' ||
        (parentRequestsCard && toValue !== 'MULTI_CHECKLIST_CARD' && toValue !== 'SINGLE_CHECKLIST_CARD');
}

const shouldHaveChecklist = (deepForCheckList, shouldHaveCard) => {
    return deepForCheckList === 1 && !shouldHaveCard;
}

const shouldHaveChecklistItem = (deepForCheckList, shouldHaveCard) => {
    return deepForCheckList > 1 && !shouldHaveCard;
}

const deepForChildrenChecklist = (mdTask) => {
    const toValue = mdTask.metadata?.to;
    if (toValue === 'MULTI_CHECKLIST_CARD') {
        return 1;
    }
    if (toValue === 'SINGLE_CHECKLIST_CARD') {
        return 2;
    }
    return null;
}