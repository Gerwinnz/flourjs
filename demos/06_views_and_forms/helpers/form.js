
flour.addHelper('form', function(){

  var helper = this;



  helper.init = function(view){
    view.events['change select'] = function(event, el){
      updateViewModel(view, event, el);
    };

    view.events['keyup input'] = function(event, el){
      updateViewModel(view, event, el);
    };
  };



  var updateViewModel = function(view, event, el){
    event.preventDefault();
    event.stopPropagation();

    var model = el.data('model');
    view.set(model, el.val(), false);
  };
  
});