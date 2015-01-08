
flour.addView('form', function(){

  var view = this;

  view.template = 'form';

  view.events = {
    'submit form': 'submit'
  };

  view.init = function(params){
    var user = flour.store.get('user');
    view.set(user);
  };

  // triggered by change event
  view.submit = function(event, el){
    event.preventDefault();

    var formData = flour.validateFormData(el);
    var user = formData.data;

    flour.store.set('user', user);
  };

});