import {getTemplatedCounts} from "./template-of-tasks.js";
import {cardListCount} from "./card-list-count.js";
import {markdownToJson} from "./markdown-to-json.js";
import {tasksJsonWithTemplates} from "./tasks-json-with-templates.js";

window.getTemplatedCounts = getTemplatedCounts;
window.cardListCount = cardListCount;
window.markdownToJson = markdownToJson;
window.tasksJsonWithTemplates = tasksJsonWithTemplates;