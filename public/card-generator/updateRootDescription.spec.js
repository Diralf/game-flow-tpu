import {updateRootDescription} from "./updateRootDescription.js";
import {markdownToJson} from "./markdown-to-json.js";
import {jsonToCardsList} from "./json-to-cards-list.js";

describe('updateRootDescription', () => {
    it.each([
        {
            desc: 'nothing',
            initDesc: `- Some Feature 1`,
            expected: `- Some Feature 1`,
            cards: []
        },
        {
            desc: 'order saved',
            initDesc: `# Tasks
- Some Feature 1
  - Some Part 1
- Some Feature 2
  - Some Part 2`,
            expected: `# Tasks

- Some Feature 1
  - Some Part 1
- Some Feature 2
  - Some Part 2`,
            cards: []
        },
        {
            desc: 'move label to chip',
            initDesc: `- **ART** Some Feature 1`,
            expected: `- **ART** Some Feature 1`,
            cards: []
        },
        {
            desc: 'move label chip to bottom chip',
            initDesc: `- Some Feature 1 \`label=ART\``,
            expected: `- **ART** Some Feature 1`,
            cards: []
        },
        {
            desc: 'remove invalid id',
            initDesc: `- Some Feature 1 \`id=123\``,
            expected: `- Some Feature 1`,
            cards: []
        },
        {
            desc: 'keep initial description',
            initDesc: `- **ART** Some Feature 1\nSome description`,
            expected: `# Tasks

- **ART** Some Feature 1
  Some description`,
            cards: []
        },
        {
            desc: 'keep initial description when card created',
            initDesc: `- **ART** Some Feature 1\nSome description`,
            expected: `# Tasks

- **ART** [test://123](test://123 "smartCard-inline") Some Feature 1
  Some description
  \`id=123\``,
            cards: [{ name: 'Some Feature 1', desc: 'Card description `tempId=TEMP_test_card_0`', id: '123'}]
        },
        {
            desc: 'move url',
            initDesc: `- [test://123](test://123) Some Feature 1\nSome description`,
            expected: `# Tasks

- [test://123](test://123 "smartCard-inline") Some Feature 1
  Some description
  \`id=123\``,
            cards: [{ name: 'Some Feature 1', desc: 'Card description `tempId=TEMP_test_card_0`', id: '123'}]
        },
        {
            desc: 'remove wrong id',
            initDesc: `- #E1F1 Some Feature 1`,
            expected: `- Some Feature 1`,
            cards: []
        },
        {
            desc: 'remove checklist mark',
            initDesc: `- [x] Some Feature 1`,
            expected: `- Some Feature 1`,
            cards: []
        },
        {
            desc: 'mark all created cards with target',
            initDesc: `# Tasks

- Some Feature 1 \`to=ALL_CARDS\`
  - Some Part 1`,
            expected: `# Tasks

- [test://123](test://123 "smartCard-inline") Some Feature 1
  \`id=123\`
  - [test://1231](test://1231 "smartCard-inline") Some Part 1
    \`id=1231\``,
            cards: [
                { name: 'Some Feature 1', desc: 'Card description `tempId=TEMP_test_card_0`', id: '123'},
                { name: 'Some Part 1', desc: 'Card description `tempId=TEMP_test_card_0_0`', id: '1231'}
            ]
        },
        {
            desc: 'mark all created cards with checklist target',
            initDesc: `# Tasks

- Some Feature 1 \`to=MULTI_CHECKLIST_CARD\`
  - Some Part 1
    - Some Task 1
    - Some Task 2`,
            expected: `# Tasks

- [test://123](test://123 "smartCard-inline") Some Feature 1
  \`id=123\`
  - Some Part 1
    \`checklist=1231\`
    - Some Task 1
      \`checklistItem=12311\`
    - Some Task 2
      \`checklistItem=12312\``,
            cards: [
                {
                    name: 'Some Feature 1',
                    desc: 'Card description\n`tempId=TEMP_test_card_0`',
                    id: '123',
                    checklists: [{
                        id: '1231',
                        name: 'Some Part 1 `tempId=TEMP_test_card_0_0`',
                        checkItems: [
                            {
                                id: '12311',
                                name: 'Some Task 1 `tempId=TEMP_test_card_0_0_0`',
                            },
                            {
                                id: '12312',
                                name: 'Some Task 2 `tempId=TEMP_test_card_0_0_1`',
                            }
                        ]
                    }]
                },
            ]
        },
    ])('Should update $desc', ({initDesc, expected, cards}) => {
        const getDesc = (tasks) => `Some description

${tasks.includes('# Tasks') ? tasks : '# Tasks\n\n' + tasks}

## End Tasks

# Legend

- FEATURE
  - PART
    - TASK
      - SUB-TASK
- Target types
  - \`to=CARD\`
  - \`to=ALL_CARDS\`
  - \`to=MULTI_CHECKLIST_CARD\`
  - \`to=SINGLE_CHECKLIST_CARD\`
  - \`to=CHECKLIST\`
  - \`to=CHECKLIST_ITEM\`

## End Legend`;
        const initialDesc = getDesc(initDesc);
        const { legendJson, tasksJson } = markdownToJson(initialDesc);
        const describedCards = jsonToCardsList(legendJson, tasksJson, 'test_card');
        const cardsOnTheBoard = cards.map(card => ({
            shortUrl: `test://${card.id}`,
            ...card,
        }));
        const result = updateRootDescription(initialDesc, describedCards, cardsOnTheBoard);

        expect(result).toEqual(getDesc(expected));
    });

    it('Should fix bug with extra sections', () => {
        const mdText = `# Tasks

- [https://trello.com/c/1matJXSM](https://trello.com/c/1matJXSM "smartCard-inline") TEST Общее
  \`id=6450c25f7ee6245502d18929\`
  \`to=MULTI_CHECKLIST_CARD\`
  - TEST Режим заставки
    \`to=CHECKLIST\`
    - **CODE** TEST Сделать режим показа заставки
      \`to=CHECKLIST_ITEM\`
    - **CODE** TEST Сделать перемещение энтитей по сценарию
      Some description
      \`to=CHECKLIST_ITEM\`
    - **CODE** TEST Сделать триггер начала заставки
      Some description 1
      Some description 2
      \`to=CHECKLIST_ITEM\`
    - TEST Сделать возвращение к игре
      \`to=CHECKLIST_ITEM\`
- [https://trello.com/c/Fuw5iRJi](https://trello.com/c/Fuw5iRJi "smartCard-inline") TEST Предыстории
  \`id=6450c25f3e30ea6ea88c93f8\`
  \`to=CARD\`
  - [https://trello.com/c/QHkV0I52](https://trello.com/c/QHkV0I52 "smartCard-inline") TEST Far Away
    \`id=6450c260edff52e2f83656c8\`
    \`to=CARD\`
  - [https://trello.com/c/WdXzNcWt](https://trello.com/c/WdXzNcWt "smartCard-inline") TEST Long Ago
    \`id=6450c2607429515c90a640a4\`
    \`to=CARD\`
- [https://trello.com/c/yX7Eo18q](https://trello.com/c/yX7Eo18q "smartCard-inline") TEST Начало катастрофы
  Some very long description
  Very long
  \`id=6450c26067a2c38a2899e151\`
  \`to=CARD\`
- TEST Концовка

## End Tasks

# Legend

- FEATURE
  - PART
    - TASK
      - SUB-TASK
- Target types
  - \`to=CARD\`
  - \`to=ALL_CARDS\`
  - \`to=MULTI_CHECKLIST_CARD\`
  - \`to=SINGLE_CHECKLIST_CARD\`
  - \`to=CHECKLIST\`
  - \`to=CHECKLIST_ITEM\`

## End Legend`;

        const expectedText = `# Tasks

- [https://trello.com/c/1matJXSM](https://trello.com/c/1matJXSM "smartCard-inline") TEST Общее
  \`id=6450c25f7ee6245502d18929\`
  - TEST Режим заставки
    - **CODE** TEST Сделать режим показа заставки
    - **CODE** TEST Сделать перемещение энтитей по сценарию
      Some description
    - **CODE** TEST Сделать триггер начала заставки
      Some description 1
      Some description 2
    - TEST Сделать возвращение к игре
- [https://trello.com/c/Fuw5iRJi](https://trello.com/c/Fuw5iRJi "smartCard-inline") TEST Предыстории
  \`id=6450c25f3e30ea6ea88c93f8\`
  - [https://trello.com/c/QHkV0I52](https://trello.com/c/QHkV0I52 "smartCard-inline") TEST Far Away
    \`id=6450c260edff52e2f83656c8\`
  - [https://trello.com/c/WdXzNcWt](https://trello.com/c/WdXzNcWt "smartCard-inline") TEST Long Ago
    \`id=6450c2607429515c90a640a4\`
- [https://trello.com/c/yX7Eo18q](https://trello.com/c/yX7Eo18q "smartCard-inline") TEST Начало катастрофы
  Some very long description
  Very long
  \`id=6450c26067a2c38a2899e151\`
- TEST Концовка

## End Tasks

# Legend

- FEATURE
  - PART
    - TASK
      - SUB-TASK
- Target types
  - \`to=CARD\`
  - \`to=ALL_CARDS\`
  - \`to=MULTI_CHECKLIST_CARD\`
  - \`to=SINGLE_CHECKLIST_CARD\`
  - \`to=CHECKLIST\`
  - \`to=CHECKLIST_ITEM\`

## End Legend`;

        const { legendJson, tasksJson } = markdownToJson(mdText);
        const describedCards = jsonToCardsList(legendJson, tasksJson, 'test_card');
        const cardsOnTheBoard = [{
            "id": "644d48b1f977681fdc52a54d",
            "name": "Test",
            "shortLink": "2LToqcoJ",
            "url": "https://trello.com/c/2LToqcoJ/504-test",
            "labels": [],
            "checklists": [],
            "shortUrl": "https://trello.com/c/2LToqcoJ",
            "parentName": null,
        },
            {
                "id": "6450c25f7ee6245502d18929",
                "name": "TEST Общее",
                "shortLink": "1matJXSM",
                "url": "https://trello.com/c/1matJXSM/515-test-%D0%BE%D0%B1%D1%89%D0%B5%D0%B5",
                "labels": [],
                "checklists": [],
                "shortUrl": "https://trello.com/c/1matJXSM",
                "parentName": "Test",
            },
            {
                "id": "6450c25f3e30ea6ea88c93f8",
                "name": "TEST Предыстории",
                "shortLink": "Fuw5iRJi",
                "url": "https://trello.com/c/Fuw5iRJi/516-test-%D0%BF%D1%80%D0%B5%D0%B4%D1%8B%D1%81%D1%82%D0%BE%D1%80%D0%B8%D0%B8",
                "labels": [],
                "checklists": [],
                "shortUrl": "https://trello.com/c/Fuw5iRJi",
                "parentName": "Test",
            },
            {
                "id": "6450c26067a2c38a2899e151",
                "name": "TEST Начало катастрофы",
                "shortLink": "yX7Eo18q",
                "url": "https://trello.com/c/yX7Eo18q/517-test-%D0%BD%D0%B0%D1%87%D0%B0%D0%BB%D0%BE-%D0%BA%D0%B0%D1%82%D0%B0%D1%81%D1%82%D1%80%D0%BE%D1%84%D1%8B",
                "labels": [],
                "checklists": [],
                "shortUrl": "https://trello.com/c/yX7Eo18q",
                "parentName": "Test",
            },
            {
                "id": "6450c260edff52e2f83656c8",
                "name": "TEST Far Away",
                "shortLink": "QHkV0I52",
                "url": "https://trello.com/c/QHkV0I52/518-test-far-away",
                "labels": [],
                "checklists": [],
                "shortUrl": "https://trello.com/c/QHkV0I52",
                "parentName": "TEST Предыстории",
            },
            {
                "id": "6450c2607429515c90a640a4",
                "name": "TEST Long Ago",
                "shortLink": "WdXzNcWt",
                "url": "https://trello.com/c/WdXzNcWt/519-test-long-ago",
                "labels": [],
                "checklists": [],
                "shortUrl": "https://trello.com/c/WdXzNcWt",
                "parentName": "TEST Предыстории",
            }]

        const result = updateRootDescription(mdText, describedCards, cardsOnTheBoard);

        expect(result).toEqual(expectedText);
    })
});