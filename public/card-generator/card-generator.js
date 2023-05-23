import {markdownToJson} from "./markdown-to-json.js";
import {jsonToCardsList} from "./json-to-cards-list.js";
import {getExistingCards} from "./existing-cards.js";
import {createCard} from "../common/create-card.js";
import {updateCard} from "../common/update-card.js";
import {createCheckList} from "../common/create-checklist.js";
import {linkRegExp} from "./link-reg-exp.js";
import {updateRootDescription} from "./updateRootDescription.js";
import {getCardByAnyId, getCheckListById} from "./getCardByAnyId.js";

/*
// SAMPLE
# Legend
- FEATURE
  - PART
    - TASK
      - SUB-TASK
## End Legend

# Tasks
- Great Feature
  - Part of the feature
    - **CODE** Task for coder
    - **ART** Task for artist
  - Other part of the feature
    - **CODE** Task for coder
    - **ART** Task for artist
## End Tasks

 */

/**
 * 1. You can list all potential tasks in the following manner, and generate cards then.
 * Define legend with relations between cards
 * Define tasks with names of cards
 * @example
 * # Legend
 * - FEATURE
 *   - PART
 *     - TASK
 *       - SUB-TASK
 * ## End Legend
 *
 * # Tasks
 * - Great Feature
 *   - Part of the feature
 *     - **CODE** Task for coder
 *     - **ART** Task for artist
 *   - Other part of the feature
 *     - **CODE** Task for coder
 *     - **ART** Task for artist
 * ## End Tasks
 *
 * 2. To create real card from that add "+" to the end of line
 * @example
 * ...
 *    - **CODE** Task for coder +
 * ...
 *
 * 3. And you will get a card with name "Task for coder" and label "CODE" and linked to parent task "Part of the feature"
 * NOTE: parent task should be already created
 * NOTE: You can mark by "+" parents also to create them
 * @example
 * - Great Feature +
 *   - Part of the feature +
 *     - **CODE** Task for coder +
 *
 * 4. After creation of tasks description with this list will be updated with the links to created cards.
 *
 * 5. To Create card itself and all children add % symbol to the end of line
 * @example
 * - Great Feature %
 *   - Part of the feature
 *     - **CODE** Task for coder
 * - Other Feature
 * It will create all 3 tasks under Great Feature, but not for Other Feature
 */
class CardGenerator {

    constructor() {
        this.sizeNames = [
            'XL',
            'L',
            'M',
            'S',
        ];
    }

    log(t, message, ...opts) {
        if (typeof message === "string") {
            t.alert({ message });
        }
        console.debug('DEBUG:', message, ...opts);
    }

    buildBoardButton(t) {
        return {
            text: "Update IDs",
            callback: async (t) => {
                const cardsOnTheBoard = await t.cards('id', 'name');
                console.log({cardsOnTheBoard});
                const typesMap = new Map(
                    (await t.get('board', 'shared', 'boardCardTypes'))
                        .flat()
                        .map(type => [type.id, type])
                );

                // reset IDs
                await t.set('board', 'shared', 'epicIndex', 0);
                for (const card of cardsOnTheBoard) {
                    await t.set(card.id, 'shared', 'subTaskIndex', 0);
                    await t.set(card.id, 'shared', 'taskId', undefined);
                }

                /* generate IDs for board cards
                const queue = cardsOnTheBoard.slice();
                while (queue.length > 0) {
                    const card = queue.shift();
                    const cardTaskId = await t.get(card.id, 'shared', 'taskId');
                    if (cardTaskId) {
                        console.log('Card already have task ID', cardTaskId, card);
                        continue;
                    }
                    const parentCard = await t.get(card.id, 'shared', 'parentsCard');
                    const cardType = await t.get(card.id, 'shared', 'cardType');
                    const type = typesMap.get(cardType);
                    if (!type) {
                        console.error('Card doesnt have type', card, cardType, typesMap.entries());
                        continue;
                    }
                    const typeShortName = type?.name[0].toUpperCase();
                    const parentTaskId = parentCard ? await t.get(parentCard.id, 'shared', 'taskId') : null;
                    if (parentCard && parentTaskId) {
                        const parentSubTaskIndex = (await t.get(parentCard.id, 'shared', 'subTaskIndex', 0)) + 1;
                        const taskId = parentTaskId + typeShortName + parentSubTaskIndex;
                        await t.set(parentCard.id, 'shared', 'subTaskIndex', parentSubTaskIndex);
                        await t.set(card.id, 'shared', 'taskId', taskId);
                    } else if (!parentCard) {
                        const epicIndex = (await t.get('board', 'shared', 'epicIndex', 0)) + 1;
                        const taskId = typeShortName + epicIndex;
                        await t.set('board', 'shared', 'epicIndex', epicIndex);
                        await t.set(card.id, 'shared', 'taskId', taskId);
                    } else {
                        queue.push(card);
                    }
                }
                */

                const cardsOnTheBoard2 = await getExistingCards(t);
                console.log({cardsOnTheBoard2});
            },
            condition: "signedIn",
            icon: "https://cdn.glitch.com/36da036c-f499-46a1-aa9f-1e196ed62696%2Fseedling-solid.svg?v=1589913555517",
        };
    }

