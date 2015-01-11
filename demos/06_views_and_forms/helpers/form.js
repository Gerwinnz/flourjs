
flour.addHelper('form', function(){

  var helper = this;



  helper.init = function(view){
    view.events['change select'] = function(event, el){
      updateViewModel(view, event, el);
    };

    view.events['keyup input'] = function(event, el){
      updateViewModel(view, event, el);
    };

    view.events['keyup textarea'] = function(event, el){
      updateViewModel(view, event, el);
    };

    view.on('render', function(){
      $inputs = view.find('input, select, textarea');
      
      $.each($inputs, function(index, input){
        var $input = $(input);
        var val = view.get($input.data('model'));
        $input.val(val);
      });
    });
  };



  var updateViewModel = function(view, event, el){
    event.preventDefault();
    event.stopPropagation();

    var model = el.data('model');
    view.set(model, el.val(), false);
  };
  
});