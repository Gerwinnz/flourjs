
flour.addView('form', function(){

  var view = this;

  view.template = 'form';

  view.events = {
    'change keyup input': 'update'
  };

  view.init = function(params){
    view.render();
  };

  // triggered by change event
  view.update = function(event, el){
    console.log('a');
    flour.publish('name:change', el.val());
  };

});