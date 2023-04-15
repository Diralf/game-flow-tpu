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
          color: "red"
        }
      ],
      [
        1,
        {
          name: "P1 High",
          shortName: "P1",
          color: "red"
        }
      ],
      [
        2,
        {
          name: "P2 Middle",
          shortName: "P2",
          hidden: true,
        }
      ],
      [
        3,
        {
          name: "P3 Low",
          shortName: "P3",
          hidden: true,
        }
      ],
      [
        4,
        {
          name: "P4 Trivial",
          shortName: "P4",
          hidden: true,
        }
      ]
    ]);
  }
}

window.severity = new Severity();