    buildCardButton(t) {
        return {
            icon: "https://cdn.glitch.com/1b42d7fe-bda8-4af8-a6c8-eff0cea9e08a%2Frocket-ship.png?1494946700421",
            text: "Generate Cards",
            callback: async (t) => {
                const currentCard = await t.card('id', 'name', 'desc', 'idList');
                const cardsOnTheBoard = await getExistingCards(t);
                const { legendJson, tasksJson, templateJson } = markdownToJson(currentCard.desc);
                const board = await t.board('labels');
                const templateDescribedCards = jsonToCardsList(legendJson, templateJson, 'test_card' + '_template');

                const describedCards = jsonToCardsList(legendJson, tasksJson, currentCard.id);

                const cardsToUpdate = await this.createCards(t, currentCard, describedCards, cardsOnTheBoard);

                await this.delay(async () => {
                    await this.createChecklists(t, currentCard, describedCards, board.labels);
                });

                await this.delay(async () => {
                    await this.createChecklistItems(t, currentCard, describedCards, board.labels);
                    await this.updateCards(t, cardsToUpdate, board.labels);
                    const cardsToUpdateAgain = await this.getCardsToUpdate(t, describedCards, cardsOnTheBoard);
                    await this.updateCards(t, cardsToUpdateAgain, board.labels);
                });

                await this.delay(async () => {
                    await this.updateRootDescription(t, currentCard, describedCards, templateDescribedCards);
                    this.log(t, 'GENERATION FINISHED');
                });
            },
        };
    }

    buildCardButtonUpdateDescription(t) {
        return {
            icon: "https://cdn.glitch.com/1b42d7fe-bda8-4af8-a6c8-eff0cea9e08a%2Frocket-ship.png?1494946700421",
            text: "Update Description",
            callback: async (t) => {
                const currentCard = await t.card('id', 'name', 'desc', 'idList');
                const { legendJson, tasksJson, templateJson } = markdownToJson(currentCard.desc);
                const describedCards = jsonToCardsList(legendJson, tasksJson, currentCard.id);
                const templateDescribedCards = jsonToCardsList(legendJson, templateJson, 'test_card' + '_template');
                await this.updateRootDescription(t, currentCard, describedCards, templateDescribedCards);
            },
        };
    }

    delay(cb = () => {}) {
        return new Promise(resolve => {
            setTimeout(() => {
                const call = async () => {
                    await cb();
                    resolve();
                }
                call();
            }, 3000);
        });
    }

    async createCards(t, currentCard, describedCards, cardsOnTheBoard) {
        const cardsToCreate = this.getCardsShouldBeCreated(describedCards, cardsOnTheBoard);
        if (cardsToCreate.length === 0) {
            this.log(t, 'No cards to create');
        }
        this.log(t, 'Start creating of cards...');
        const createdCards = [];
        const cardsToUpdate = [];
        try {
            for (const cardDesc of cardsToCreate) {
                const parentCard = cardDesc.parentCard
                    ? (this.getParentCard(createdCards, cardDesc.parentCard.id) ?? this.getParentCard(cardsOnTheBoard, cardDesc.parentCard.id))
                    : null;

                if (!cardDesc.parentCard || parentCard) {
                    const createdCard = await createCard(t, {
                        name: cardDesc.name,
                        desc: (cardDesc.mdTask.description ?? ''),
                        idList: currentCard.idList,
                    }, false);

                    // TODO MUTABLE OPERATION
                    cardDesc.id = createdCard.id;

                    this.log(t, `Card ${createdCard.name} created successfully. Created ${createdCards.length}/${cardsToCreate.length}`, createdCard);
                    createdCards.push(createdCard);
                    cardsToUpdate.push({
                        createdCard,
                        parentCard,
                        cardInfo: cardDesc,
                    });
                }
            }
        } catch (e) {
            console.error(e);
        }
        this.log(t, 'Card creation have been finished. Please wait for 3 second for updating other fields');
        return cardsToUpdate;
    }

