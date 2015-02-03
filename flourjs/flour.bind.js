
var flour = flour || {};


/*
|
| Store our binders in this object
|
*/
flour.bind = {};

flour.bind.binders = {};

flour.bind.prefix = 'flour';



/*
|
| Add a binder method to our object
|
*/
flour.addBinder = function(name, methods)
{
  flour.bind.binders[name] = methods;
};




/*
|
| Bind a view
|
*/
flour.bindView = function(view)
{
  var $elements = [];
  var listeners = [];
  var bindingPrefix = flour.bind.prefix;


  view.on('render', function()
  {
    // Clear any previous listeners added
    for(var i = 0, n = listeners.length; i < n; i ++)
    {
      var listener = listeners[i];
      view.off(listener.eventName, listener.eventCallback);
    }

    // Find elements matching our binders
    for(var bindingName in flour.bind.binders)
    {
      (function(){

        var methods = flour.bind.binders[bindingName];
        var attribute = bindingPrefix + '-' + bindingName;
        
        $elements = view.find('[' + attribute + ']');

        //
        // Itterate over our bound elements
        //
        $elements.each(function(index, el)
        {
          var $el = $(el);
          var bindOn = $el.attr(attribute);
        
          //
          // Check for load
          //
          if(methods.load)
          {
            methods.load($el, function(value)
            {
              view.set(bindOn, value, false);
            });
          }

          //
          // Check for
          //
        });

      }());
      


        //
        // Check for bindings
        //
        //return;
        // for(var i = 0, n = bindersList.length; i < n; i ++)
        // {
        //   (function(){

        //     var bindingName = bindersList[i];
        //     var attributeName = bindingPrefix + '-' + bindingName;

        //     var binding = $el.attr(attributeName);
        //     var filter = false;

        //     if(binding)
        //     {
        //       binding = binding.replace(/\s/g, "");
        //       var hasFilter = binding.indexOf('|') === -1 ? false : true;

        //       if(hasFilter)
        //       {
        //         var pieces = binding.split('|');
        //         binding = pieces[0];
        //         filter = pieces[1];
        //       }

        //       // on model change
        //       var changeEvent = 'model.' + binding + ':change';
        //       var onChangeCallback = function(data)
        //       {
        //         if(filter)
        //         {
        //           data = view[filter](data);
        //         }

        //         binders[bindingName]($el, data);
        //       };

        //       listeners.push({
        //         'eventName': changeEvent,
        //         'eventCallback': onChangeCallback
        //       });

        //       view.on(changeEvent, onChangeCallback);

        //       // first time
        //       var data = view.get(binding);
        //       if(filter){
        //         data = view[filter](data);
        //       }
        //       binders[bindingName]($el, data);
        //     }

        //   }());
        // }
    }
  });
}



