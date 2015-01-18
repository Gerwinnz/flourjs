
flour.addView('page', function(){

  var view = this;
  
  view.template = 'page';


  // init
  view.init = function(params){
    view.set('data', JSON.stringify(params, undefined, 2), false);
    view.set('route_data', JSON.stringify(flour.store.get('route'), undefined, 2), false);
    view.render();
  };

});