    async createChecklists(t, currentCard, describedCards, boardLabels) {
        this.log(t, 'Start creating of checklists...');
        const toChecklist = describedCards.filter(descCard => descCard.shouldHaveChecklist);
        const cardsOnTheBoard = await getExistingCards(t);
        const results = [];
        for (const cardDesc of toChecklist) {
            const checklistOwnerCard = cardDesc.checklistOwnerCard ? this.getCardByAnyId(cardsOnTheBoard, cardDesc.checklistOwnerCard?.id) : null;
            const isChecklistExists = this.getCheckListById(checklistOwnerCard?.checklists ?? [], cardDesc.id);
            let createdCheckList = null;
            if (!isChecklistExists) {
                try {
                    const label = cardDesc.label ? `**${cardDesc.label}** ` : '';
                    createdCheckList = await createCheckList(
                        t,
                        checklistOwnerCard.id,
                        `${label}${cardDesc.name}`,
                        false
                    );

                    // TODO MUTABLE OPERATION
                    cardDesc.id = createdCheckList.id;

                    await this.addDescLabelToCard(t, cardDesc, boardLabels, checklistOwnerCard);
                } catch (e) {
                    console.error(e);
                }
            }
            results.push({ card: cardDesc, checklistOwnerCard, createdCheckList });
        }
        this.log(t, 'Finished creating of checklists.', results);
    }

    async createChecklistItems(t, currentCard, describedCards, boardLabels) {
        this.log(t, 'Start creating of checklist items...');
        const toChecklistItem = describedCards.filter(descCard => descCard.shouldHaveChecklistItem);
        const results = [];
        const cardsOnTheBoard = await getExistingCards(t);
        for (const cardDesc of toChecklistItem) {
            const checklistOwnerCard = cardDesc.checklistOwnerCard ? this.getCardByAnyId(cardsOnTheBoard, cardDesc.checklistOwnerCard?.id) : null;
            const checkLists = checklistOwnerCard?.checklists ?? [];
            let checklist = this.getCheckListById(checkLists, cardDesc.parentCard?.id) ?? checkLists.find((checklist) => checklist.name === 'Tasks');
            if (!checklist) {
                try {
                    checklist = await createCheckList(t, checklistOwnerCard.id, 'Tasks', false);
                    await this.delay();
                } catch (e) {
                    console.error(e);
                }
            }
            const isChecklistItemExists = this.getCheckListById(checklist?.checkItems ?? [], cardDesc.id);
            let createdCheckListItem = null;
            if (!isChecklistItemExists) {
                try {
                    const label = cardDesc.label ? `**${cardDesc.label}** ` : '';
                    createdCheckListItem = await createCheckListItem(
                        t,
                        checklist.id,
                        `${label}${cardDesc.name}`,
                        false,
                    );

                    // TODO MUTABLE OPERATION
                    cardDesc.id = createdCheckListItem.id;

                    await this.addDescLabelToCard(t, cardDesc, boardLabels, checklistOwnerCard);
                } catch (e) {
                    console.error(e);
                }
            }
            results.push({ card: cardDesc, checklistOwnerCard, checklist, createdCheckListItem })
        }
        this.log(t, 'Finished creating of checklist items.', results);
    }

    async updateCards(t, cardsToUpdate, boardLabels) {
        this.log(t, 'Start labels and other fields update...', cardsToUpdate);
        let doneCount = 0;
        for (const {createdCard, parentCard, cardInfo} of cardsToUpdate) {
            const type = await this.getTypeByName(t, cardInfo.taskType);
            try {
                if (type?.id) {
                    await t.set(createdCard.id, 'shared', 'cardType', type.id);
                } else {
                    const types = await t.get('board', 'shared', 'boardCardTypes');
                    console.warn(`Type ${cardInfo.taskType} not found. Board types`, types);
                }
            } catch (e) {
                console.error(e);
            }

            try {
                if (parentCard) {
                    await this.addLink(t, createdCard, parentCard, 'parents', 'childes', true);
                    await this.addLink(t, parentCard, createdCard, 'childes', 'parents', false);
                } else {
                    if (cardInfo.parentCard) {
                        console.warn(`Type ${cardInfo.parentCard.name} not found. ID: ${cardInfo.parentCard.id}`);
                    }
                }
            } catch (e) {
                console.error(e);
            }

            try {
                const metaSize = cardInfo?.mdTask?.metadata?.size?.toUpperCase();
                if (metaSize) {
                    const sizeIndex = this.sizeNames.indexOf(metaSize);
                    await t.set(createdCard.id, 'shared', 'estimation', sizeIndex);
                }
            } catch (e) {
                console.error(e);
            }

            try {
                const metaPriority = +cardInfo?.mdTask?.metadata?.priority;
                if (!isNaN(metaPriority)) {
                    await t.set(createdCard.id, 'shared', 'severity', metaPriority);
                }
            } catch (e) {
                console.error(e);
            }

            try {
                await window.cardIcon.addAllNewParentLabelsToCard(t, createdCard.id);
            } catch (e) {
                console.error(e);
            }

            let boardLabel = await this.addDescLabelToCard(t, cardInfo, boardLabels, createdCard);

            doneCount += 1;
            this.log(t, `Card ${createdCard.name} updated. Done ${doneCount}/${cardsToUpdate.length}`, { createdCard, parentCard, cardInfo, type, boardLabel });
        }
        this.log(t, 'Card labels and other fields updated.');
    }

