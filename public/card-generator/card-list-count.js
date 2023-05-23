import {markdownToJson} from "./markdown-to-json.js";
import {jsonToCardsList} from "./json-to-cards-list.js";
import {tasksJsonWithTemplates} from "./tasks-json-with-templates.js";

export const cardListCount = (mdText) => {
    const { legendJson, tasksJson, templateJson } = markdownToJson(mdText);
    const tasksJsonWithTemp = tasksJsonWithTemplates(tasksJson, templateJson);
    const describedCards = jsonToCardsList(legendJson, tasksJsonWithTemp, 'test_card')
        .filter(cardDesc => {
            const metadata = cardDesc.mdTask?.metadata;
            return !metadata?.id && !metadata?.checklist && !metadata?.checklistItem && !cardDesc.mdTask?.fromTemplate;
        });
    return describedCards.length;
}