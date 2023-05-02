export const updateCard = async (t, cardId, updatedCard, showMessage = true) => {
    await window.authCheck(t);

    return new Promise(((resolve, reject) => {
        Trello.put(`/cards/${cardId}`, updatedCard, (data) => {
            if (showMessage) {
                t.alert({ message: `Card ${cardId} updated successfully.` });
                console.log('Card updated successfully.');
                console.log(JSON.stringify(data, null, 2));
            }
            resolve(data);
        }, fail => reject(fail));
    }));
};

window.createCard = createCard;