import {markdownToJson} from "./markdown-to-json.js";
import {tasksJsonWithTemplates} from "./tasks-json-with-templates.js";

describe('tasksJsonWithTemplates', () => {
   it('Should replace', () => {
       const mdText = `Some description
# Legend
- FEATURE
  - PART
    - TASK
      - SUB-TASK
## End Legend
# Template
- \`TEMP_TASK\`
  - Some Task 1
    - Some Sub Task 1
- \`TEMP_PART\`
  - Some Part 2
    - Some Task 2    
## End Template
# TASKS
- Some Feature 1
  - Part 1
    - \`TEMP_TASK\`
- Some Feature 2
  - PART 2
  - \`TEMP_PART\`    
## End Tasks
`;
       const expected = [
           {
               name: 'Some Feature 1',
               children: [
                   {
                       name: 'Part 1',
                       children: [
                           {
                               name: 'Some Task 1',
                               children: [
                                   {
                                       name: 'Some Sub Task 1',
                                   }
                               ]
                           }
                       ]
                   }
               ]
           },
           {
               name: 'Some Feature 2',
               children: [
                   {
                       name: 'PART 2',
                   },
                   {
                       name: 'Some Part 2',
                       children: [
                           {
                               name: 'Some Task 2',
                           }
                       ]
                   }
               ]
           }
       ];

       const { tasksJson, templateJson } = markdownToJson(mdText);
       const result = tasksJsonWithTemplates(tasksJson, templateJson);
       expect(result).toMatchObject(expected);
   });

    it('Should replace when partially implemented', () => {
        const mdText = `Some description
# Legend
- FEATURE
  - PART
    - TASK
      - SUB-TASK
## End Legend
# Template
- \`TEMP_TASK\`
  - Some Task 1
    \`tid=TEMP_TASK__1\`
    - Some Sub Task 1
      \`tid=TEMP_TASK__2\`
  - Some Task 2
    \`tid=TEMP_TASK__3\`
    - Some Sub Task 2
      \`tid=TEMP_TASK__4\`
## End Template
# TASKS
- Some Feature 1
  - Part 1
    - \`TEMP_TASK\`
    - Custom Some Task 2
      \`tid=TEMP_TASK__3\`
## End Tasks
`;
        const expected = [
            {
                name: 'Some Feature 1',
                children: [
                    {
                        name: 'Part 1',
                        children: [
                            {
                                name: 'Some Task 1',
                                children: [
                                    {
                                        name: 'Some Sub Task 1',
                                    }
                                ]
                            },
                            {
                                name: 'Custom Some Task 2',
                                children: [
                                    {
                                        name: 'Some Sub Task 2',
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ];

        const { tasksJson, templateJson } = markdownToJson(mdText);
        const result = tasksJsonWithTemplates(tasksJson, templateJson);
        expect(result).toMatchObject(expected);
    });

    it('Should replace when fully implemented', () => {
        const mdText = `Some description
# Legend
- FEATURE
  - PART
    - TASK
      - SUB-TASK
## End Legend
# Template
- \`TEMP_TASK\`
  - Some Task 1
    \`tid=TEMP_TASK__1\`
    - Some Sub Task 1
      \`tid=TEMP_TASK__2\`
  - Some Task 2
    \`tid=TEMP_TASK__3\`
    - Some Sub Task 2
      \`tid=TEMP_TASK__4\`
## End Template
# TASKS
- Some Feature 1
  - Part 1
    - \`TEMP_TASK\`
    - Some Task 2
      \`tid=TEMP_TASK__3\`
      - Some Sub Task 2
        \`tid=TEMP_TASK__4\`
## End Tasks
`;
        const expected = [
            {
                name: 'Some Feature 1',
                children: [
                    {
                        name: 'Part 1',
                        children: [
                            {
                                name: 'Some Task 1',
                                children: [
                                    {
                                        name: 'Some Sub Task 1',
                                    }
                                ]
                            },
                            {
                                name: 'Some Task 2',
                                children: [
                                    {
                                        name: 'Some Sub Task 2',
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ];

        const { tasksJson, templateJson } = markdownToJson(mdText);
        const result = tasksJsonWithTemplates(tasksJson, templateJson);
        expect(result).toMatchObject(expected);
    });

    it('Should replace when implemented with deep task', () => {
        const mdText = `Some description
# Legend
- FEATURE
  - PART
    - TASK
      - SUB-TASK
## End Legend
# Template
- \`TEMP_TASK\`
  - Some Task 1
    \`tid=TEMP_TASK__1\`
    - Some Sub Task 1
      \`tid=TEMP_TASK__2\`
  - Some Task 2
    \`tid=TEMP_TASK__3\`
    - Some Sub Task 2
      \`tid=TEMP_TASK__4\`
    - Some Sub Task 3
      \`tid=TEMP_TASK__5\`
## End Template
# TASKS
- Some Feature 1
  - Part 1
    - \`TEMP_TASK\`
    - Some Task 2
      \`tid=TEMP_TASK__3\`
      - Some Sub Task 2
        \`tid=TEMP_TASK__4\`
## End Tasks
`;
        const expected = [
            {
                name: 'Some Feature 1',
                children: [
                    {
                        name: 'Part 1',
                        children: [
                            {
                                name: 'Some Task 1',
                                children: [
                                    {
                                        name: 'Some Sub Task 1',
                                    }
                                ]
                            },
                            {
                                name: 'Some Task 2',
                                children: [
                                    {
                                        name: 'Some Sub Task 2',
                                    },
                                    {
                                        name: 'Some Sub Task 3',
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ];

        const { tasksJson, templateJson } = markdownToJson(mdText);
        const result = tasksJsonWithTemplates(tasksJson, templateJson);
        expect(result).toMatchObject(expected);
    });
});