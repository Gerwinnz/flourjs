
flour.addHelper('bind', function(){

  var helper = this;

  var bindingPrefix = 'flour';


  /*
  |
  |
  | Find elements with a bind class, attach listeners to the data change and then 
  | modify the elements contents with binder methods
  |
  |
  */
  helper.init = function(view){

    var $boundElements = [];

    view.on('render', function(){
      $boundElements = view.find('.bind');

      $boundElements.each(function(index, el){
        var $el = $(el);

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

              view.on('model.' + binding + ':change', function(data){

                if(filter){
                  data = view[filter](data);
                }

                binders[bindingName]($el, data);
              });
            }

          }()); // end of closure
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
    'show'
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
    }

  };


  
});