class Childes extends Links {
    constructor() {
        super();
        this.childesTitle = 'Childes';
        this.parentsTitle = 'Parents';
        this.childesFieldName = 'childes';
        this.parentsFieldName = 'parents';
    }

    async createLink(t, options) {
        t.popup({
            title: 'Enter Name',
            items: (t, opts) => {
                return [
                    {
                        text: `Create`,
                        callback: (t) => this.createChildCard(t, opts.search, options)
                    }
                ]
            },
            search: {
                placeholder: 'New Card Name',
                searching: 'Enter New Card Name',
                debounce: 500
            }
        })
    }

    async createChildCard(t, name, options) {
        const {severity, cardType} = await t.get(options.currentCardId, 'shared');
        const newType = (await window.cardType.getTypeRelation(t, cardType, options.direction))[0];
        console.log(newType, cardType);
        if (newType) {
            const {idList} = await t.card('idList');
            console.log(options, idList);
            try {
                const newCard = await createCard(t, {
                    name: name,
                    idList
                });
                console.log(newCard);
                await t.set(newCard.id, 'shared', {
                    severity,
                    cardType: newType
                });

                await this.addBothLink(t, newCard, options);
            } catch (e) {
                console.error(e);
                await t.alert({
                    message: JSON.stringify(e)
                });
            }
        } else {
            await t.alert({
                message: `Card with type ${cardType} can't has child`
            });
        }

        t.closePopup();
    }
}

window.childes = new Childes();
