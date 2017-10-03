
var flour = flour || {};


/*
|
| Our flour.bind name space, everything goes in 'ere
|
*/
flour.bind = {};

flour.bind.binders = {};

flour.bind.binderNames = [];

flour.bind.query = '';

flour.bind.prefix = 'flour';





/*
|
| Add a binder method to our object
|
*/
flour.addBinder = function(name, binder)
{
  flour.bind.binders[flour.bind.prefix + '-' + name] = binder;
  flour.bind.binderNames.push('[' + flour.bind.prefix + '-' + name + ']');
  flour.bind.query = flour.bind.binderNames.join(',');
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



  //
  //  Bind element
  //
  var bindElement = function($el, binder, value)
  {
    var hasFilter = false;
    var filter = false;
    var filterParams = undefined;

    var isConditional = false;
    var condition = false;
    var conditionTrue = true;
    var conditionFalse = false;

    var changeEvent = false;

    // Handler
    var onChangeHandler = function(data)
    {
      binder.update($el, data);
    };

    //  Attach
    if(binder.attach !== undefined)
    {
      binder.attach($el, value, view);
    }

    // Format value
    value = value.replace(/\s/g, "");
    hasFilter = value.indexOf('|') === -1 ? false : true;
    isConditional = value.indexOf('=') === -1 ? false : true;

    // Parse filter and filter params
    if(hasFilter)
    {
      var pieces = value.split('|');
      value = pieces[0];
      filter = pieces[1];

      if(filter.indexOf(':') !== -1)
      {
        var pieces = filter.split(':');
        filter = pieces[0];
        filterParams = pieces[1];

        var lastCharIndex = filterParams.length - 1;
        if((filterParams[0] === '\'' || filterParams[0] === '"') && (filterParams[lastCharIndex] === '\'' || filterParams[lastCharIndex] === '"'))
        {
          filterParams = filterParams.substring(1, lastCharIndex);
        }
      }

      onChangeHandler = function(data)
      {
        if(flour.filters[filter] !== undefined)
        {
          data = flour.filters[filter](data, filterParams);
        }
        else if(view[filter] !== undefined)
        {
          data = view[filter](data, filterParams);
        }

        binder.update($el, data);
      };
    }

    // Parse condition
    if(isConditional)
    {
      var pieces = value.split('=');
      value = pieces[0];
      condition = pieces[1];

      if(condition.indexOf('?') !== -1)
      {
        var pieces = condition.split('?');
        var results = pieces[1].split(':');
        
        condition = pieces[0];
        conditionTrue = results[0];
        conditionFalse = results[1] === undefined ? false : results[1];
      }

      onChangeHandler = function(data)
      {
        data = data == condition ? conditionTrue : conditionFalse;
        binder.update($el, data);
      };
    }


    // Add event listeners
    changeEvent = 'model.' + value + ':change';
    
    if(binder.update)
    {
      // Store listeners
      listeners.push({
        'eventName': changeEvent,
        'eventCallback': onChangeHandler
      });

      // Listen
      view.on(changeEvent, onChangeHandler);

      // set initial
      var data = view.get(value);
      onChangeHandler(data);
    }
  };



  //
  //  On render
  //
  view.on('render', function()
  {
    // Clear any previous listeners added
    for(var i = 0, n = listeners.length; i < n; i ++)
    {
      var listener = listeners[i];
      view.off(listener.eventName, listener.eventCallback);
    }

    // Find all the elements first
    $elements.length = 0;
    $elements = view.find(flour.bind.query);

    // Now itterate them
    $elements.each(function(index, el)
    {
      var $el = $(el);
      for(var binderName in flour.bind.binders)
      {
        var attributeValue = $el.attr(binderName);
        if(attributeValue !== undefined)
        { 
          bindElement($el, flour.bind.binders[binderName], attributeValue);
        }
      }
    });
  });


};