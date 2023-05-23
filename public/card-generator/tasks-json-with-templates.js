import {findTemplateEntries} from "./template-of-tasks.js";

export const tasksJsonWithTemplates = (tasksJson, templateJson) => {
    const templateMap = new Map(findTemplateEntries(templateJson));

    return replaceTaskFromTemplate(tasksJson, templateMap);
}

const replaceTaskFromTemplate = (tasksJson, templateMap, prevImplTempItems) => {
    return tasksJson.flatMap(task => {
        if (task.fromTemplate) {
            return getNewTemplates(templateMap.get(task.fromTemplate) ?? [], tasksJson);
        }
        const templateChildren = templateMap.get(task.metadata?.tid) ?? [];
        if (task.children) {
            const newTemplateChildren = getNewTemplates(templateChildren, task.children);
            return {
                ...task,
                children: replaceTaskFromTemplate([...task.children, ...newTemplateChildren], templateMap)
            };
        }
        if (templateChildren.length > 0) {
            return {
                ...task,
                children: templateChildren,
            };
        }
        return task;
    })
}

const getNewTemplates = (templateTasks, tasks) => {
    return (templateTasks ?? [])
        .filter(templateTask => {
            return tasks.every(siblingTask => {
                const siblingTID = siblingTask?.metadata?.tid;
                return !siblingTID || siblingTID !== templateTask?.metadata?.tid;
            });
        });
}