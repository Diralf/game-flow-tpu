
export const createCheckList = async (t, idCard, name, showMessage = true) => {
    await window.authCheck(t);

    return new Promise(((resolve, reject) => {
        window.Trello.post('/checklists/', { idCard, name }, (data) => {
            if (showMessage) {
                t.alert({ message: `Checklist ${name} created successfully.` });
            }
            console.log('Checklist created successfully.');
            // console.log(JSON.stringify(data, null, 2));
            resolve(data);
        }, fail => reject(fail));
    }));
};

export const createCheckListItem = async (t, idChecklist, name, showMessage = true) => {
    await window.authCheck(t);

    return new Promise(((resolve, reject) => {
        window.Trello.post(`/checklists/${idChecklist}/checkItems`, { name }, (data) => {
            if (showMessage) {
                t.alert({ message: `Checklist item ${name} created successfully.` });
            }
            console.log('Checklist item created successfully.');
            // console.log(JSON.stringify(data, null, 2));
            resolve(data);
        }, fail => reject(fail));
    }));
};

export const getCheckItems = async (t, idChecklist) => {
    await window.authCheck(t);

    return new Promise(((resolve, reject) => {
        window.Trello.get(`/checklists/${idChecklist}/checkItems`, (data) => {
            resolve(data);
        }, fail => reject(fail));
    }));
};

window.getCheckItems = getCheckItems;
window.createCheckList = createCheckList;
window.createCheckListItem = createCheckListItem;
