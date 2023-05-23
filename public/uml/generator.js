class UmlGenerator {
  buildBoardButton(t) {
    return {
      text: "to UML",
      callback: (t) => this.generate(t),
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

  async generate(t) {
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
    
    const idMap = new Map(
      fullCards.map((card) => [card.id, "card" + card.idShort])
    );
    const cardsMap = new Map(fullCards.map((card) => [card.id, card]));

    let resultUml = "";

    const rootCards = fullCards.filter((card) => {
      const parents = card.shared[window.links.parentsFieldName];
      return !parents || parents.length === 0;
    });

    for (const card of rootCards) {
      resultUml += await this.registerChildes(t, card, idMap, cardsMap);
    }

    for (const card of fullCards) {
      if (card.shared.relates) {
        const cardName = idMap.get(card.id);
        if (cardName) {
          const linksUml = card.shared[window.depends.childesFieldName].map(
            (link) => {
              const linkName = idMap.get(link);
              return linkName
                ? `${this.name(cardName)} --> ${this.name(idMap.get(link))}`
                : "";
            }
          );
          resultUml += linksUml.join("\n");
          resultUml += "\n";
        }
      }
    }

    const cardTypesMap = await window.cardType.getTypesMap(t);
    const coloredTypes = Array.from(cardTypesMap)
      .map(([key, options]) => `HyperLinkColor<<${key}>> ${options.umlColor}`)
      .join("\n");

    const finalResult = `@startuml\n
        <style>
          .described {
            BackGroundColor white
            FontColor black
          }
          .checklist {
            FontColor black
          }
          .burn {
            BackgroundColor #FF2E00
          }
          .hot {
            BackgroundColor #FFC0B2
          }
          .blocked {
            BackgroundColor #FF7452
          }
          .inprogress {
            BackgroundColor #FFC400
          }
          .intest {
            BackgroundColor #66BAFF
          }
          .done {
            BackgroundColor #36B37E
          }
          .closed {
            BackgroundColor #006644
          }
          
        </style>
        skinparam state {
          BackgroundColor #FAFBFC
          BackgroundColor<<todo>> #EBECF0
          
          BackgroundColor<<burn>> #FF2E00
          BackgroundColor<<hot>> #FFC0B2

          BackgroundColor<<blocked>> #FF7452
          BackgroundColor<<inprogress>> #FFC400
          BackgroundColor<<intest>> #66BAFF
          BackgroundColor<<done>> #36B37E
          BackgroundColor<<closed>> #006644
          BorderColor #091E42
          BorderColor<<p0>> #BF2600
          BorderColor<<p1>> #BF2600
          BorderColor<<p2>> #091E42
          BorderColor<<p3>> #C1C7D0
          BorderColor<<p4>> #FFFFFF
          FontColor<<p0>> #BF2600
          FontColor<<p1>> #BF2600
          FontColor<<p2>> #091E42
          FontColor<<p3>> #C1C7D0
          FontColor<<p4>> #FFFFFF
          ${coloredTypes}
          
          ArrowColor #091E42
        }
        ${resultUml}\n
        @enduml`;

    console.log(finalResult);
    localStorage.setItem("plantUML", finalResult);
    t.modal({
      // url: './uml/uml-jquery.html',
      url: "./uml/uml-jquery.html",
      args: { plantuml: finalResult },
      fullscreen: true,
      title: "Uml Diagram",
    });
  }

  name(text) {
    if (text.includes(" ")) {
      return `"${text}"`;
    }
    return text;
  }

  async registerChildes(t, card, idMap, cardsMap, ident = 0) {
    let stateUml = "\n";
    if (!card) {
      return stateUml;
    }
    const cardShortName = idMap.get(card.id);
    const identText = new Array(ident).fill(" ").join("");
    const name = this.getName(card.name)
    const url = `[[https://trello.com/c/${card.shortLink} ${name}]]`;
    // const url = name;
    const readStatus = window.listType.getNameOfListType(card.status);
    const childes = card.shared[window.links.childesFieldName];
    let highlight = '';
    switch (true) {
      case card.shared.severity === 0 && card.status === 'todo' && !(childes?.length > 0):
        highlight = '<<burn>>';
        break;
      case card.shared.severity === 1 && card.status === 'todo' && !(childes?.length > 0):
        highlight = '<<hot>>';
        break;
    }

    let countDescribed = 0;
    try {
      countDescribed = window.cardListCount(card.desc);
    } catch {}

    if (card.status === 'closed') {
      stateUml += identText +
          `state "${url}" as ${cardShortName} <<${card.status}>> {\n `;
    } else {
      stateUml +=
          identText +
          `state "${url}" as ${cardShortName} ${highlight} <<${card.status}>> <<${card.shared.cardType}>> <<${"p" + card.shared.severity}>> {\n `;
    }

    if (countDescribed > 0) {
      const { tasksJson, templateJson } = window.markdownToJson(card.desc);
      const withTemplates = window.tasksJsonWithTemplates(tasksJson, templateJson);
      const shortDescribedJson = this.getSimpleTasksJson(withTemplates);
      if (shortDescribedJson.length > 0) {
        stateUml += `json Described_${cardShortName} <<described>> ${JSON.stringify({ 'To Create': shortDescribedJson}, null, 2)}\n`
      }
    }

    if (childes) {
      for (const childId of childes) {
        stateUml += await this.registerChildes(
          t,
          cardsMap.get(childId),
          idMap,
          cardsMap,
          ident + 2
        );
      }

    }
    if (card.checklists.length > 0) {
      const checklistJson = card.checklists.reduce((acc, checklist) => {
        const haveIncomplete = checklist.checkItems.some(item => item.state === 'incomplete');
        acc[checklist.name] = checklist.checkItems.map(item => {
          const complete = item.state === 'complete' ? '<color:green>' : '';
          return complete + item.name;
        });
        return acc;
      }, {});
      if (Object.keys(checklistJson).length > 0) {
        stateUml += `json " " as Checklists_${cardShortName} <<checklist>> ${highlight} <<${card.status}>> ${JSON.stringify(checklistJson, null, 2)}\n`;
      }
    }
    const severity =
      window.severity.typesMap.get(card.shared.severity) ||
      window.severity.typesMap.get(window.severity.default);
    const cardType = (await window.cardType.getTypesMap(t)).get(card.shared.cardType);

    stateUml += identText + "}\n";
    if (card.status === 'closed') {
      stateUml += identText + `${cardShortName} : ${readStatus}\n`;
    } else {
      stateUml += identText + `${cardShortName} : ${cardType?.name || "task"} - ${severity.name.slice(0, 2)}\n`;
      stateUml += identText + `${cardShortName} : ${readStatus}\n`;
    }

    return stateUml;
  }

  getSimpleTasksJson(tasksJson) {
    const isCardCreated = (task) => task.metadata?.id || task.metadata?.checklist || task.metadata?.checklistItem;
    return tasksJson
        .map(task => {
          const name = task.name;
          if (task.children) {
            const childrenTasks = this.getSimpleTasksJson(task.children);
            if (childrenTasks.length > 0) {
              return {
                [name]: childrenTasks
              };
            } else {
              return null;
            }
          }
          return isCardCreated(task) ? null : name;
        })
        .filter((result) => !!result)
  }

  getName(name) {
    return name
        .replace(/\*\*\w+\*\*/, '')
        .trim()
        .split(" ")
        .reduce(
            (acc, word) => {
              const last = acc[acc.length - 1];
              const newLine = [...last, word];
              if (newLine.join(" ").length < 20) {
                acc[acc.length - 1] = [...last, word];
              } else {
                acc.push([word]);
              }
              return acc;
            },
            [[]]
        )
        .map((line) => line.join(" "))
        .join("\\n");
  }
}

window.uml = new UmlGenerator();
