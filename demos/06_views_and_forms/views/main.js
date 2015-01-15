
flour.addView('main', function(){

  var view = this;

  view.template = 'main';

  view.helpers = [
    'bind'
  ];

  view.events = {
    'click button.reset-first-name': 'resetFirstName'
  };

  // init
  view.init = function(params){
    view.set('user', {
      'first_name': 'Gandalf',
      'last_name': 'the Grey',
      'gender': 'female',
      'description': 'Gandalf the Grey, later known as Gandalf the White, was a wizard, or Istar, sent by the West in the Third Age to combat the threat of Sauron. He joined Thorin and his company to reclaim Erebor from Smaug, convoked the Fellowship of the Ring to destroy the One Ring, and led the Free Peoples in the final campaign of the War of the Ring.'
    });
  };

  view.resetFirstName = function(){
    view.set('user.first_name', 'Gandalf', false);
  }

  view.formatJSON = function(user){
    return JSON.stringify(user, undefined, 2);
  };

});