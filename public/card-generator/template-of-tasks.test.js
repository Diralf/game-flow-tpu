// noinspection JSUnresolvedReference

import {findTemplateEntries} from "./template-of-tasks.js";

describe('template of tasks', function () {
    it.each([
        [
            'empty input',
            [],
            []
        ],
        [
            'no template',
            [{ name: 'foo', children: [{ name: 'bar'}]}, { name: 'oof', children: [{ name: 'rab'}]}],
            []
        ],
        [
            'template is first',
            [{ name: '`foo`', children: [{ name: 'bar'}]}, { name: 'oof', children: [{ name: 'rab'}]}],
            [["foo", [{ name: 'bar'}]]]
        ],
        [
            'template is second',
            [{ name: 'foo', children: [{ name: 'bar'}]}, { name: '`oof`', children: [{ name: 'rab'}]}],
            [["oof", [{ name: 'rab'}]]]
        ],
        [
            'inner template',
            [{ name: 'foo', children: [{ name: '`bar`'}]}, { name: '`oof`', children: [{ name: 'rab'}]}],
            [["oof", [{ name: 'rab'}]]]
        ],
    ])('should handle template when %s', (desc, json, expected) => {
        expect(findTemplateEntries(json)).toEqual(expected);
    });
});