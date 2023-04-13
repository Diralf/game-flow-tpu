/* global TrelloPowerUp, Trello */

window.authCheck = async t => {
    const token = await t.get('board', 'private', 'token');

    if (token && token.length > 1) {
        Trello.setToken(token);
    } else {
        await t.popup({
            title: 'Login to Game Flow',
            url: './login/popup.html'
        });
    }
};
