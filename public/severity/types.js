class Severity extends window.AbstractList {
  constructor() {
    super();
    this.fieldName = 'severity';
    this.title = 'Severity';
    this.default = 2;
    this.icon = 'https://cdn.glitch.com/36da036c-f499-46a1-aa9f-1e196ed62696%2Fchevron-circle-up-solid.svg?v=1589801033619'
    this.typesMap = new Map([
      [
        0,
        {
          name: "⊘ Blocker",
          shortName: "Blocker",
          color: "red",
          icon: "https://cdn.glitch.global/36da036c-f499-46a1-aa9f-1e196ed62696/skull-crossbones-solid.svg?v=1681677711858",
        }
      ],
      [
        1,
        {
          name: "P1 High",
          shortName: "High",
          color: "red",
          icon: "https://cdn.glitch.global/36da036c-f499-46a1-aa9f-1e196ed62696/angles-up-solid.svg?v=1681677647716"
        }
      ],
      [
        2,
        {
          name: "P2 Middle",
          shortName: "Mid",
          color: "light-gray",
          icon: 'https://cdn.glitch.com/36da036c-f499-46a1-aa9f-1e196ed62696%2Fchevron-circle-up-solid.svg?v=1589801033619',
        }
      ],
      [
        3,
        {
          name: "P3 Low",
          shortName: "Low",
          icon: "https://cdn.glitch.global/36da036c-f499-46a1-aa9f-1e196ed62696/angle-down-solid.svg?v=1681677656984",
        }
      ],
      [
        4,
        {
          name: "P4 Trivial",
          shortName: "Triv",
          icon: 'https://cdn.glitch.global/36da036c-f499-46a1-aa9f-1e196ed62696/angles-down-solid.svg?v=1681677652220',
        }
      ]
    ]);
  }
}

window.severity = new Severity();
