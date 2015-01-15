
flour.addHelper('form', function(){

  var helper = this;



  helper.init = function(view){
    view.events['change select'] = function(event, el){
      updateViewModel(view, event, el);
    };

    view.events['keypress keyup input'] = function(event, el){
      updateViewModel(view, event, el);
    };

    view.events['keypress keyup  textarea'] = function(event, el){
      updateViewModel(view, event, el);
    };

    view.events['click change  checkbox'] = function(event, el){
      // updateViewModel(view, event, el);
      console.log(el);
      console.log(el.checked());
    };

    view.on('render', function(){
      $inputs = view.find('input, select, textarea');
      
      $.each($inputs, function(index, input){
        var $input = $(input);
        var dataModel = $input.data('model');

        if(dataModel){
          var val = view.get(dataModel);
          $input.val(val);
        }
      });
    });
  };



  var updateViewModel = function(view, event, el){
    var model = el.data('model');
    view.set(model, el.val(), false);
  };
  
});