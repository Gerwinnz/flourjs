
flour.addHelper('form', function(){

  var helper = this;



  helper.init = function(view){
    view.events['change select'] = function(event, el){
      var val = el.val();
      var model = el.data('model');

      view.set(model, val, false);
    };

    view.events['keypress keyup input:text'] = function(event, el){
      var val = el.val();
      var model = el.data('model');

      view.set(model, val, false);
    };

    view.events['keypress keyup input:password'] = function(event, el){
      var val = el.val();
      var model = el.data('model');

      view.set(model, val, false);
    };

    view.events['change input:checkbox'] = function(event, el){
      var val = (el.prop('checked'));
      var model = el.data('model');

      view.set(model, val, false);
    };

    view.events['change input:radio'] = function(event, el){
      var val = el.val();
      var model = el.data('model');

      view.set(model, val, false);
    };

    view.events['keypress keyup  textarea'] = function(event, el){
      var val = el.val();
      var model = el.data('model');

      view.set(model, val, false);
    };

    

    view.on('render', function(){
      $inputs = view.find('input, select, textarea');
      
      $.each($inputs, function(index, input){
        var $input = $(input);
        var dataModel = $input.data('model');

        if(dataModel){
          var val = view.get(dataModel);
          if($input.attr('type') === 'checkbox'){
            $input.prop('checked', val);
          }else if($input.attr('type') === 'radio'){
            if($input.val() === val){
              $input.prop('checked', true);
            }
          }else{
            $input.val(val);
          }
        }
      });
    });
  };
  
});