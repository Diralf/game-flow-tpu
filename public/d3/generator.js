class D3Generator {

    constructor() {
        this.statusColorMap = new Map([
            ['todo', '#959799'],
            ['blocked', '#FF7452'],
            ['inprogress', '#FFC400'],
            ['intest', '#66BAFF'],
            ['done', '#36B37E'],
            ['closed', '#006644'],

            ['described', '#FFFFFF'],
            ['burn', '#FF2E00'],
            ['hot', '#FFC0B2'],
        ]);
        this.priorityNames = [
            'BLOCKER',
            'HIGH',
            'MEDIUM',
            'LOW',
            'TRIVIAL',
        ];
        this.sizeNames = [
            'XL',
            'L',
            'M',
            'S',
        ];
        this.defaultColor = '#FFFFFF';

        this.areas = ['CODE', 'ART', 'SOUND', 'PARTICLE', 'GAME DESIGN', 'LEVEL DESIGN', 'QA'];

        this.typesArray = [
            ["CARD_TYPE_2-1", "EPIC"],
            ["CARD_TYPE_2-2", "FEATURE"],
            ["CARD_TYPE_2-3", "PART"],
            ["CARD_TYPE_2-4", "TASK"],
            ["CARD_TYPE_2-5", "SUB TASK"],
            ["BUG", "BUG"],
        ]
        this.typesMap = new Map(this.typesArray);
    }

    buildBoardButton(t) {
        // return {
        //     text: "to D3",
        //     callback: (t) => this.generate(t),
        //     condition: "signedIn",
        //     icon: "https://cdn.glitch.global/36da036c-f499-46a1-aa9f-1e196ed62696/boxes-stacked-solid.svg?v=1682079314187",
        // };

        return {
            text: "to D3",
            callback: async (t) => await t.popup({
                title: "View",
                items: [
                    {
                        text: 'Group By Epics',
                        callback: (t) => this.generate(t),
                    },
                    {
                        text: 'Group By Areas',
                        callback: (t) => this.generate(t, 'groupByAreas'),
                    },
                    {
                        text: 'Group By Priority',
                        callback: (t) => this.generate(t, 'groupByPriority'),
                    }
                ],
            }),
            condition: "signedIn",
            icon: "https://cdn.glitch.global/36da036c-f499-46a1-aa9f-1e196ed62696/boxes-stacked-solid.svg?v=1682079314187",
        };
    }

    async getListTypes(t) {
        return t.get("board", "shared", "listType");
    }

    async getCards(t) {
        return t.cards("all");
    }

    async getCardsPluginData(t, cards) {
        return Promise.all(cards.map((card) => t.get(card.id, "shared")));
    }

    async generate(t, view) {
        const listTypes = await this.getListTypes(t);
        const cards = await this.getCards(t);
        const shared = await this.getCardsPluginData(t, cards);
        const fullCards = await Promise.all(cards.map(async (card, index) => {
            const checklists = await Promise.all(card.checklists.map(async (checklist) => {
                const checkItems = checklist.checkItems ?? await window.getCheckItems(t, checklist.id);
                return {
                    ...checklist,
                    checkItems,
                };
            }));

            return ({
                ...card,
                checklists,
                shared: shared[index],
                status: listTypes[card.idList] || "todo",
            });
        }));
        console.log({fullCards: fullCards.map(card => [card.name, card.checklists?.length, card])});

        const cardsMap = new Map(fullCards.map((card) => [card.id, card]));

        const rootCards = fullCards.filter((card) => {
            const parents = card.shared[window.links.parentsFieldName];
            return !parents || parents.length === 0;
        });

        const rootCardsList = rootCards.map(card => this.getConvertedCard(card, cardsMap));

        const rootChildren = this.getActualResult(view, rootCardsList);
        const result = this.getCardNode({ name: 'cards'}, rootChildren);

        console.log({result});
        const cardsArray = result.children.flatMap(child => this.toArray(child));
        console.log(cardsArray);
        const jsonTable = this.toTable(cardsArray);
        console.table(this.toTable(cardsArray));
        // console.log(JSON.stringify(jsonTable));
        localStorage.setItem("d3data", JSON.stringify(result));
        t.modal({
            url: "./d3/zoomable-voronoi/index.html",
            fullscreen: true,
            title: "D3 Diagram",
        });
    }

    toArray(cardsLevel, path = []) {
        const children = cardsLevel.children ?? [];
        return [
            { ...cardsLevel, path },
            ...children.flatMap(child => this.toArray(child, [...path, cardsLevel])),
        ];
    }

    toTable(cardsArray) {
        return cardsArray.map(item => {
            const [epic, feature, part, task] = (item.path ?? []).map(pathCard => pathCard.name);
            return {
                epic: epic ?? '',
                feature: feature ?? '',
                part: part ?? '',
                task: task ?? '',
                name: item.name,
                description: '', // item.card?.desc || item.task?.description || '',
                type: this.typesMap.get(item.card?.shared?.cardType) ?? this.typesArray[item.path.length]?.[1] ?? '',
                priority: this.priorityNames[item.priority ?? 2] ?? '',
                size: item.sizeName ?? '',
                area: this.areas.find(area => item.labels?.includes(area)) ?? '',
                status: item.status?.toUpperCase() ?? 'TODO',
                labels: item.labels?.filter(label => !this.areas.includes(label)).join(', ') ?? '',
            };
        });
    }

    getActualResult(view, cards) {
        switch (view) {
            case 'groupByAreas':
                const labels = this.areas;

                return this.groupByPredicate({
                    cards,
                    groups: labels,
                    predicate: (group, card) => card?.labels?.some(label => label === group)
                });
            case 'groupByPriority':
                const priorities = [0, 1, 2, 3, 4];

                return this.groupByPredicate( {
                    cards,
                    groups: priorities,
                    predicate: (group, card) => card?.priority === group,
                    modification: (card) => {
                        const size = card.priority === 0 ? 10 : (
                            card.priority ? 5 - card.priority : 1
                        );
                        return ({
                            ...card,
                            size: card.size * size,
                        });
                    },
                    getGroupName: (group) => this.priorityNames[group],
                });
            default:
                return cards;
        }
    }

    getConvertedCard(card, cardsMap) {
        const childrenCards = (card?.shared?.[window.links.childesFieldName] ?? [])
            .map(childId => cardsMap.get(childId));

        let countDescribed = 0;
        try {
            countDescribed = window.cardListCount(card.desc);
        } catch {}

        if (countDescribed > 0) {
            const { tasksJson, templateJson } = window.markdownToJson(card.desc);
            const withTemplates = window.tasksJsonWithTemplates(tasksJson, templateJson);
            console.log({ name: card.name, withTemplates });
            const shortDescribedJson = this.getSimpleTasksJson(withTemplates, cardsMap);
            return this.getCardNode(card, shortDescribedJson);
        }


        if (childrenCards.length > 0) {
            const children = childrenCards.map(childCard => this.getConvertedCard(childCard, cardsMap));
            return this.getCardNode(card, children);
        } else {
            return this.getCardLeaf(card);
        }
    }

    getSimpleTasksJson(tasksJson, cardsMap) {
        return tasksJson
            .map(task => {
                const cardId = this.getCardCreatedId(task);
                const card = cardId ? cardsMap.get(cardId) : null;

                if (task.children) {
                    const children = this.getSimpleTasksJson(task.children, cardsMap);
                    return this.getTaskNode(task, children, card);
                }
                if (card) {
                    return this.getCardLeaf(card);
                }
                return this.getTaskLeaf(task);
            })
            .filter((result) => !!result)
    }

    filterByPredicate({ cards, predicate, modification = (v) => v, nodeMod = (v) => v }) {
        return cards?.map((card) => {
           if (card.children?.length > 0) {
               const filteredChildren = this.filterByPredicate({ cards: card.children, predicate, modification, nodeMod });
               if (filteredChildren?.length > 0) {
                   const node = {
                       ...card,
                       children: filteredChildren,
                   };
                   return nodeMod ? nodeMod(node) : node;
               }
           } else {
               const result = predicate(card);
               if (result) {
                   return modification ? modification(card) : card;
               }
           }
           return null;
        })
            .filter(Boolean);
    }

    groupByPredicate({ cards, groups, predicate, modification = (v) => v, nodeMod = (v) => v, getGroupName = (group) => group }) {
        const otherSection = () => {
            const results = this.filterByPredicate({
                cards,
                predicate: (card) => groups.every((group) => !predicate(group, card)),
                modification,
                nodeMod: (card) => nodeMod(card, 'OTHER')
            });
            if (results.length > 0) {
                return this.getCardNode({ name: 'OTHER' }, results);
            }
        }

        return [
            ...groups.map((group) => {
                const results = this.filterByPredicate({
                    cards,
                    predicate: (card) => predicate(group, card),
                    modification,
                    nodeMod: (card) => nodeMod(card, group)
                });
                if (results.length > 0) {
                    return this.getCardNode({ name: getGroupName(group) }, results);
                }
            }),
            ...([otherSection()] ?? [])
        ].filter(Boolean)
    }

    getCardNode(card, children) {
        return {
            name: card.name,
            children,
            totalSize: this.getTotalSize(children),
            doneSize: this.getDoneSize(children),
            totalCount: this.getTotalCount(children),
            labels: card.labels?.map(label => label.name.replace('*', '').trim().toUpperCase()) ?? [],
            card,
        }
    }

    getCardLeaf(card) {
        const priority = card.shared.severity ?? 2;
        return {
            name: card.name,
            size: this.getCardSize(card.shared.estimation),
            sizeName: this.sizeNames[card.shared.estimation],
            value: 1,
            color: this.getColorByStatus(this.isBurnStatus(card.status, priority)),
            labels: card.labels?.map(label => label.name.replace('*', '').trim().toUpperCase()) ?? [],
            priority,
            url: card.url,
            isDone: ['done', 'closed'].includes(card.status),
            card,
        }
    }

    getTaskNode(task, children, card) {
        return {
            name: task.name,
            children,
            labels: [task?.metadata?.label?.trim().toUpperCase()],
            totalSize: this.getTotalSize(children),
            doneSize: this.getDoneSize(children),
            totalCount: this.getTotalCount(children),
            task,
            // labels: [task?.metadata?.label],
        }
    }

    getTaskLeaf(task) {
        const color = this.statusColorMap.get(this.isBurnStatus('described', task?.metadata?.priority));
        return {
            name: task.name,
            size: this.getCardSize(this.sizeNames.indexOf(task?.metadata?.size?.toUpperCase() ?? 'M')),
            sizeName: task?.metadata?.size?.toUpperCase(),
            value: 1,
            color,
            labels: [task?.metadata?.label?.trim().toUpperCase()],
            priority: task?.metadata?.priority,
            isDone: false,
            task,
        }
    }

    getTotalSize(children) {
        return children.reduce((acc, card) => acc + (card.size ?? card.totalSize ?? 0), 0);
    }

    getDoneSize(children) {
        const leafSize = (card) => card.isDone ? card.size : null;

        return children.reduce((acc, card) => acc + (leafSize(card) ?? card.doneSize ?? 0), 0);
    }

    getTotalCount(children) {
        return children.reduce((acc, card) => acc + (card.children ? (card.totalCount ?? 1) : 1), 0);
    }

    getCardCreatedId(task) {
        return task.metadata?.id;
    }

    getColorByStatus(status) {
        return this.statusColorMap.get(status) ?? this.defaultColor;
    }

    isBurnStatus(status, priority) {
        if (status === 'todo' || status === 'described') {
            if (priority === 0) {
                return 'burn';
            }
            if (priority === 1) {
                return 'hot';
            }
        }
        return status;
    }

    getCardSize(sizeIndex) {
        const sizes = [10, 3, 1, 0.2];
        return sizes[sizeIndex] ?? 1;
    }
}

window.d3gen = new D3Generator();