import {cardListCount} from "./card-list-count.js";

describe('card-list-count', () => {
    it.each([
        {
            desc: 'empty',
            tasksText: ``,
            expectedCount: 0,
        },
        {
            desc: 'one feature',
            tasksText: `- Feature`,
            expectedCount: 1,
        },
        {
            desc: 'two line features',
            tasksText: `- Feature\n- Feature 2`,
            expectedCount: 2,
        },
        {
            desc: 'inner tasks',
            tasksText: `
- Feature 1
  - Part 1
    - Task 1
    - Task 2
- Feature 2`,
            expectedCount: 5,
        },
        {
            desc: 'task with id',
            tasksText: `
- Feature 1
  - Part 1
    - Task 1
    \`id=123\`
    - Task 2
- Feature 2`,
            expectedCount: 4,
        },
        {
            desc: 'with templates',
            tasksText: `
- Feature 1
  - \`TEMPLATE\`
- Feature 2
  - \`TEMPLATE\`
- Feature 3
  - Own Part  
`,
            template: `
- \`TEMPLATE\`
  - Some Part
    - Some Task 1
    - Some Task 2
`,
            expectedCount: 10,
        }
    ])('Should count card $desc', ({tasksText, template, expectedCount}) => {
        const templateText = template ? `\n# Template\n${template}\n## End Template` : '';
        const mdText = `Test
# Legend
- FEATURE
  - PART
    - TASK
      - SUB-TASK
## End Legend
# TASKS
${tasksText}
## End Tasks${templateText}`;
        const result = cardListCount(mdText);

        expect(result).toEqual(expectedCount);
    });
});