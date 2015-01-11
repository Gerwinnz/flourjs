
flour.addView('main', function(){

  var view = this;

  view.template = 'main';

  view.helpers = [
    'form'
  ];

  view.events = {
    
  };


  // init
  view.init = function(params){
    view.render();
  };

});