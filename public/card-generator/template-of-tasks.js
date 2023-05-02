import {getMarkdownLines, getSectionJson} from "./markdown-to-json.js";

const templateJsonToMap = (templateJson) => {
    return new Map(findTemplateEntries(templateJson));
}

export const findTemplateEntries = (templateJson = []) => {
    // console.log(templateJson);
    if (!Array.isArray(templateJson)) {
        return [];
    }
    const isTemplateValue = mdValue => mdValue.name.match(/`\w+`/) && mdValue.children?.length > 0;
    const templateValues = templateJson.filter(mdValue => isTemplateValue(mdValue));
    const nonTemplateValues = templateJson.filter(mdValue => !isTemplateValue(mdValue));

    const templateEntries = templateValues.map((mdValue) => {
        const templateName = mdValue.name.match(/`(\w+)`/);
        return [templateName[1], mdValue.children];
    });

    const otherEntries = nonTemplateValues.flatMap(mdValue => findTemplateEntries(mdValue.children ?? []));

    return [
        ...templateEntries,
        ...otherEntries,
    ]
}

const getTemplateMap = (markdownText) => {
    const lines = getMarkdownLines(markdownText);
    const templateJson = getSectionJson(lines, 'TEMPLATE');
    return templateJsonToMap(templateJson);
}

const countObjectKeys = (array) => {
    return array.length + array.reduce((acc, key) => acc + countObjectKeys(key.children ?? []), 0);
}

const findTemplatesInTasks = (tasksJson = []) => {
    const templates = tasksJson.map(mdTask => {
        const result = mdTask.name.match(/`(.*)`/);
        return result ? result[1] : null;
    });
    const childrenTemplates = tasksJson.flatMap(mdTask => findTemplatesInTasks(mdTask.children));
    return [...templates, ...childrenTemplates];
}

export const getTemplatedCounts = (markdownText) => {
    const lines = getMarkdownLines(markdownText);
    const templateJson = getSectionJson(lines, 'TEMPLATE');
    const tasksJson = getSectionJson(lines, 'TASKS');
    const mapOfCounts = new Map(findTemplateEntries(templateJson)
        .map(([key, value]) => [key, countObjectKeys(value)]));
    const templatesInTasks = findTemplatesInTasks(tasksJson);
    return templatesInTasks.reduce((acc, template) => {
        return acc + (mapOfCounts.get(template) ?? 0);
    }, 0);
}