
flour.addView('nav', function(){

  var view = this;

  view.template = 'nav';

  view.events = {};

  view.helpers = ['pulldown_menu'];

  view.init = function(params){
    var user = flour.store.get('user');
    view.set(user);

    // subscribe to the global event here
    view.subscribe('user:change', function(user){
      view.set(user);
    });
  };

});