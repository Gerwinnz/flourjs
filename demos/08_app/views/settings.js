
flour.addView('settings', function(){

  var view = this;
  
  view.template = 'settings';

  view.events = {
    'submit form': 'submit'
  };

  view.init = function(params){
    view.set('user', flour.store.get('user'));
  };

  // triggered by change event
  view.submit = function(event, el){
    event.preventDefault();
    flour.store.set('user', view.get('user'));
  };

});