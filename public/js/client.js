/* global TrelloPowerUp */

var Promise = TrelloPowerUp.Promise;

var BLACK_ROCKET_ICON =
  "https://cdn.glitch.com/1b42d7fe-bda8-4af8-a6c8-eff0cea9e08a%2Frocket-ship.png?1494946700421";
var GREY_ROCKET_ICON =
  "https://cdn.glitch.com/c69415fd-f70e-4e03-b43b-98b8960cd616%2Frocket-ship-grey.png?1496162964717";
var WHITE_ROCKET_ICON =
  "https://cdn.glitch.com/c69415fd-f70e-4e03-b43b-98b8960cd616%2Fwhite-rocket-ship.png?1495811896182";

TrelloPowerUp.initialize({
  "card-buttons": function(t, options) {
    return [
      {
        icon:
          "https://cdn.glitch.com/1b42d7fe-bda8-4af8-a6c8-eff0cea9e08a%2Frocket-ship.png?1494946700421",
        text: "Estimate Size",
        callback: function(t) {
          t.get("card", "shared").then(list => alert(JSON.stringify(list)));
          return t.popup({
            title: "Estimation",
            url: "./estimate/c.html"
          });
        }
      }
    ];
  },
  "card-badges": async function(t, options) {
    return [
      await window.cardType.cardBadge(t),
      await window.severity.cardBadge(t)
      // [
      //   await window.cardData(t, "estimate"),
      //   data => ({
      //     icon: data ? GREY_ROCKET_ICON : WHITE_ROCKET_ICON,
      //     text: data || "Not Estimated",
      //     color: data ? null : "red"
      //   })
      // ]
    ].map(([field, callback]) => callback(field));
  },
  "card-detail-badges": async function(t, options) {
    return [
      await window.cardType.cardDetailBadge(t),
      await window.severity.cardDetailBadge(t)
      // [
      //   await window.cardData(t, "estimate"),
      //   data => ({
      //     title: "Estimate",
      //     text: data || "No Estimate!",
      //     color: data ? null : "red",
      //     callback: t => t.popup({
      //       title: "Estimate",
      //       url: "estimate/popup.html"
      //     })
      //   })
      // ]
    ].map(([data, cb]) => cb(data));
  }
});
