import {jsonToCardsList, legendJsonToArray} from "./json-to-cards-list.js";
import {markdownToJson} from "./markdown-to-json.js";

describe('json-to-cards-list', function () {
    it('Should get array from legend', () => {
        const result = legendJsonToArray([{
            mdLine: "- FEATURE",
            name: 'FEATURE',
            children: [{
                mdLine: "  - PART",
                name: 'PART',
                children: [{
                    mdLine: "    - TASK",
                    name: 'TASK',
                    children: [{
                        mdLine: "      - SUB-TASK",
                        name: 'SUB-TASK',
                    }]
                }]
            }]
        }]);

        expect(result).toEqual(['FEATURE', 'PART', 'TASK', 'SUB-TASK']);
    });

    it.each([
        {
            desc: 'single name',
            initDesc: `- Some Feature 1`,
            expected: [{
                "checklistOwnerCard": null,
                "deepForCheckList": null,
                "id": "TEMP_test_card_0",
                "mdTask": {
                    "lineIndex": 7,
                    "mdLine": "- Some Feature 1",
                    "name": "Some Feature 1"
                },
                "name": "Some Feature 1",
                "parentCard": { id: "test_card" },
                "parentId": "test_card",
                "shouldHaveCard": false,
                "shouldHaveChecklist": false,
                "shouldHaveChecklistItem": false,
                "shouldHaveChildrenCards": false,
                "taskType": "FEATURE"
            }]
        },
        {
            desc: 'with parent name',
            initDesc: `- Some Feature 1\n  - Some Part 1`,
            expected: [
                {
                    "id": "TEMP_test_card_0",
                    "name": "Some Feature 1",
                    "taskType": "FEATURE"
                },
                {
                    "id": "TEMP_test_card_0_0",
                    "name": "Some Part 1",
                    "parentCard": expect.objectContaining({
                        "id": "TEMP_test_card_0",
                        "name": "Some Feature 1",
                    }),
                    "parentId": "TEMP_test_card_0",
                    "taskType": "PART"
                }
            ]
        },
        {
            desc: 'with id',
            initDesc: `- Some Feature 1\n\`id=123\``,
            expected: [{
                "id": "123",
                "name": "Some Feature 1",
                "mdTask": {
                    "lineIndex": 7,
                    "mdLine": "- Some Feature 1",
                    "name": "Some Feature 1",
                    "metadata": { id: '123' }
                },
            }]
        },
        {
            desc: 'with label',
            initDesc: `- Some Feature 1\n\`label=ART\``,
            expected: [{
                "id": "TEMP_test_card_0",
                "name": "Some Feature 1",
                label: 'ART',
                "mdTask": {
                    "lineIndex": 7,
                    "mdLine": "- Some Feature 1",
                    "name": "Some Feature 1",
                    "metadata": { label: 'ART' }
                },
            }]
        },
        {
            desc: 'with target CARD',
            initDesc: `- Some Feature 1 \`to=CARD\``,
            expected: [{
                "id": "TEMP_test_card_0",
                "name": "Some Feature 1",
                "shouldHaveCard": true,
            }]
        },
        {
            desc: 'with target ALL_CARDS',
            initDesc: `
- Some Feature 1 \`to=ALL_CARDS\`
  - Some Part 1
    - Some Task 1
    - Some Task 2`,
            expected: [
                {
                    "id": "TEMP_test_card_0",
                    "name": "Some Feature 1",
                    "shouldHaveCard": true,
                    "shouldHaveChildrenCards": true,
                },
                {
                    "id": "TEMP_test_card_0_0",
                    "name": "Some Part 1",
                    parentId: "TEMP_test_card_0",
                    "shouldHaveCard": true,
                    "shouldHaveChildrenCards": true,
                    "taskType": "PART"
                },
                {
                    "id": "TEMP_test_card_0_0_0",
                    "name": "Some Task 1",
                    parentId: "TEMP_test_card_0_0",
                    "shouldHaveCard": true,
                    "shouldHaveChildrenCards": true,
                    "taskType": "TASK"
                },
                {
                    "id": "TEMP_test_card_0_0_1",
                    "name": "Some Task 2",
                    parentId: "TEMP_test_card_0_0",
                    "shouldHaveCard": true,
                    "shouldHaveChildrenCards": true,
                    "taskType": "TASK"
                }
            ]
        },
        {
            desc: 'with target MULTI_CHECKLIST_CARD',
            initDesc: `
- Some Feature 1 \`to=MULTI_CHECKLIST_CARD\`
  - Some Part 1
    - Some Task 1
    - Some Task 2`,
            expected: [
                {
                    "id": "TEMP_test_card_0",
                    "name": "Some Feature 1",
                    "shouldHaveCard": true,
                    "checklistOwnerCard": "TEMP_test_card_0",
                    "deepForCheckList": 1,
                },
                {
                    "id": "TEMP_test_card_0_0",
                    "name": "Some Part 1",
                    parentId: "TEMP_test_card_0",
                    "taskType": "PART",
                    "deepForCheckList": 2,
                    "shouldHaveChecklist": true,
                    "checklistOwnerCard": expect.objectContaining({ id: "TEMP_test_card_0" }),
                },
                {
                    "id": "TEMP_test_card_0_0_0",
                    "name": "Some Task 1",
                    parentId: "TEMP_test_card_0_0",
                    "taskType": "TASK",
                    "deepForCheckList": 3,
                    "shouldHaveChecklistItem": true,
                    "checklistOwnerCard": expect.objectContaining({ id: "TEMP_test_card_0" }),
                },
                {
                    "id": "TEMP_test_card_0_0_1",
                    "name": "Some Task 2",
                    parentId: "TEMP_test_card_0_0",
                    "taskType": "TASK",
                    "deepForCheckList": 3,
                    "shouldHaveChecklistItem": true,
                    "checklistOwnerCard": expect.objectContaining({ id: "TEMP_test_card_0" }),
                }
            ]
        },
        {
            desc: 'with target SINGLE_CHECKLIST_CARD',
            initDesc: `
- Some Feature 1 \`to=SINGLE_CHECKLIST_CARD\`
  - Some Part 1
    - Some Task 1
    - Some Task 2`,
            expected: [
                {
                    "id": "TEMP_test_card_0",
                    "name": "Some Feature 1",
                    "shouldHaveCard": true,
                    "checklistOwnerCard": "TEMP_test_card_0",
                    "deepForCheckList": 2,
                },
                {
                    "id": "TEMP_test_card_0_0",
                    "name": "Some Part 1",
                    parentId: "TEMP_test_card_0",
                    "taskType": "PART",
                    "deepForCheckList": 3,
                    "shouldHaveChecklistItem": true,
                    "checklistOwnerCard": expect.objectContaining({ id: "TEMP_test_card_0" }),
                },
                {
                    "id": "TEMP_test_card_0_0_0",
                    "name": "Some Task 1",
                    parentId: "TEMP_test_card_0_0",
                    "taskType": "TASK",
                    "deepForCheckList": 4,
                    "shouldHaveChecklistItem": true,
                    "checklistOwnerCard": expect.objectContaining({ id: "TEMP_test_card_0" }),
                },
                {
                    "id": "TEMP_test_card_0_0_1",
                    "name": "Some Task 2",
                    parentId: "TEMP_test_card_0_0",
                    "taskType": "TASK",
                    "deepForCheckList": 4,
                    "shouldHaveChecklistItem": true,
                    "checklistOwnerCard": expect.objectContaining({ id: "TEMP_test_card_0" }),
                }
            ]
        },
        {
            desc: 'with target ALL_CARDS and SINGLE_CHECKLIST_CARD',
            initDesc: `
- Some Feature 1 \`to=ALL_CARDS\`
  - Some Part 1
    - Some Task 1 \`to=SINGLE_CHECKLIST_CARD\`
        - Some Sub-Task 1`,
            expected: [
                {
                    "id": "TEMP_test_card_0",
                    "name": "Some Feature 1",
                    shouldHaveCard: true,
                    shouldHaveChildrenCards: true,
                },
                {
                    "id": "TEMP_test_card_0_0",
                    "name": "Some Part 1",
                    "parentId": "TEMP_test_card_0",
                    "taskType": "PART",
                    shouldHaveCard: true,
                    shouldHaveChildrenCards: true,
                },
                {
                    "id": "TEMP_test_card_0_0_0",
                    "name": "Some Task 1",
                    "parentId": "TEMP_test_card_0_0",
                    "taskType": "TASK",
                    shouldHaveCard: true,
                    shouldHaveChildrenCards: false,
                    deepForCheckList: 2,
                    checklistOwnerCard: 'TEMP_test_card_0_0_0',
                },
                {
                    "id": "TEMP_test_card_0_0_0_0",
                    "name": "Some Sub-Task 1",
                    "parentId": "TEMP_test_card_0_0_0",
                    shouldHaveCard: false,
                    "taskType": "SUB-TASK",
                    deepForCheckList: 3,
                    shouldHaveChecklistItem: true,
                    "checklistOwnerCard": expect.objectContaining({ id: "TEMP_test_card_0_0_0" }),
                }
            ]
        },
        {
            desc: 'with target MULTI_CHECKLIST_CARD and one of them is CARD',
            initDesc: `
- Some Feature 1 \`to=MULTI_CHECKLIST_CARD\`
  - Some Part 1 \`to=CHECKLIST\`
    - Some Task 1 \`to=CHECKLIST_ITEM\`
    - Some Task 2 \`to=CARD\``,
            expected: [
                {
                    "name": "Some Feature 1",
                    shouldHaveCard: true,
                    checklistOwnerCard: 'TEMP_test_card_0',
                    deepForCheckList: 1,
                },
                {
                    "name": "Some Part 1",
                    "taskType": "PART",
                    deepForCheckList: 2,
                    shouldHaveCard: false,
                    shouldHaveChecklist: true,
                    "checklistOwnerCard": expect.objectContaining({ id: "TEMP_test_card_0" }),
                    "parentId": "TEMP_test_card_0",
                },
                {
                    "name": "Some Task 1",
                    "taskType": "TASK",
                    shouldHaveCard: false,
                    deepForCheckList: 3,
                    shouldHaveChecklistItem: true,
                    "checklistOwnerCard": expect.objectContaining({ id: "TEMP_test_card_0" }),
                    "parentId": "TEMP_test_card_0_0",
                },
                {
                    "name": "Some Task 2",
                    "taskType": "TASK",
                    shouldHaveCard: true,
                    deepForCheckList: 3,
                    shouldHaveChecklistItem: false,
                    "checklistOwnerCard": expect.objectContaining({ id: "TEMP_test_card_0" }),
                    "parentId": "TEMP_test_card_0_0",
                }
            ]
        },
    ])('should convert to cards array $desc', ({initDesc, expected}) => {
        const getDesc = (tasks) => `Some description
# Legend
- FEATURE
  - PART
    - TASK
      - SUB-TASK
## End Legend
# TASKS
${tasks}
## End Tasks
`;
        const defaultCard = {
            "checklistOwnerCard": null,
            "deepForCheckList": null,
            "parentId": "test_card",
            "shouldHaveCard": false,
            "shouldHaveChecklist": false,
            "shouldHaveChecklistItem": false,
            "shouldHaveChildrenCards": false,
            "taskType": "FEATURE"
        };

        const initialDesc = getDesc(initDesc);
        const { legendJson, tasksJson } = markdownToJson(initialDesc);
        const describedCards = jsonToCardsList(legendJson, tasksJson, 'test_card');

        expect(describedCards).toMatchObject(expected.map(exp => ({
            ...defaultCard,
            ...exp,
        })));
    });
});