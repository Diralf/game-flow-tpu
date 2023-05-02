window.openSettingsBoardButton = (t) => ({
    text: 'Settings',
    callback: (t) => t.modal({
        title: 'Settings',
        fullscreen: true,
        url: './settings/settings.html'
    }),
    condition: 'signedIn',
    icon: "https://cdn.glitch.com/36da036c-f499-46a1-aa9f-1e196ed62696%2Fcog-solid.svg?v=1589800846052",
});