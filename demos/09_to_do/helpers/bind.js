
flour.addHelper('bind', function(){

  var helper = this;

  var bindingPrefix = 'flour';


  /*
  |
  |
  | Find elements with a bind class, search for a binding type
  | attach listeners to the data change and then 
  | modify the elements contents with binder methods
  |
  | Attach change events to form elements
  |
  |
  */
  helper.init = function(view){

    var $boundElements = [];
    var $changesListeners = [];

    view.on('render', function(){
      console.log('binding helper!');
      $boundElements = view.find('.bind');

      $boundElements.each(function(index, el){
        var $el = $(el);
        var type = $el[0].nodeName;

        //
        // Attach events to inputs and form elements
        //
        if(type === 'INPUT' || type === 'TEXTAREA'){
          var inputType = $el[0].type;

          if(inputType === 'checkbox'){
            $el.on('change', function(event){             
              var val = ($el.prop('checked'));
              var model = $el.attr(bindingPrefix + '-model');
              view.set(model, val, false);
            });
          }else if(inputType === 'radio'){
            $el.on('change', function(event){
              var val = $el.val();
              var model = $el.attr(bindingPrefix + '-model');
              view.set(model, val, false);
            });
          }else{
            $el.on('keypress change keyup', function(event){
              var val = $el.val();
              var model = $el.attr(bindingPrefix + '-model');
              view.set(model, val, false);
            });
          }
        }

        if(type === 'SELECT'){
          $el.on('change', function(event){
            var val = $el.val();
            var model = $el.attr(bindingPrefix + '-model');
            view.set(model, val, false);
          });
        }
        

        //
        // Check for bindings
        //
        for(var i = 0, n = bindersList.length; i < n; i ++){
          (function(){

            var bindingName = bindersList[i];
            var attributeName = bindingPrefix + '-' + bindingName;

            var binding = $el.attr(attributeName);
            var filter = false;

            if(binding){
              binding = binding.replace(/\s/g, "");
              var hasFilter = binding.indexOf('|') === -1 ? false : true;

              if(hasFilter){
                var pieces = binding.split('|');
                binding = pieces[0];
                filter = pieces[1];
              }

              // on model change
              view.on('model.' + binding + ':change', function(data){
                if(filter){
                  data = view[filter](data);
                }

                binders[bindingName]($el, data);
              });

              // first time
              var data = view.get(binding);
              if(filter){
                data = view[filter](data);
              }
              binders[bindingName]($el, data);
            }

          }());
        }
      });

      console.log(view.eventListeners);
    });

  };





  /*
  |
  |
  | A list of binder methods that will take data and an element and modify the contents
  | of the element appropriately
  |
  |
  */
  var bindersList = [
    'html',
    'model',
    'show',
    'hide',
    'text',
    'class'
  ];

  var binders = {

    //
    //  
    //
    'html': function($el, data){
      $el.html(data);
    },


    //
    //  
    //
    'text': function($el, data){
      $el.text(data);
    },


    //
    //  
    //
    'model': function($el, data){
      var $type = $el[0].nodeName;
      var $inputType = $el[0].type;

      if($inputType === 'checkbox'){
        $el.prop('checked', data);

      }else if($el.attr('type') === 'radio'){
        if($el.val() === data){
          $el.prop('checked', true);
        }

      }else{
        if($el.val() !== data){
          $el.val(data);
        }
      }
    },


    //
    //
    //
    'show': function($el, data){
      if(data){
        $el.css('display', 'block');
      }else{
        $el.css('display', 'none');
      }
    },


    //
    //
    //
    'hide': function($el, data){
      if(data){
        $el.css('display', 'none');
      }else{
        $el.css('display', 'block');
      }
    },


    //
    //
    //
    'class': function($el, data){
      var lastClass = $el.data('last-class');
      if(lastClass){
        $el.removeClass(lastClass);
      }

      $el.data('last-class', data);
      $el.addClass(data);
    }

  };


  
});