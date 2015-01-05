
flour.addView('form', function(){

  var view = this;

  view.template = 'form';

  view.events = {
    'click button': 'clicked'
  };

  view.init = function(params){
    view.render();
  };

  // triggered by change event
  view.clicked = function(event, el){
    flour.publish('button-clicked');
  };

});