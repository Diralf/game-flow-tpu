import {getCardByAnyId, getCheckListById} from "./getCardByAnyId.js";
import {updateLegendDescription} from "./updateLegendDescription.js";

String.prototype.spliceSlice = function spliceSlice(index, count, add) {
    // We cannot pass negative indexes directly to the 2nd slicing operation.
    if (index < 0) {
        index = this.length + index;
        if (index < 0) {
            index = 0;
        }
    }

    return this.slice(0, index) + (add || "") + this.slice(index + count);
}

String.prototype.removeSection = function removeSection(section) {
    const startIndex = this.toUpperCase().indexOf(`\n# ${section.toUpperCase()}\n`);
    const endSection = `## END ${section.toUpperCase()}`;
    const endIndex = this.toUpperCase().indexOf(endSection) + endSection.length;
    return this.spliceSlice(startIndex, endIndex - startIndex + 1);
}

export const updateRootDescription = (currentCardDesc, describedCards, cardsOnTheBoard, describedTemplate, isShortFormat) => {
    const hasTemplate = !!currentCardDesc.match(/# TEMPLATE/i);
    let newCardDesc = currentCardDesc
        .slice()
        .replace(/# TASKS.*## END TASKS/is, '')
        .replace(/# LEGEND.*## END LEGEND/is, '')
        .replace(/# TEMPLATE.*## END TEMPLATE/is, '')

    const lines = isShortFormat
        ? updateTasksShortFormat(describedCards, cardsOnTheBoard)
        : updateTasks(describedCards, cardsOnTheBoard);
    const templateLines = describedTemplate ? updateTemplate(describedTemplate) : [];
    const newTemplate = [`# Template\n`, ...templateLines, `\n## End Template`].join('\n');
    const newTasks = [`# Tasks\n`, ...lines, `\n## End Tasks`].join('\n');
    const newLegend = updateLegendDescription();
    return [
        newCardDesc.trim(),
        ...[hasTemplate ? newTemplate : undefined],
        newTasks,
        newLegend
    ]
        .filter(Boolean)
        .join('\n\n')
        .trim();
}

function updateTasks(describedCards, cardsOnTheBoard) {
    const lines = [];
    const orderedDescCards = describedCards.slice().sort((a, b) => {
        return Math.sign(a.mdTask.lineIndex - b.mdTask.lineIndex);
    });

    const log = [];
    let currentLog = '';

    for (const cardDesc of orderedDescCards) {
        currentLog = '';
        currentLog += `START for ${cardDesc.name}\n`;
        const spaces = cardDesc.mdTask.mdLine.indexOf('- ');
        const indentFirst = ' '.repeat(spaces);
        const indent = indentFirst + '  ';
        const labelInName = cardDesc.label ? `**${cardDesc.label}**` : null

        const boardCard = getCardByAnyId(cardsOnTheBoard, cardDesc.id, cardDesc.name);
        const urlLine = boardCard?.shortUrl
            ? `[${cardDesc.name}](${boardCard?.shortUrl})`
            : null;

        const firstLineItems = [labelInName, urlLine ?? cardDesc.name].filter(Boolean).join(' ');
        const firstLine = `${indentFirst}- ${firstLineItems}`
        lines.push(firstLine);
        currentLog += `ADDED first line: ${firstLine}\n`;
        if (cardDesc.mdTask.description) {
            const descriptionLine = cardDesc.mdTask.description
                .split('\n')
                .map((line) => indent + line)
                .join('\n');
            lines.push(descriptionLine);
            currentLog += `ADDED description: ${descriptionLine}\n`;
        }

        const {id, label, checklist, checklistItem, ...metadataWithoutId} = cardDesc.mdTask.metadata ?? {};
        const allMetadata = {
            ...metadataWithoutId,
            ...getNewMetadata(cardsOnTheBoard, cardDesc),
        }
        if (Object.keys(allMetadata).length > 0) {
            const metadataLine = Object
                .entries(allMetadata)
                .filter(([key, value]) => {
                    if (key === 'label') return false;
                    if (key === 'to' && !['MULTI_CHECKLIST_CARD', 'SINGLE_CHECKLIST_CARD'].includes(value))
                        return false;
                    return true;
                })
                .map(([key, value]) => indent + `\`${key}=${value}\``)
                .sort()
            if (metadataLine.length > 0){
                lines.push(metadataLine.join('\n'));
                currentLog += `ADDED metadata: ${metadataLine}\n`;
            }
        }
        log.push(currentLog);
    }
    console.debug(log);
    return lines;
}

function updateTasksShortFormat(describedCards, cardsOnTheBoard) {
    const lines = [];
    const orderedDescCards = describedCards.slice().sort((a, b) => {
        return Math.sign(a.mdTask.lineIndex - b.mdTask.lineIndex);
    });

    const log = [];
    let currentLog = '';

    for (const cardDesc of orderedDescCards) {
        currentLog = '';
        currentLog += `START for ${cardDesc.name}\n`;
        const spaces = cardDesc.mdTask.mdLine.indexOf('- ');
        const indentFirst = ' '.repeat(spaces);
        const indent = indentFirst + '  ';
        const labelInName = cardDesc.label ? `**${cardDesc.label}**` : null

        const boardCard = getCardByAnyId(cardsOnTheBoard, cardDesc.id, cardDesc.name);
        const urlLine = boardCard?.shortUrl
            ? `[${boardCard?.shortUrl}](${boardCard?.shortUrl} "smartCard-inline")`
            : null;

        const {id, label, checklist, checklistItem, ...metadataWithoutId} = cardDesc.mdTask.metadata ?? {};
        const allMetadata = {
            ...metadataWithoutId,
            ...getNewMetadata(cardsOnTheBoard, cardDesc),
        }
        const metadataLine = Object
            .entries(allMetadata)
            .filter(([key, value]) => {
                if (key === 'label') return false;
                if (key === 'to' && !['MULTI_CHECKLIST_CARD', 'SINGLE_CHECKLIST_CARD'].includes(value))
                    return false;
                return true;
            })
            .map(([key, value]) => `${key}=${value}`)
            .sort()

        const metadataParams = [
            ...(urlLine ? [`name=${encodeURI(cardDesc.name)}`] : []),
            ...metadataLine
        ];
        const metadataUrl = metadataParams.length > 0
            ? `[meta](https://metadata/?${metadataParams.join('&')})`
            : null;

        const firstLineParts = [labelInName, urlLine ?? cardDesc.name, metadataUrl].filter(Boolean);
        const firstLine = `${indentFirst}- ${firstLineParts.join(' ')}`
        lines.push(firstLine);
        currentLog += `ADDED first line: ${firstLine}\n`;
        if (cardDesc.mdTask.description) {
            const descriptionLine = cardDesc.mdTask.description
                .split('\n')
                .map((line) => indent + line)
                .join('\n');
            lines.push(descriptionLine);
            currentLog += `ADDED description: ${descriptionLine}\n`;
        }
        log.push(currentLog);
    }
    console.debug(log);
    return lines;
}

const getNewMetadata = (cardsOnTheBoard, cardDesc) => {
    const log = [[`Start ${cardDesc.name}`, cardDesc]];
    const metadata = {};
    const boardCard = getCardByAnyId(cardsOnTheBoard, cardDesc.id, cardDesc.name);
    if (boardCard) {
        log.push(['Card found', boardCard, cardDesc]);
        metadata.id = boardCard.id;
        if (cardDesc.checklistOwnerCard !== cardDesc.id) {
            metadata.to = 'CARD';
        }
    }

    if (!boardCard && cardDesc.checklistOwnerCard) {
        log.push(['Card not found, but have checklist owner', cardDesc]);
        const boardCardOwner = getCardByAnyId(cardsOnTheBoard, cardDesc.checklistOwnerCard.id, cardDesc.checklistOwnerCard.name);
        if (boardCardOwner && (cardDesc.shouldHaveChecklist || cardDesc.mdTask?.metadata?.checklist)) {
            const checklist = getCheckListById(boardCardOwner.checklists, cardDesc.id, cardDesc.name);
            if (checklist) {
                metadata.checklist = checklist.id;
                metadata.to = 'CHECKLIST';
            }
            log.push(['shouldHaveChecklist', checklist]);
        }
        if (boardCardOwner && (cardDesc.shouldHaveChecklistItem || cardDesc.mdTask?.metadata?.checklistItem)) {
            const checklist = getCheckListById(boardCardOwner.checklists, cardDesc.parentCard?.id, cardDesc.parentCard?.name)
                ?? boardCardOwner.checklists.find((checklist) => checklist.name === 'Tasks');
            log.push(['shouldHaveChecklistItem', checklist]);
            if (checklist) {
                if (checklist && !checklist.checkItems) {
                    console.log({boardCardOwner, checklist, cardDesc});
                }
                const checkItem = getCheckListById(checklist.checkItems, cardDesc.id, cardDesc.name);
                log.push(['shouldHaveChecklistItem', checkItem]);
                if (checkItem) {
                    metadata.checklistItem = checkItem.id;
                    metadata.to = 'CHECKLIST_ITEM';
                }
            }
        }
    }

    console.debug(log);

    return metadata;
}

function updateTemplate(describedCards) {
    const lines = [];
    const orderedDescCards = describedCards.slice().sort((a, b) => {
        return Math.sign(a.mdTask.lineIndex - b.mdTask.lineIndex);
    });
    let lastIndex = Math.max(...describedCards.map(cardDesc => {
        const [, idIndex] = cardDesc.mdTask?.metadata?.tid?.split('__') ?? [];
        if (isNaN(idIndex)) {
            return 0;
        }
        return +(idIndex ?? 0);
    }));
    let lastTemplate = null;

    const log = [];
    let currentLog = '';

    for (const cardDesc of orderedDescCards) {
        currentLog = '';
        currentLog += `START for ${cardDesc.name}\n`;
        const spaces = cardDesc.mdTask.mdLine.indexOf('- ');
        const indentFirst = ' '.repeat(spaces);
        const indent = indentFirst + '  ';
        const labelInName = cardDesc.label ? `**${cardDesc.label}** ` : ''

        const firstLine = `${indentFirst}- ${labelInName}${cardDesc.name}`
        lines.push(firstLine);
        currentLog += `ADDED first line: ${firstLine}\n`;
        if (cardDesc.mdTask.description) {
            const descriptionLine = cardDesc.mdTask.description
                .split('\n')
                .map((line) => indent + line)
                .join('\n');
            lines.push(descriptionLine);
            currentLog += `ADDED description: ${descriptionLine}\n`;
        }

        const metadataWithoutId = cardDesc.mdTask.metadata ?? {};
        if (cardDesc.mdTask.fromTemplate) {
            lastTemplate = cardDesc.mdTask.fromTemplate;
        }

        let templateId = {};
        if (lastTemplate && !cardDesc.mdTask.fromTemplate && !cardDesc.mdTask?.metadata?.tid) {
            lastIndex += 1;
            templateId = {
                tid: `${lastTemplate}__${lastIndex}`,
            };
        }
        const allMetadata = {
            ...templateId,
            ...metadataWithoutId,
        }
        if (Object.keys(allMetadata).length > 0) {
            const metadataLine = Object
                .entries(allMetadata)
                .filter(([key]) => !['label', 'to'].includes(key))
                .map(([key, value]) => indent + `\`${key}=${value}\``)
                .sort()
            if (metadataLine.length > 0){
                lines.push(metadataLine.join('\n'));
                currentLog += `ADDED metadata: ${metadataLine}\n`;
            }
        }
        log.push(currentLog);
    }
    // console.log(log);
    return lines;
}
