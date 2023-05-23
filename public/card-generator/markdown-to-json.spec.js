import {markdownToJson} from "./markdown-to-json.js";

describe('template of tasks', function () {
    it('should be follow the structure', () => {
        const mdText = `Some description
# Legend
- FEATURE
  - PART
    - TASK
      - SUB-TASK
## End Legend
# TASKS
- Some Feature 1
  - Some Part 1
    - Some Task 1
    Some Task 1 Description
    Continue Some Task 1 Description
    [https://url](http://url "smart")
    \`id=123\` \`label=ART\` \`to=CARD\`
      - Some Sub-Task 1
- Some Feature 2
  [https://url](http://url "smart")
  - Some Part 2 1
    - Some Task 2 1
    Some Task 2 1 Description \`id=234\`
    - **GAME DESIGN** Some Task 2 2
  - Some Part 2 2
    - \`TEMPLATE\`
## End Tasks
`;

        const expected = {
            legendJson: [{
                mdLine: "- FEATURE",
                name: 'FEATURE',
                "lineIndex": 1,
                children: [{
                    mdLine: "  - PART",
                    name: 'PART',
                    "lineIndex": 2,
                    children: [{
                        mdLine: "    - TASK",
                        name: 'TASK',
                        "lineIndex": 3,
                        children: [{
                            mdLine: "      - SUB-TASK",
                            name: 'SUB-TASK',
                            "lineIndex": 4,
                        }]
                    }]
                }]
            }],
            tasksJson: [
                {
                    mdLine: "- Some Feature 1",
                    name: "Some Feature 1",
                    "lineIndex": 7,
                    children: [{
                        mdLine: "  - Some Part 1",
                        name: "Some Part 1",
                        "lineIndex": 8,
                        children: [{
                            mdLine: "    - Some Task 1",
                            name: "Some Task 1",
                            "lineIndex": 9,
                            description: "Some Task 1 Description\nContinue Some Task 1 Description",
                            url: '[https://url](http://url "smart")',
                            metadata: {
                                id: '123',
                                label: 'ART',
                                to: 'CARD',
                            },
                            children: [{
                                mdLine: "      - Some Sub-Task 1",
                                name: "Some Sub-Task 1",
                                "lineIndex": 14,
                            }]
                        }]
                    }]
                },
                {
                    mdLine: "- Some Feature 2",
                    name: "Some Feature 2",
                    "lineIndex": 15,
                    url: '[https://url](http://url "smart")',
                    children: [
                        {
                            mdLine: "  - Some Part 2 1",
                            name: "Some Part 2 1",
                            "lineIndex": 17,
                            children: [
                                {
                                    mdLine: "    - Some Task 2 1",
                                    name: "Some Task 2 1",
                                    description: "Some Task 2 1 Description",
                                    "lineIndex": 18,
                                    metadata: {
                                        id: '234',
                                    },
                                },
                                {
                                    mdLine: "    - **GAME DESIGN** Some Task 2 2",
                                    name: "Some Task 2 2",
                                    "lineIndex": 20,
                                    metadata: {
                                        label: 'GAME DESIGN'
                                    }
                                },
                            ]
                        },
                        {
                            mdLine: "  - Some Part 2 2",
                            name: "Some Part 2 2",
                            "lineIndex": 21,
                            "children": [
                                {
                                    "fromTemplate": "TEMPLATE",
                                    "lineIndex": 22,
                                    "mdLine": "    - `TEMPLATE`",
                                    "name": "`TEMPLATE`"
                                }
                            ],
                        }
                    ]
                },
            ],
            templateJson: []
        };

        const result = markdownToJson(mdText);
        expect(result).toMatchObject(expected);
    });

    it('should be handle case', () => {
        const mdText = `Some description
# Legend
- FEATURE
  - PART
    - TASK
      - SUB-TASK
## End Legend
# TASKS
- Some Feature 1
Some Task 1 Description
Continue Some Task 1 Description
[https://url](http://url "smart")
\`id=123\` \`label=ART\` \`to=CARD\`
- Some Feature 2 \`to=CARD\`
Some Task 2 Description
Continue Some Task 2 Description
[https://url](http://url "smart")
\`id=234\` \`label=ART\`
## End Tasks
`;

        const expected = {
            legendJson: [{
                mdLine: "- FEATURE",
                name: 'FEATURE',
                "lineIndex": 1,
                children: [{
                    mdLine: "  - PART",
                    name: 'PART',
                    "lineIndex": 2,
                    children: [{
                        mdLine: "    - TASK",
                        name: 'TASK',
                        "lineIndex": 3,
                        children: [{
                            mdLine: "      - SUB-TASK",
                            name: 'SUB-TASK',
                            "lineIndex": 4,
                        }]
                    }]
                }]
            }],
            tasksJson: [
                {
                    mdLine: "- Some Feature 1",
                    name: "Some Feature 1",
                    "lineIndex": 7,
                    description: "Some Task 1 Description\nContinue Some Task 1 Description",
                    url: '[https://url](http://url "smart")',
                    metadata: {
                        id: '123',
                        label: 'ART',
                        to: 'CARD',
                    },
                },
                {
                    mdLine: "- Some Feature 2 `to=CARD`",
                    name: "Some Feature 2",
                    "lineIndex": 12,
                    description: "Some Task 2 Description\nContinue Some Task 2 Description",
                    url: '[https://url](http://url "smart")',
                    metadata: {
                        id: '234',
                        label: 'ART',
                        to: 'CARD',
                    },
                }
            ],
            templateJson: []
        };

        const result = markdownToJson(mdText);
        expect(result).toMatchObject(expected);
    });

    it('should be handle case with extra card bug', () => {
        const mdText = `# Tasks

- TEST Общее
  [https://trello.com/c/C1fhWPwo](https://trello.com/c/C1fhWPwo "smartCard-inline")
  \`to=CARD\` \`id=644ed6727e14d32f4a4d00a7\`
  - TEST Режим заставки
    - TEST Сделать режим показа заставки
      \`label=CODE\`
    - TEST Сделать перемещение энтитей по сценарию
      Some description
      \`label=CODE\`
    - TEST Сделать триггер начала заставки
      Some description 1
      Some description 2
      \`label=CODE\`
    - TEST Сделать возвращение к игре
- TEST Предыстории
  - TEST Far Away
  - TEST Long Ago
- TEST Начало катастрофы
- TEST Концовка

## End Tasks

# Legend

- FEATURE
  - PART
    - TASK
      - SUB-TASK

## End Legend`;

        const expected = {
            "legendJson": [
                {
                    "children": [
                        {
                            "children": [
                                {
                                    "children": [
                                        {
                                            "lineIndex": 28,
                                            "mdLine": "      - SUB-TASK",
                                            "name": "SUB-TASK"
                                        }
                                    ],
                                    "lineIndex": 27,
                                    "mdLine": "    - TASK",
                                    "name": "TASK"
                                }
                            ],
                            "lineIndex": 26,
                            "mdLine": "  - PART",
                            "name": "PART"
                        }
                    ],
                    "lineIndex": 25,
                    "mdLine": "- FEATURE",
                    "name": "FEATURE"
                }
            ],
            tasksJson: [
                {
                    "children": [
                        {
                            "children": [
                                {
                                    "lineIndex": 5,
                                    "mdLine": "    - TEST Сделать режим показа заставки",
                                    "metadata": {
                                        "label": "CODE"
                                    },
                                    "name": "TEST Сделать режим показа заставки"
                                },
                                {
                                    "description": "Some description",
                                    "lineIndex": 7,
                                    "mdLine": "    - TEST Сделать перемещение энтитей по сценарию",
                                    "metadata": {
                                        "label": "CODE"
                                    },
                                    "name": "TEST Сделать перемещение энтитей по сценарию"
                                },
                                {
                                    "description": "Some description 1\nSome description 2",
                                    "lineIndex": 10,
                                    "mdLine": "    - TEST Сделать триггер начала заставки",
                                    "metadata": {
                                        "label": "CODE"
                                    },
                                    "name": "TEST Сделать триггер начала заставки"
                                },
                                {
                                    "lineIndex": 14,
                                    "mdLine": "    - TEST Сделать возвращение к игре",
                                    "name": "TEST Сделать возвращение к игре"
                                }
                            ],
                            "lineIndex": 4,
                            "mdLine": "  - TEST Режим заставки",
                            "name": "TEST Режим заставки"
                        }
                    ],
                    "lineIndex": 1,
                    "mdLine": "- TEST Общее",
                    "name": "TEST Общее",
                    "metadata": {
                        "id": "644ed6727e14d32f4a4d00a7",
                        "to": "CARD"
                    },
                    "url": "[https://trello.com/c/C1fhWPwo](https://trello.com/c/C1fhWPwo \"smartCard-inline\")"
                },
                {
                    "children": [
                        {
                            "lineIndex": 16,
                            "mdLine": "  - TEST Far Away",
                            "name": "TEST Far Away"
                        },
                        {
                            "lineIndex": 17,
                            "mdLine": "  - TEST Long Ago",
                            "name": "TEST Long Ago"
                        }
                    ],
                    "lineIndex": 15,
                    "mdLine": "- TEST Предыстории",
                    "name": "TEST Предыстории"
                },
                {
                    "lineIndex": 18,
                    "mdLine": "- TEST Начало катастрофы",
                    "name": "TEST Начало катастрофы"
                },
                {
                    "lineIndex": 19,
                    "mdLine": "- TEST Концовка",
                    "name": "TEST Концовка"
                }
            ],
            templateJson: []
        };

        const result = markdownToJson(mdText);
        // expect(result.tasksJson).toHaveLength(11);
        expect(result).toMatchObject(expected);
    });

    it('should get metadata from short url', () => {
        const mdText = `# Tasks
- [test://123](test://123 "smartCard-inline") [meta](https://metadata/?name=Some%20Feature%201&id=123&to=MULTI_CHECKLIST_CARD)
  - Some Part 1 [meta](https://metadata/?checklist=1231)

## End Tasks

# Legend

- FEATURE
  - PART
    - TASK
      - SUB-TASK

## End Legend`;

        const expected = {
            tasksJson: [
                {
                    "mdLine": "- [test://123](test://123 \"smartCard-inline\") [meta](https://metadata/?name=Some%20Feature%201&id=123&to=MULTI_CHECKLIST_CARD)",
                    "name": "Some Feature 1",
                    url: "[test://123](test://123 \"smartCard-inline\")",
                    metadata: {
                        id: '123',
                        to: 'MULTI_CHECKLIST_CARD',
                    },
                    "children": [
                        {
                            "mdLine": "  - Some Part 1 [meta](https://metadata/?checklist=1231)",
                            "name": "Some Part 1",
                            metadata: {
                                checklist: '1231',
                            },
                        }
                    ],
                },
            ],
            templateJson: []
        };

        const result = markdownToJson(mdText);
        // expect(result.tasksJson).toHaveLength(11);
        expect(result).toMatchObject(expected);
    });

    it.each([
        {
            desc: 'single line',
            mdDesc: 'Some Task 1 Description',
            expDesc: 'Some Task 1 Description',
            expMeta: undefined,
            expUrl: undefined,
        },
        {
            desc: 'two lines',
            mdDesc: 'Description line 1\nLine 2',
            expDesc: 'Description line 1\nLine 2',
            expMeta: undefined,
            expUrl: undefined,
        },
        {
            desc: 'description with separated meta',
            mdDesc: 'Description line 1\n`id=123`\nEnd',
            expDesc: 'Description line 1\nEnd',
            expMeta: {id: '123'},
            expUrl: undefined,
        },
        {
            desc: 'description with meta on one line',
            mdDesc: 'Description line 1 `id=123`\nAnother description `label=ART` `to=CARD`',
            expDesc: 'Description line 1\nAnother description',
            expMeta: {id: '123', label: 'ART', to: 'CARD'},
            expUrl: undefined,
        },
        {
            desc: 'description with meta and URL',
            mdDesc: 'Description line 1 `id=123`\nThis card URL [https://url](http://url "smart")\nAnother description `label=ART` `to=CARD`',
            expDesc: 'Description line 1\nThis card URL\nAnother description',
            expMeta: {id: '123', label: 'ART', to: 'CARD'},
            expUrl: '[https://url](http://url "smart")',
        },
        {
            desc: 'only URL',
            mdDesc: '[https://url](http://url "smart")',
            expDesc: undefined,
            expMeta: undefined,
            expUrl: '[https://url](http://url "smart")',
        },
    ])('Should get description $desc', ({desc, mdDesc, expDesc, expMeta, expUrl}) => {
        const mdText = `Some description
# Legend
- FEATURE
  - PART
## End Legend
# TASKS
- Some Feature 1
${mdDesc}
  - Some Part 1
## End Tasks
`;
        const expected = {
            legendJson: [{
                mdLine: "- FEATURE",
                name: "FEATURE",
                "lineIndex": 1,
                children: [{
                    mdLine: "  - PART",
                    name: "PART",
                    "lineIndex": 2,
                }]
            }],
            tasksJson: [
                expect.objectContaining({
                    ...(expDesc ? { description: expDesc }: {}),
                    ...(expUrl ? { url: expUrl }: {}),
                    ...(expMeta ? { metadata: expMeta} : {}),
                    children: [expect.objectContaining({
                        mdLine: "  - Some Part 1",
                        name: "Some Part 1",
                    })],
                }),
            ],
            templateJson: []
        };

        const result = markdownToJson(mdText);
        expect(result).toMatchObject(expected);
    });
});