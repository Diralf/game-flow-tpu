
export const createCard = async (t, newCard, showMessage = true) => {
    await window.authCheck(t);

    return new Promise(((resolve, reject) => {
        Trello.post('/cards/', newCard, (data) => {
            if (showMessage) {
                t.alert({ message: `Card ${newCard.name} created successfully.` });
            }
            console.log('Card created successfully.');
            // console.log(JSON.stringify(data, null, 2));
            resolve(data);
        }, fail => reject(fail));
    }));
};

window.createCard = createCard;
