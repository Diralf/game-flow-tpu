
window.createCard = async (t, newCard) => {
    await window.authCheck(t);

    const list = await t.list('id');
    const myList = list.id;

    // const newCard = {
    //     name: 'New Test Card',
    //     desc: 'This is the description of our new card.',
    //     idList: myList,
    //     pos: 'top'
    // };

    return new Promise(((resolve, reject) => {
        Trello.post('/cards/', newCard, (data) => {
            console.log('Card created successfully.');
            console.log(JSON.stringify(data, null, 2));
            resolve(data);
        }, fail => reject(fail));
    }));
};
