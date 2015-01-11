
flour.addView('main', function(){

  var view = this;

  view.template = 'main';

  view.helpers = [
    'form'
  ];

  view.events = {
    'click button.show-data': 'showData'
  };


  // init
  view.init = function(params){
    view.set('user', {
      'first_name': 'Gandalf',
      'last_name': 'the Grey',
      'gender': 'other',
      'description': 'Gandalf (Quenya; IPA: [gand:alf] - "Wand-Elf") the Grey, later known as Gandalf the White, was a wizard, or Istar, sent by the West in the Third Age to combat the threat of Sauron. He joined Thorin and his company to reclaim Erebor from Smaug, convoked the Fellowship of the Ring to destroy the One Ring, and led the Free Peoples in the final campaign of the War of the Ring.'
    });
  };



  view.showData = function(params){
    var user = view.get('user');
    var json = JSON.stringify(user, undefined, 2);
    //var formattedJson = json.replace(/(,|{|})/g, "$& \n\t");

    view.find('#user-json').html(json);
  }

});