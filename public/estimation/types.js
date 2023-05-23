class Estimation extends window.AbstractList {
  constructor() {
    super();
    this.fieldName = 'estimation';
    this.title = 'Estimation';
    this.default = -1;
    this.icon = 'https://cdn.glitch.global/36da036c-f499-46a1-aa9f-1e196ed62696/clock-regular.svg?v=1684395857914'
    this.typesMap = new Map([
      [
        -1,
        {
          name: "No",
          shortName: "",
        },
      ],
      [
        0,
        {
          name: "Week (XL)",
          shortName: "XL",
        }
      ],
      [
        1,
        {
          name: "Few Days (L)",
          shortName: "L",
        }
      ],
      [
        2,
        {
          name: "During Day (M)",
          shortName: "M",
        }
      ],
      [
        3,
        {
          name: "Hour (S)",
          shortName: "S",
        }
      ]
    ]);
  }
}

window.estimation = new Estimation();
