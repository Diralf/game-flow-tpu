/* global TrelloPowerUp, Trello */

var Promise = TrelloPowerUp.Promise;

var BLACK_ROCKET_ICON =
  "https://cdn.glitch.com/1b42d7fe-bda8-4af8-a6c8-eff0cea9e08a%2Frocket-ship.png?1494946700421";
var GREY_ROCKET_ICON =
  "https://cdn.glitch.com/c69415fd-f70e-4e03-b43b-98b8960cd616%2Frocket-ship-grey.png?1496162964717";
var WHITE_ROCKET_ICON =
  "https://cdn.glitch.com/c69415fd-f70e-4e03-b43b-98b8960cd616%2Fwhite-rocket-ship.png?1495811896182";

TrelloPowerUp.initialize({
  'board-buttons': function (t, opts) {
    return [{
      // we can either provide a button that has a callback function
      text: 'GF Login',
      callback: async t => {
        await t.popup({
          title: 'Login to Game Flow',
          url: './login/popup.html'
        });
      },
      condition: 'signedIn'
    },
      window.listType.createBoardButton(t),
      window.uml.buildBoardButton(t),
      window.cardType.buildBoardButton(t),
      window.cardIcon.buildBoardButton(t),
    ];
  },
  "card-buttons": function(t, options) {
    return [
      {
        icon: "https://cdn.glitch.com/1b42d7fe-bda8-4af8-a6c8-eff0cea9e08a%2Frocket-ship.png?1494946700421",
        text: "Estimate Size",
        callback: function(t) {
          t.get("card", "shared").then(list => alert(JSON.stringify(list)));
          return t.popup({
            title: "Estimation",
            url: "./estimate/c.html"
          });
        }
      },
      window.cardIcon.buildCardButton(t)
    ];
  },
  "card-badges": async function(t, options) {
    return [
      // [await t.card('idShort'), card => ({text: `#${card.idShort}`})],
      await window.cardType.cardBadge(t),
      await window.cardIcon.cardBadge(t),
      await window.childes.parentSingleCardBadge(t),
      await window.severity.cardBadge(t),
      ...(await window.linkInStatus.createBadges(t)),
      await window.idleTime.cardBadge(t)
    ];
  },
  "card-detail-badges": async function(t, options) {
    return [
      await window.cardIcon.cardDetailBadge(t),
      await window.cardType.cardDetailBadge(t),
      await window.severity.cardDetailBadge(t),
      await window.childes.parentsCardDetailBadge(t, {singleParent: true}),
      await window.childes.childesCardDetailBadge(t, {singleParent: true, isCreateAllowed: true}),
      await window.depends.parentsCardDetailBadge(t, {direction: 0}),
      await window.depends.childesCardDetailBadge(t, {direction: 0}),
      ...(await window.linkInStatus.createDetailBadges(t)),
      {
        title: 'Create Card',
        text: 'New Card',
        callback: async t => {
          await window.authCheck(t);

          const list = await t.list('all');
          const myList = list.id;

          const creationSuccess = function (data) {
            console.log('Card created successfully.');
            console.log(JSON.stringify(data, null, 2));
          };

          const newCard = {
            name: 'New Test Card',
            desc: 'This is the description of our new card.',
            // Place this card at the top of our list
            idList: myList,
            pos: 'top'
          };
          Trello.post('/cards/', newCard, creationSuccess, fail => console.error(fail));
          return ;
        }
      }
    ];
  }
});
