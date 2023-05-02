import {markdownToJson} from "./markdown-to-json.js";
import {jsonToCardsList} from "./json-to-cards-list.js";
import {getTemplatedCounts} from "./template-of-tasks.js";

export const cardListCount = (mdText) => {
    const { legendJson, tasksJson } = markdownToJson(mdText);
    const describedCards = jsonToCardsList(legendJson, tasksJson, 'test_card')
        .filter(cardDesc => {
            const metadata = cardDesc.mdTask?.metadata;
            return !metadata?.id && !metadata?.checklist && !metadata?.checklistItem && !cardDesc.mdTask?.fromTemplate;
        });
    const templatedCount = getTemplatedCounts(mdText);
    return describedCards.length + templatedCount;
}