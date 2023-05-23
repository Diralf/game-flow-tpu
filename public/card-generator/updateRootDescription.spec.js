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
            desc: 'remove invalid URL',
            initDesc: `- [Some Feature 1](test://123 "")\n\`id=123\``,
            expected: `- Some Feature 1`,
            cards: []
        },
        {
            desc: 'remove invalid URL with double name',
            initDesc: `- Explicit Name [Some Feature 1](test://123 "")\n\`id=123\``,
            expected: `- Explicit Name`,
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

- **ART** [Some Feature 1](test://123)
  Some description
  \`id=123\``,
            cards: [{ name: 'Some Feature 1', desc: 'Card description `tempId=TEMP_test_card_0`', id: '123'}]
        },
        {
            desc: 'move url',
            initDesc: `- [test://123](test://123) Some Feature 1\nSome description`,
            expected: `# Tasks

- [Some Feature 1](test://123)
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

- [Some Feature 1](test://123)
  \`id=123\`
  - [Some Part 1](test://1231)
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

- [Some Feature 1](test://123)
  \`id=123\`
  \`to=MULTI_CHECKLIST_CARD\`
  - Some Part 1
    \`checklist=1231\`
    - Some Task 1
      \`checklistItem=12311\`
    - Some Task 2
      \`checklistItem=12312\``,
            cards: [
                {
                    name: 'Some Feature 1',
                    desc: 'Card description',
                    id: '123',
                    checklists: [{
                        id: '1231',
                        name: 'Some Part 1',
                        checkItems: [
                            {
                                id: '12311',
                                name: 'Some Task 1',
                            },
                            {
                                id: '12312',
                                name: 'Some Task 2',
                            }
                        ]
                    }]
                },
            ]
        },
        {
            desc: 'should convert to short format',
            isShortFormat: true,
            initDesc: `# Tasks

- Some Feature 1 [test://123](test://123 "smartCard-inline")
  \`id=123\`
  \`to=MULTI_CHECKLIST_CARD\`
  - Some Part 1
    \`checklist=1231\`
    - Some Task 1
      \`checklistItem=12311\`
    - Some Task 2
      \`checklistItem=12312\``,
            expected: `# Tasks

- [test://123](test://123 "smartCard-inline") [meta](https://metadata/?name=Some%20Feature%201&id=123&to=MULTI_CHECKLIST_CARD)
  - Some Part 1 [meta](https://metadata/?checklist=1231)
    - Some Task 1 [meta](https://metadata/?checklistItem=12311)
    - Some Task 2 [meta](https://metadata/?checklistItem=12312)`,
            cards: [
                {
                    name: 'Some Feature 1',
                    desc: 'Card description',
                    id: '123',
                    checklists: [{
                        id: '1231',
                        name: 'Some Part 1',
                        checkItems: [
                            {
                                id: '12311',
                                name: 'Some Task 1',
                            },
                            {
                                id: '12312',
                                name: 'Some Task 2',
                            }
                        ]
                    }]
                },
            ]
        },
        {
            desc: 'should convert to raw value when card removed',
            isShortFormat: true,
            initDesc: `# Tasks

- [test://123](test://123 "smartCard-inline") [meta](https://metadata/?name=Some%20Feature%201&id=123&to=MULTI_CHECKLIST_CARD)
  - Some Part 1 [meta](https://metadata/?checklist=1231)
    - Some Task 1 [meta](https://metadata/?checklistItem=12311)
    - Some Task 2 [meta](https://metadata/?checklistItem=12312)`,
            expected: `# Tasks

- Some Feature 1 [meta](https://metadata/?to=MULTI_CHECKLIST_CARD)
  - Some Part 1
    - Some Task 1
    - Some Task 2`,
            cards: []
        }
    ])('Should update $desc', ({initDesc, isShortFormat = false, expected, cards}) => {
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
- Estimations
  - \`size=XL\`
  - \`size=L\`
  - \`size=M\`
  - \`size=S\`

## End Legend`;
        const initialDesc = getDesc(initDesc);
        const { legendJson, tasksJson } = markdownToJson(initialDesc);
        const describedCards = jsonToCardsList(legendJson, tasksJson, 'test_card');
        const cardsOnTheBoard = cards.map(card => ({
            shortUrl: `test://${card.id}`,
            ...card,
        }));
        const result = updateRootDescription(initialDesc, describedCards, cardsOnTheBoard, null, isShortFormat);

        expect(result).toEqual(getDesc(expected));
    });

    it.each([
        {
            desc: 'template by ids',
            initTemplate: `
- \`TEMPLATE\`
  - Some Part 1
    - **ART** Some Task 1
  - Some Part 2`,
            expTemplate: `
- \`TEMPLATE\`
  - Some Part 1
    \`tid=TEMPLATE__1\`
    - **ART** Some Task 1
      \`tid=TEMPLATE__2\`
  - Some Part 2
    \`tid=TEMPLATE__3\``,
        },
        {
            desc: 'template by ids for new item',
            initTemplate: `
- \`TEMPLATE\`
  - Some Part 1
    \`tid=TEMPLATE__1\`
    - Some Task 1
      \`tid=TEMPLATE__2\`
    - Some Task 2  
  - Some Part 2
    \`tid=TEMPLATE__3\``,
            expTemplate: `
- \`TEMPLATE\`
  - Some Part 1
    \`tid=TEMPLATE__1\`
    - Some Task 1
      \`tid=TEMPLATE__2\`
    - Some Task 2
      \`tid=TEMPLATE__4\`
  - Some Part 2
    \`tid=TEMPLATE__3\``,
        }
    ])('Should update template $desc', ({initTemplate, expTemplate, cards = []}) => {
        const getDesc = (template) => `Some description

# Template
${template}

## End Template

# Tasks

- Some Feature 1
  - \`TEMPLATE\`

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
- Estimations
  - \`size=XL\`
  - \`size=L\`
  - \`size=M\`
  - \`size=S\`

## End Legend`;
        const initialDesc = getDesc(initTemplate);
        const { legendJson, tasksJson, templateJson } = markdownToJson(initialDesc);
        const describedCards = jsonToCardsList(legendJson, tasksJson, 'test_card');
        const templateDescribedCards = jsonToCardsList(legendJson, templateJson, 'test_card' + '_template');
        const cardsOnTheBoard = cards.map(card => ({
            shortUrl: `test://${card.id}`,
            ...card,
        }));
        const result = updateRootDescription(initialDesc, describedCards, cardsOnTheBoard, templateDescribedCards);

        expect(result).toEqual(getDesc(expTemplate));
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

- [TEST Общее](https://trello.com/c/1matJXSM)
  \`id=6450c25f7ee6245502d18929\`
  \`to=MULTI_CHECKLIST_CARD\`
  - TEST Режим заставки
    - **CODE** TEST Сделать режим показа заставки
    - **CODE** TEST Сделать перемещение энтитей по сценарию
      Some description
    - **CODE** TEST Сделать триггер начала заставки
      Some description 1
      Some description 2
    - TEST Сделать возвращение к игре
- [TEST Предыстории](https://trello.com/c/Fuw5iRJi)
  \`id=6450c25f3e30ea6ea88c93f8\`
  - [TEST Far Away](https://trello.com/c/QHkV0I52)
    \`id=6450c260edff52e2f83656c8\`
  - [TEST Long Ago](https://trello.com/c/WdXzNcWt)
    \`id=6450c2607429515c90a640a4\`
- [TEST Начало катастрофы](https://trello.com/c/yX7Eo18q)
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
- Estimations
  - \`size=XL\`
  - \`size=L\`
  - \`size=M\`
  - \`size=S\`

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

    it('Should fix bug with unlinked checklist', () => {
        const mdText = `# Tasks

- [https://trello.com/c/1matJXSM](https://trello.com/c/1matJXSM "smartCard-inline") TEST Общее
  \`id=11\`
  \`to=MULTI_CHECKLIST_CARD\`
  - TEST Режим заставки
    \`checklist=111\`
    - **CODE** TEST Сделать режим показа заставки
      \`checklistItem=1111\`
    - **CODE** TEST Сделать перемещение энтитей по сценарию
      Some description
      \`checklistItem=2222\`
    - **CODE** TEST Сделать триггер начала заставки
      Some description 1
      Some description 2
      \`checklistItem=3333\`
    - TEST Сделать возвращение к игре
      \`checklistItem=4444\`

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
- Estimations
  - \`size=XL\`
  - \`size=L\`
  - \`size=M\`
  - \`size=S\`

## End Legend`;

        const expectedText = `# Tasks

- [TEST Общее](https://trello.com/c/1matJXSM)
  \`id=11\`
  \`to=MULTI_CHECKLIST_CARD\`
  - TEST Режим заставки
    \`checklist=111\`
    - **CODE** TEST Сделать режим показа заставки
      \`checklistItem=1111\`
    - **CODE** TEST Сделать перемещение энтитей по сценарию
      Some description
      \`checklistItem=2222\`
    - **CODE** TEST Сделать триггер начала заставки
      Some description 1
      Some description 2
      \`checklistItem=3333\`
    - TEST Сделать возвращение к игре
      \`checklistItem=4444\`

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
- Estimations
  - \`size=XL\`
  - \`size=L\`
  - \`size=M\`
  - \`size=S\`

## End Legend`;

        const { legendJson, tasksJson } = markdownToJson(mdText);
        const describedCards = jsonToCardsList(legendJson, tasksJson, 'test_card');
        const cardsOnTheBoard = [
            {
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
                "id": "11",
                "name": "TEST Общее",
                "shortLink": "1matJXSM",
                "url": "https://trello.com/c/1matJXSM/515-test-%D0%BE%D0%B1%D1%89%D0%B5%D0%B5",
                "labels": [],
                "checklists": [{
                    id: '111',
                    name: 'TEST Режим заставки',
                    checkItems: [
                        {
                            id: '1111',
                            name: '**CODE** TEST Сделать режим показа заставки'
                        },
                        {
                            id: '2222',
                            name: '**CODE** TEST Сделать перемещение энтитей по сценарию'
                        },
                        {
                            id: '3333',
                            name: '**CODE** TEST Сделать триггер начала заставки'
                        },
                        {
                            id: '4444',
                            name: 'TEST Сделать возвращение к игре'
                        },
                    ]
                }],
                "shortUrl": "https://trello.com/c/1matJXSM",
                "parentName": "Test",
            }]

        const result = updateRootDescription(mdText, describedCards, cardsOnTheBoard);

        expect(result).toEqual(expectedText);
    })
});