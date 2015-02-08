
flour.addView('form', function(){

  var view = this;

  view.template = 'form';

  view.events = {
    'submit form': 'submit'
  };

  view.init = function(params){
    var user = flour.store.get('user');
    view.set('user', user);
  };

  // triggered by change event
  view.submit = function(event, el){
    event.preventDefault();
    flour.store.set('user', view.get('user'));
  };

});