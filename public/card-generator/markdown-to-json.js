import {linkRegExp} from "./link-reg-exp.js";

export function getMarkdownLines(markdownText) {
    const allLines = markdownText.split('\n');
    return allLines.map((line) => line.startsWith('#') ? line.toUpperCase() : line);
}

export const markdownToJson = (markdownText) => {
    const lines = getMarkdownLines(markdownText);
    const legendJson = getSectionJson(lines, 'LEGEND', true);
    const tasksJson = getSectionJson(lines, 'TASKS', true);
    const templateJson = getSectionJson(lines, 'TEMPLATE');
    return {
        legendJson,
        tasksJson,
        templateJson,
    };
}

export const getSectionJson = (lines, sectionName, required = false) => {
    const name = sectionName.toUpperCase();
    const startIndex = lines.indexOf(`# ${name}`);
    if (!~startIndex) {
        if (required)
            throw new Error(`Start of section "${name}" not found. It should be like "# ${name}"`);
        return [];
    }
    const endIndex = lines.indexOf(`## END ${name}`);
    if (!~endIndex) {
        throw new Error(`End of section "${name}" not found. It should be like "## END ${name}"`);
    }
    const sectionLines = lines.slice(startIndex + 1, endIndex);

    const features = [];
    let currentPath = [];
    let currentObject = {};
    let descriptionParts = [];
    let metadata = {};
    let mdLines = [];
    let url = null;
    let nameFromUrl = null;

    function applyMetadata() {
        const validDescriptionParts = descriptionParts.filter(descPart => descPart.length > 0);
        if (validDescriptionParts.length > 0) {
            currentObject.description = validDescriptionParts.join('\n');
        }
        if (Object.keys(metadata).length > 0) {
            currentObject.metadata = metadata;
        }
        if (url) {
            currentObject.url = url;
        }
        if (!currentObject.name && nameFromUrl) {
            currentObject.name = nameFromUrl;
        }
        // currentObject.mdLines = mdLines;
        descriptionParts = [];
        metadata = {};
        mdLines = [];
        url = null;
    }

    sectionLines.forEach((line, index) => {
        if (line.match(/^[ ]*- /)) {
            applyMetadata();
            const metadataUrl = line.match(/\[meta\]\(([^)]*)\)/)?.[1];
            let nameFromMetaUrl = null;
            if (metadataUrl) {
                const parsedUrl = new URL(metadataUrl).searchParams;
                nameFromMetaUrl = parsedUrl.get('name') ?? null;
                parsedUrl.forEach((value, key) => {
                    if (key !== 'name') {
                        metadata[key] = value;
                    }
                });
            }
            currentObject = {
                mdLine: line,
                name: nameFromMetaUrl ?? getNameFromLine(line),
                lineIndex: index + startIndex,
            };
            const fromTemplate = line.match(/- `(\w+)`/);
            if (fromTemplate) {
                currentObject.fromTemplate = fromTemplate[1];
            }
            const listItemIndex = line.indexOf('- ');
            const spaces = line.slice(0, listItemIndex);
            const level = spaces.length / 2;
            currentPath = [...currentPath.slice(0, level)];
            setValueByPath(features, currentPath, currentObject);
            currentPath.push(line);

            const oldLabel = line.match(/\*\*([\w ]+)\*\*/);
            if (oldLabel?.[1]) {
                metadata.label = oldLabel[1];
            }
            if (line.endsWith(' -')) {
                metadata.to = 'SINGLE_CHECKLIST_CARD';
            }
            if (line.endsWith(' =')) {
                metadata.to = 'MULTI_CHECKLIST_CARD';
            }
        } else {
            const descPart = getDescription(line);
            descriptionParts.push(descPart);
        }
        const metaDataInLine = getMetadataFromLine(line);
        const validUrl = getURLFromLine(line);
        if (validUrl) {
            url = validUrl;
            nameFromUrl = getNameFromURL(validUrl);
        }
        metadata = {
            ...metaDataInLine,
            ...metadata,
        };
        mdLines.push(line);
    });

    applyMetadata();

    return features;
}

const getNameFromLine = (mdLine) => {
    const listItemIndex = mdLine.indexOf('- ');
    return mdLine
        .slice(listItemIndex + 2)
        .replace(linkRegExp, '')
        .replace(/\[meta\]\(([^)]*)\)/, '')
        .replaceAll(/`\w+=\w+`/g, '')
        .replace(/\*\*[\w ]+\*\*/, '')
        .replace(/#\w+/, '')
        .replace('[x]', '')
        .replace(/ -$/, '')
        .replace(/ =$/, '')
        .trim();
};

function getNameFromURL(validUrl) {
    const result = validUrl.match(/\[([^\]]*)]/);
    if (result && result[1] && !result[1].startsWith('http')) {
        return result[1];
    }
    return null;
}

const getMetadataFromLine = (line) => {
    const values = line.match(/`\w+=\w+`/g) ?? [];
    return values.reduce((acc, keyValueString) => {
        const [, key, value] = keyValueString.match(/`(\w+)=(\w+)`/) ?? [];
        acc[key.replaceAll('`', '').trim()] = value.replaceAll('`', '').trim();
        return acc;
    }, {});
}
const getURLFromLine = (line) => {
    const [url] = line.match(linkRegExp) ?? [];
    return url ?? null;
}

const getDescription = (line) => {
    return line
        .replace(linkRegExp, '')
        .replaceAll(/`\w+=\w+`/g, '')
        .trim();
}

const setValueByPath = (array, path, value) => {
    let result = array;
    path.forEach((item) => {
        const parsedItem = result.find(parsedItem => parsedItem.mdLine === item);
        if (!parsedItem) {
            throw Error(`Item not found by path ${JSON.stringify(path)}, ${JSON.stringify(result, null, 2)}`);
        }
        if (!parsedItem.children) {
            parsedItem.children = [];
        }
        result = parsedItem.children;
    });
    result.push(value);
}