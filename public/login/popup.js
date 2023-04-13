/* global TrelloPowerUp, Trello */

var t = TrelloPowerUp.iframe();

window.login.addEventListener('submit', function(event){
  // Stop the browser trying to submit the form itself.
  event.preventDefault();
  return t.set('board', 'private', 'token', window.keyInput.value)
  .then(function(){
    t.closePopup();
  });
});

t.render(function(){
  return t.sizeTo('#login').done();
});
