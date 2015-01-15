
flour.addView('main', function(){

  var view = this;

  view.template = 'main';

  view.events = {
    'submit form': 'displayData'
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

  view.displayData = function(event, el){
    event.preventDefault();
    
    var formData = flour.validateFormData(el);
    view.find('#form-data').text(JSON.stringify(formData, undefined, 2));
  };

});