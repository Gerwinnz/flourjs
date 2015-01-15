
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

    view.on('render', function(){
      $boundElements = view.find('.bind');

      $boundElements.each(function(index, el){
        var $el = $(el);
        var type = $el[0].nodeName;

        // Attach events to inputs and form elements
        if(type === 'INPUT' || type === 'TEXTAREA'){
          $el.on('keypress change keyup', function(event){
            var model = $el.data('model');
            view.set(model, $el.val(), false);
          });
        }

        if(type === 'SELECT'){
          $el.on('change', function(event){
            var model = $el.data('model');
            view.set(model, $el.val(), false);
          });
        }
        

        // Check for bindings
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
              binders[bindingName]($el, view.get(binding));
            }

          }());
        }
      });
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
    'val',
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
    'val': function($el, data){
      if($el.val() !== data){
        $el.val(data);
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