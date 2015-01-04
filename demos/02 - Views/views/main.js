
flour.addView('main', function(){

  var view = this;

  view.template = 'main';

  view.init = function(params){
    view.set('name', params.name);

    view.subscribe('name:change', function(name){
      view.set('name', name);
    });
  };

});