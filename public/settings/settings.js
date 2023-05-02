var t = TrelloPowerUp.iframe();

const cardTypesSettings = new window.CardTypesSettings('textAreaTypes');

async function onInit() {
    await cardTypesSettings.onInit(t, window.typesForm);
}

async function onSubmit() {
    try {
        await cardTypesSettings.onSubmit(t, window.typesForm);
    } catch (e) {
        t.alert({
            message: JSON.stringify(e)
        });
    }
    t.closePopup();
};

window.typesForm.addEventListener('submit', function (event) {
    // Stop the browser trying to submit the form itself.
    event.preventDefault();
    onSubmit();
});

onInit();

t.render(() => t.sizeTo('#typesForm').done());