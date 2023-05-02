class CardTypesSettings {
    constructor(fieldName) {
        this.fieldName = fieldName;
    }

    async onInit(t, form) {
        console.log({form});
        form[this.fieldName].value = await this.getTypes(t);
    }
    
    async onSubmit(t, formValues) {
        await this.setTypes(t, formValues[this.fieldName]);
    }
    
    async setTypes(t, value) {
        const parsed = this.parsePrettyValue(value);
        if (parsed) {
            await t.set('board', 'shared', 'boardCardTypes', parsed);
        }
    }
    
    async getTypes(t) {
        const types = await t.get('board', 'shared', 'boardCardTypes', []);
        return this.stringifyToPretty(types);
    }
    
    parsePrettyValue(value) {
        try {
            return JSON.parse(value);
        } catch (e) {
            console.error(e);
        }
    }
    
    stringifyToPretty(types) {
        return JSON.stringify(types, null, 2);
    }
}

window.CardTypesSettings = CardTypesSettings;