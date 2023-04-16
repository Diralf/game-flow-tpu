class UmlGenerator {
  buildBoardButton(t) {
    return {
      text: "to UML",
      callback: (t) => this.generate(t),
      condition: "signedIn",
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
    console.log(cards);
    const shared = await this.getCardsPluginData(t, cards);
    const fullCards = cards.map((card, index) => ({
      ...card,
      shared: shared[index],
      status: listTypes[card.idList] || "todo",
    }));
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
      resultUml += this.registerChildes(card, idMap, cardsMap);
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
      .map(([key, options]) => `FontColor<<${key}>> ${options.umlColor}`)
      .join("\n");

    const finalResult = `@startuml\n
        skinparam state {
          BackgroundColor #FAFBFC
          BackgroundColor<<blocked>> #FF7452
          BackgroundColor<<todo>> #EBECF0
          BackgroundColor<<inprogress>> #FFC400
          BackgroundColor<<intest>> #66BAFF
          BackgroundColor<<done>> #36B37E
          BackgroundColor<<closed>> #006644
          BorderColor #091E42
          BorderColor<<p0>> #BF2600
          BorderColor<<p1>> #BF2600
          BorderColor<<p2>> #091E42
          BorderColor<<p3>> #C1C7D0
          BorderColor<<p4>> #EBECF0
          ${coloredTypes}
          
          ArrowColor #091E42
        }
        ${resultUml}\n
        @enduml`;

    console.log(finalResult);
    localStorage.setItem("plantUML", finalResult);
    t.modal({
      // url: './uml/uml-jquery.html',
      url: "./uml/uml.html",
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

  registerChildes(card, idMap, cardsMap, ident = 0) {
    let stateUml = "\n";
    if (!card) {
      return stateUml;
    }
    const cardShortName = idMap.get(card.id);
    const identText = new Array(ident).fill(" ").join("");
    const name = card.name
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
    const url = `[[https://trello.com/c/${card.shortLink} ${name}]]`;
    const readStatus = window.listType.getNameOfListType(card.status);
    stateUml =
      identText +
      `state "${url}" as ${cardShortName} <<${card.status}>> <<${card.shared.cardType}>> <<${"p" + card.shared.severity}>> {\n `;

    const childes = card.shared[window.links.childesFieldName];
    if (childes) {
      for (const childId of childes) {
        stateUml += this.registerChildes(
          cardsMap.get(childId),
          idMap,
          cardsMap,
          ident + 2
        );
      }
    }
    const severity =
      window.severity.typesMap.get(card.shared.severity) ||
      window.severity.typesMap.get(window.severity.default);

    stateUml += identText + "}\n";
    stateUml += identText + `${cardShortName} : ${card.shared.cardType || "task"} - ${severity.name}\n`;
    stateUml += identText + `${cardShortName} : ${readStatus}\n`;

    return stateUml;
  }
}

window.uml = new UmlGenerator();
