
flour.addView('main', function(){

  var view = this;
  var count = 0;

  view.template = 'main';

  view.init = function(params){
    view.set('count', count);

    // subscribe to the global event here
    view.subscribe('button-clicked', function(){
      count ++;
      view.set('count', count);
    });
  };

});