    async addDescLabelToCard(t, cardInfo, boardLabels, createdCard) {
        let boardLabel;
        try {
            if (cardInfo.label) {
                boardLabel = this.getBoardLabel(boardLabels, cardInfo);
                const isLabelExists = createdCard?.labels?.find(label => label.name.includes(cardInfo.label));
                if (!isLabelExists) {
                    if (boardLabel) {
                        await window.addLabelToCard(t, createdCard.id, boardLabel.id);
                    } else {
                        console.warn(`Label ${cardInfo.label} not found.`, 'Board labels:', boardLabels);
                    }
                }
            }
        } catch (e) {
            console.error(e, cardInfo.label, JSON.stringify(createdCard?.labels), boardLabels);
        }
        return boardLabel;
    }

    getBoardLabel(boardLabels, cardInfo) {
        return boardLabels.find(label => label?.name?.toUpperCase().startsWith(cardInfo?.label?.toUpperCase()));
    }

    async getCardsToUpdate(t, describedCards, boardCards) {
        const types = (await t.get('board', 'shared', 'boardCardTypes')).flat();

        return describedCards
            .map((cardInfo) => {
                const parentCard = cardInfo.parentCard
                    ? this.getCardByAnyId(boardCards, cardInfo.parentCard.id)
                    : null;
                const existsCard = this.getExistsCard(cardInfo, boardCards);

                return {
                    createdCard: existsCard,
                    parentCard,
                    cardInfo,
                };
            })
            .filter(({ createdCard }) => !!createdCard)
            .filter(({ createdCard, parentCard, cardInfo }) => {
                const isParentValid = !parentCard || createdCard.plugin?.parentsCard?.id === parentCard?.id;

                const type = types.find((type) => type?.name === cardInfo.taskType);
                const isTypeValid = !type || createdCard.plugin?.cardType === type.id;

                const cardLabel = cardInfo.label ? this.getBoardLabel(createdCard.labels, cardInfo) : null;
                const isLabelValid = !cardInfo.label || !!cardLabel;

                const metadataSize = cardInfo?.mdTask?.metadata?.size?.toUpperCase();
                const cardSize = this.sizeNames[createdCard.plugin?.estimation];
                const cardSizeValid = !metadataSize || metadataSize === cardSize;

                const metadataPriority = +cardInfo?.mdTask?.metadata?.priority;
                const cardPriority = createdCard.plugin?.severity;
                const cardPriorityValid = isNaN(metadataPriority) || metadataPriority === cardPriority;

                return !isParentValid || !isTypeValid || !isLabelValid || !cardSizeValid || !cardPriorityValid;
            });
    }

    async updateRootDescription(t, currentCard, describedCards, templateDescribedCards) {
        this.log(t, 'Start root card description update...');
        const cardsOnTheBoard = await getExistingCards(t);

        const newDesc = await updateRootDescription(
            currentCard.desc,
            describedCards,
            cardsOnTheBoard,
            templateDescribedCards,
            false,
        );

        const updatedCard = await updateCard(t, currentCard.id, { desc: newDesc }, false);
        this.log(t, `Root card description updated for cards.`, updatedCard);
    }

    getCardsShouldBeCreated(cards, existingCards) {
        return cards.filter(card => {
            const existsCard = this.getExistsCard(card, existingCards);
            return card.shouldHaveCard && !existsCard;
        });
    }

    getParentCard(cards, parentId) {
        return this.getCardByAnyId(cards, parentId);
    }

    getExistsCard(cardDesc, existingCards) {
        return this.getCardByAnyId(existingCards, cardDesc.id);
    }

    getCardByAnyId(cards, targetId) {
        return getCardByAnyId(cards, targetId);
    }

    getCheckListById(checklists, targetId) {
        return getCheckListById(checklists, targetId);
    }

    async addLink(t, fromCard, toCard, fieldName, reverseField, single) {
        if (!single) {
            const links = await t.get(fromCard.id, "shared", fieldName, []);
            await t.set(fromCard.id, "shared", fieldName, [...links, toCard.id]);
        } else {
            await t.set(fromCard.id, "shared", {
                [fieldName]: [toCard.id],
                [fieldName + "Card"]: toCard,
            });
        }
    }

    async getTypeByName(t, typeName) {
        const types = await t.get('board', 'shared', 'boardCardTypes');
        return types.flat().find((type) => type?.name === typeName);
    }

    async getTypeById(t, typeId) {
        const types = await t.get('board', 'shared', 'boardCardTypes');
        return types.flat().find((type) => type?.id === typeId);
    }
}

window.cardGenerator = new CardGenerator();