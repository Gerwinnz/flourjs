
var flour = flour || {};


/*
|
| Store our binders in this object
|
*/
flour.bind = {};

flour.bind.binders = {};

flour.bind.list = [];

flour.bind.prefix = 'flour';



/*
|
| Add a binder method to our object
|
*/
flour.addBinder = function(name, methods)
{
  flour.bind.binders[name] = methods;
  flour.bind.list.push(name);
};




/*
|
| Bind a view
|
*/
flour.bindView = function(view)
{
  var $boundElements = [];
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
    for(var i = 0, n = flour.bind.list.length; i < n; i ++)
    {
      (function(){

        var bindingName = flour.bind.list[i];
        var bindingAttribute = bindingPrefix + '-' + bindingName;
        var $boundElements = view.find('[' + bindingAttribute + ']');

        //
        // Itterate over our bound elements
        //
        $boundElements.each(function(index, el)
        {
          var $el = $(el);
          var binding = $el.attr(bindingAttribute);
        
          //
          // Check for load
          //
          if(flour.bind.binders[bindingName].load)
          {
            flour.bind.binders[bindingName].load($el, function(value)
            {
              view.set(binding, value, false);
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



