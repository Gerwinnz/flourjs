
var flour = flour || {};


/*
|
| Our flour.bind name space, everything goes in 'ere
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

        var options = flour.bind.binders[bindingName];
        var attribute = bindingPrefix + '-' + bindingName;
        $elements.length = 0;
        $elements = view.find('[' + attribute + ']');

        //
        // Itterate over our bound elements
        //
        $elements.each(function(index, el)
        {
          var $el = $(el);
          var bindOn = $el.attr(attribute);
          var filter = false;
        
          //
          // Check for load
          //
          if(options.load)
          {
            options.load($el, function(value)
            {
              view.set(bindOn, value, false);
            });
          }

          //
          // Listen for changes to the bindOn value
          //
          bindOn = bindOn.replace(/\s/g, "");
          var hasFilter = bindOn.indexOf('|') === -1 ? false : true;

          if(hasFilter)
          {
            var pieces = bindOn.split('|');
            bindOn = pieces[0];
            filter = pieces[1];
          }


          // on model change
          var changeEvent = 'model.' + bindOn + ':change';
          var onChangeCallback = function(data)
          {
            if(filter)
            {
              data = view[filter](data);
            }

            options.change($el, data);
          };

          listeners.push({
            'eventName': changeEvent,
            'eventCallback': onChangeCallback
          });

          view.on(changeEvent, onChangeCallback);


          // first time
          var data = view.get(bindOn);
          if(filter)
          {
            data = view[filter](data);
          }

          options.change($el, data);

        });

      }());
    }
  });
}





/*
|
| Bind a list, parses an empty template for bindings
|
*/
flour.bindList = function(list, template)
{
  var $elements = [];
  var listeners = [];
  var bindingPrefix = flour.bind.prefix;


  console.log('bind list - - - - - - - - - - ');
  
  var $template = $(flour.getTemplate(template)({}));

  // Find elements matching our binders
  for(var bindingName in flour.bind.binders)
  {
    (function(){
      
      var options = flour.bind.binders[bindingName];
      var attribute = bindingPrefix + '-' + bindingName;
      $elements.length = 0;
      $elements = $template.find('[' + attribute + ']');

      $elements.each(function(index, el)
      {
        var $el = $(el);
        var bindOn = $el.attr(attribute);
        var filter = false;

        bindOn = bindOn.replace(/\s/g, "");
        var hasFilter = bindOn.indexOf('|') === -1 ? false : true;
      
        var bindOn = $el.attr(attribute);
        var updateSelector = '[' + attribute + '="' + bindOn + '"]';

        list.addBinding(bindingName, bindOn, updateSelector);
      });

    }());
  }

  console.log('- - - - - - - - - - - - - - - ');
}