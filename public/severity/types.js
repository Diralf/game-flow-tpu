class Severity extends window.AbstractList {
  constructor() {
    super();
    this.fieldName = 'severity';
    this.title = 'Severity';
    this.typesMap = new Map([
      [
        "blocker",
        {
          name: "Blocker",
          shortName: " ◰ ",
          color: "sky"
        }
      ],
      [
        "critical",
        {
          name: "Critical",
          shortName: " ⍟ ",
          color: "blue"
        }
      ],
      [
        "major",
        {
          name: "Major",
          shortName: " ○ ",
          color: "red"
        }
      ],
      [
        "minor",
        {
          name: "Minor",
          shortName: " ∿ ",
          color: "purple"
        }
      ],
      [
        "trivial",
        {
          name: "Trivial",
          shortName: " ∿ ",
          color: "purple"
        }
      ]
    ]);
  }

  openPopup(t) {
    return super.openPopup(t, {
      title: "Severity",
      listMap: this.typesMap,
      fieldName: "severity"
    });
  }
}

window.severity = new Severity();