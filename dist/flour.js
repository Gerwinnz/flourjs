
var flour = flour || {};


/*
|
| Instance Id, increments for each instance created
|
*/
flour.instanceId = 1;



/*
|
| flour app core : class
|
*/
flour.app = function(appName, options)
{
  // Return an instance if the new keyword wasn't used
  if(!(this instanceof flour.app)) 
  {
    return new flour.app(name, options);
  }

  // Self keyword
  var self = this;

  options = options || {};

  // Privates
  var views = [];
  var cacheViewsCount = options.cache_views_count === undefined ? 5 : options.cache_views_count;
  var current = 0;
  var currentRoute = undefined;
  var currentViewName = undefined;
  var currentViewParams = undefined;


  // Setup some app params
  self.el = $('<div class="flour-app"></div>');
  


  /*
  |
  | Capture link clicks and use js to push the url
  |
  */
  self.el.on('click', 'a', function(event)
  {
    if(event.button === 1)
    {
      return;
    }

    if(event.metaKey)
    {
      return;
    }

    $target = $(event.currentTarget);

    if($target.hasClass('classic') || $target.hasClass('ignore'))
    {
      event.stopPropagation();
      return;
    }

    event.preventDefault();
    var url = $target.attr('href');

    if(url === undefined)
    {
      return;
    }

    // check for silent class
    var silent = false;
    if($target.hasClass('silent'))
    {
      silent = true;
    }

    // compile the data
    var data = {
      silent: silent
    };

    // push 
    flour.pushState(url, data);
  });




  /*
  |
  | Checks when new view is ready and then calls our transition method
  |
  */
  self.displayView = function(nextView, lastView)
  {
    if(nextView.ready === false)
    {
      var onReady = function()
      {
        self.transitionViews(nextView, lastView);
        nextView.ready = true;
        nextView.off('ready', onReady);
      };

      nextView.on('ready', onReady);
    }
    else
    {
      self.transitionViews(nextView, lastView);
    }
  };




  /*
  |
  | Transitions our views
  |
  */
  self.transitionViews = function(nextView, lastView)
  {
    if(nextView.willShow !== undefined)
    {
      nextView.willShow();
    }

    if(options.transition)
    {
      options.transition(nextView, lastView, function(){
        self.cleanUp(nextView, lastView);
      });
    }
    else
    {
      self.el.append(nextView.el);
      self.cleanUp(nextView, lastView);
    }
  };



  /*
  |
  | Will destroy previous views
  |
  */
  self.cleanUp = function(nextView, lastView)
  {
    if(lastView)
    {
      lastView.el.detach();
    }

    if(views.length > cacheViewsCount)
    {
      var view = views.shift();
      view.destroy();
      view.el.remove();
      current --;
    }
  };

  


  /*
  |
  | Create new router and listen to route change event
  |
  */
  var router = new flour.router(options.routes, options.base_path);

  flour.subscribe('route:change', function(route)
  {
    var extra = undefined;
    
    // place the view into our app element
    if(flour.views[route.view] !== undefined)
    {
      var isDifferentRoute = route.route !== currentRoute;
      var isDifferentView = route.view !== currentViewName;
      var isDifferentParams = JSON.stringify(route.params) !== JSON.stringify(currentViewParams);

      if(isDifferentRoute || isDifferentView || isDifferentParams)
      {
        var nextView;
        var lastView = views[current];

        // If the view's the same, ask it to handle the route change itself...
        if(!isDifferentView && lastView.routeUpdate)
        {
          var handled = lastView.routeUpdate(route);
          currentViewParams = route.params;
          currentRoute = route.route;

          if(handled !== false){
            return;
          }
        }

        // calls will hide and gets hand over data if available
        if(lastView)
        {
          if(lastView.willHide)
          {
            extra = lastView.willHide(route.view);
          }
        }

        // check for back to re-use previous view
        if(route.direction === 'back')
        {
          lastView = views.pop();
          lastView.destroy();
          current --;

          if(views[current] !== undefined)
          {
            nextView = views[current];
          }
          else
          {
            nextView = flour.getView(route.view, route.params, extra);
            views.push(nextView);
          }
        }
        else
        {
          nextView = flour.getView(route.view, route.params, extra);
          views.push(nextView);
        }

        // update our stack and start loading
        current = views.length - 1;
        self.displayView(nextView, lastView);
        
        // update currents for checking against
        currentRoute = route.route;
        currentViewName = route.view;
        currentViewParams = route.params;
      }

      
      if(route.action && self.view[route.action] !== undefined)
      {
        self.view[route.action](route.params);
      }
    }else{
      flour.error('View "' + route.view + '" does not exist.');
    }   
  });




  /*
  |
  | On init
  |
  */
  flour.defer(function(){
    router.matchCurrentRequest();
  });

};

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
    var isTernary = false;
    var condition = undefined;
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
    isTernary = value.indexOf('?') === -1 ? false : true;

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
    if(isConditional || isTernary)
    {
      if(isConditional){
        var pieces = value.split('=');
        value = pieces[0];
        condition = pieces[1];

        if(isTernary)
        {
          var pieces = condition.split('?');
          var results = pieces[1].split(':');
          
          condition = pieces[0];
          conditionTrue = results[0];
          conditionFalse = results[1] === undefined ? false : results[1];

          if(conditionTrue === 'true'){ conditionTrue = true; }
          if(conditionFalse === 'false'){ conditionFalse = false; }
        }

        onChangeHandler = function(data)
        {
          data = data == condition ? conditionTrue : conditionFalse;
          binder.update($el, data);
        };
      }
      else
      {
        var pieces = value.split('?');
        var results = pieces[1].split(':');
        
        value = pieces[0];
        conditionTrue = results[0];
        conditionFalse = results[1] === undefined ? false : results[1];

        if(conditionTrue === 'true'){ conditionTrue = true; }
        if(conditionFalse === 'false'){ conditionFalse = false; }

        onChangeHandler = function(data)
        {
          data = data ? conditionTrue : conditionFalse;
          binder.update($el, data);
        };
      }
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

var flour = flour || {};



//
//  Sets passed elements innerHTML to the data
//
flour.addBinder('html', 
{
  update: function($el, data)
  {
    $el.html(data);
  }
});




//
//  Sets passed elements text to the data
//
flour.addBinder('text', 
{
  update: function($el, data)
  {
    $el.text(data);
  }
});




//
//  Sets the value of a form element to the data and also
//  adds change event listeners and updates the model
//
flour.addBinder('value', 
{
  attach: function($el, binding, view)
  {
    var type = $el[0].nodeName;

    if(type === 'INPUT' || type === 'TEXTAREA')
    {
      var inputType = $el[0].type;

      if(inputType === 'checkbox')
      {
        $el.on('change', function(event)
        {             
          var val = ($el.prop('checked'));
          view.set(binding, val, false);
        });
      }
      else if(inputType === 'radio')
      {
        $el.on('change', function(event)
        {
          var val = $el.val();
          view.set(binding, val, false);
        });
      }
      else
      {
        $el.on('keypress change keyup', function(event)
        {
          var val = $el.val();
          view.set(binding, val, false);
        });
      }
    }

    if(type === 'SELECT')
    {
      $el.on('change', function(event)
      {
        var val = $el.val();
        view.set(binding, val, false);
      });
    }
  },
  

  update: function($el, data)
  {
    var $type = $el[0].nodeName;
    var $inputType = $el[0].type;

    if($inputType === 'checkbox')
    {
      $el.prop('checked', data);
    }
    else if($el.attr('type') === 'radio')
    {
      if($el.val() === data)
      {
        $el.prop('checked', true);
      }
    }
    else
    {
      if($el.val() !== data)
      {
        $el.val(data);
      }
    }
  }
});




//
//  Shows and hides the passed element depending on the data
//
flour.addBinder('show', 
{
  update: function($el, data)
  {
    var display = $el.data('display');
    if(data)
    {
      $el.css('display', display);
    }
    else
    {
      $el.css('display', 'none');
    }
  },
  attach: function($el, binding, view)
  {
    var displayDefault = $el.css('display');
    if(displayDefault === 'none')
    {
      displayDefault = 'block';
    }

    $el.data('display', displayDefault);
  }
});



flour.addBinder('show-inline', 
{
  update: function($el, data)
  {
    if(data)
    {
      $el.css('display', 'inline');
    }
    else
    {
      $el.css('display', 'none');
    }
  }
});




//
//  Hides and shows the passed element depending on the data
//
flour.addBinder('hide', 
{
  update: function($el, data)
  {
    if(data)
    {
      $el.css('display', 'none');
    }
    else
    {
      $el.css('display', 'block');
    }
  }
});




//
//  Straight up adds the class to the passed element from the data
//
flour.addBinder('class', 
{
  update: function($el, data)
  {
    var lastClass = $el.data('last-class');
    if(lastClass)
    {
      $el.removeClass(lastClass);
    }

    $el.data('last-class', data);
    $el.addClass(data);
  }
});




//
//  Injects an already created view into the passed element
//
flour.addBinder('view',
{
  attach: function($el, binding, view)
  {
    if(view[binding])
    {
      $el.append(view[binding].el);
    }
  }
});




//
//  Adds the element as a view property 
//
flour.addBinder('name',
{
  attach: function($el, binding, view)
  {
    view[binding] = null;
    view[binding] = $el;
  }
});





var flour = flour || {};


/*
|
| Store our filter in here
|
*/
flour.filters = {};



/*
|
| Add our filter to our filters object
|
*/
flour.addFilter = function(name, filter)
{
  flour.filters[name] = filter;
};








var flour = flour || {};



//
//  Formats a json string
//
flour.addFilter('json_format', function(json, params)
{
  var spaces = params === undefined ? 2 : parseInt(params);

  return JSON.stringify(json, undefined, spaces)
});
/*
|
|  Return href with base url prepended
|
*/
Handlebars.registerHelper('link_to', function(context, options) 
{  
  return flour.config('base_url') + '/' + context;
});



/*
|
|  Render a specified template with passed data
|
*/
Handlebars.registerHelper('render_template', function(template, data) 
{
  return flour.getTemplate(template)({'data': data});
});

var flour = flour || {};


/*
|
| Store our helpers in this object
|
*/
flour.helpers = {};


/*
|
| Add a helper to our object
|
*/
flour.addHelper = function(name, helper)
{
  flour.helpers[name] = helper;
};


/*
|
| Create instance and or return the helper
|
*/
flour.getHelper = function(name)
{
  if(flour.isFunction(flour.helpers[name]))
  {
    flour.helpers[name] = new flour.helpers[name]();
  }
  
  return flour.helpers[name];
}

var flour = flour || {};


/*
|
| Default request handler
|
*/
flour.requestHandler = function(response, status, options)
{
  if(options[status])
  {
    options[status](response);
  }
};



/*
|
| Default request pre processor
|
*/
flour.requestPreProcessor = function(data, method)
{
  return data;
};




/*
|
| Ajax request wrapper method
|
*/
flour.request = {
  
  get: function(url, data, options)
  {
    return this.doRequest(url, data, options, 'get');
  },

  put: function(url, data, options)
  {
    return this.doRequest(url, data, options, 'put');
  },

  post: function(url, data, options)
  {
    return this.doRequest(url, data, options, 'post');
  },

  delete: function(url, data, options)
  {
    return this.doRequest(url, data, options, 'delete');
  },

  doRequest: function(url, data, options, method) 
  {
    if(options.silent !== true)
    {
      flour.publish('http-request:start');
    }

    data = flour.requestPreProcessor(data, method);

    return $.ajax({
      url: url,
      type: method,
      data: data,

      success: function(response, status)
      {
        if(options.silent !== true)
        {
          flour.publish('http-request:end');
        }

        flour.requestHandler(response, status, options);
      }
    });
  }
};




/*
|
| HTTP class, returns a simple function that accepts data and callback options
|
*/
flour.http = function(url, method, requestOptions)
{
  if(method === undefined)
  {
    method = 'get';
  }


  //
  //  Returns the url with variables in place
  //
  var parseURL = function(data, originalURL)
  {
    if(data !== undefined)
    {
      // replace any url strings with the data key
      for(var key in data)
      {
        if(originalURL.indexOf(':' + key) !== -1)
        {
          var replaceString = ':' + key;
          originalURL = originalURL.replace(replaceString, data[key]);
          delete(data[key]);
        }
      }
    }

    return originalURL;
  }


  //
  //  Callable return function
  //
  return function(data, options)
  {
    var data = flour.clone(data);
    var parsedURL = parseURL(data, url);

    // pre process
    data = flour.requestPreProcessor(data, method);

    // publish http
    if(options.silent !== true)
    {
      flour.publish('http-request:start');
    }

    // create our request options
    var request = {
      url: parsedURL,
      type: method,
      data: data,

      success: function(response, status)
      {
        if(options.silent !== true)
        {
          flour.publish('http-request:end');
        }

        flour.requestHandler(response, status, options);
      }
    };

    // overide with custom $.ajax options
    if(requestOptions !== undefined)
    {
      for(var option in requestOptions)
      {
        request[option] = requestOptions[option];
      }
    }

    // do the request
    return $.ajax(request);
  };
};

var flour = flour || {};


/*
|
| Store our lists in here
|
*/
flour.lists = {};



/*
|
| Add our list to our lists object
|
*/
flour.addList = function(name, list)
{
  list.prototype = new flour.baseList();
  flour.lists[name] = list;
};




/*
|
| Returns an instance of a list
|
*/
flour.getList = function(name, params)
{
  var list = new flour.lists[name]();
  
  // set these on the list
  list.eventListeners = {};
  list.subscriptions = [];
  list.lookup = {};
  list.views = [];
  list.list = [];
  list.raw = [];
  list.el = null;

  list.id = flour.instanceId;
  flour.instanceId ++;

  // publish create event
  flour.publish('flour:list_create', {name: name, list: list});

  // init
  list.initialize(params);

  return list;
};





/*
|
| Base list class
|
*/
flour.baseList = function()
{
  

  /*
  |
  | View class variables
  |
  */
  var self = this;
  

  


  /*
  |
  | Set up our default el and add delegated events
  |
  */
  self.initialize = function(params)
  {
    var self = this;

    // default vals
    self.key = self.key ? self.key : false;
    self.events = self.events ? self.events : {};
    
    self.itemElClass = self.itemElClass ? self.itemElClass : '';
    self.itemElType = self.itemElType ? self.itemElType : 'div';
    self.wrapElType = self.wrapElType ? self.wrapElType : 'div';

    // our list el
    self.el = $('<' + self. wrapElType + ' class="flour-list"></' + self. wrapElType + '>');

    // bring helpers into view name space
    self.addHelpers();

    // add events to our wrapper el
    self.addEvents();

    // init our view
    self.init(params);
  };




  /*
  |
  | itterates our items and creates a lookup
  |
  */ 
  self.generateLookup = function()
  {
    var self = this;

    self.raw.length = 0;
    self.lookup = {};

    if(!self.key)
    {
      for(var i = 0, n = self.list.length; i < n; i ++)
      {
        var itemData = self.list[i].data;
        self.raw.push(itemData);
      }

      self.trigger('change', self.raw);
      return;
    }

    for(var i = 0, n = self.list.length; i < n; i ++)
    {
      var itemData = self.list[i].data;
      self.raw.push(itemData);
      self.lookup[itemData[self.key]] = i;
    }


    self.trigger('change', self.raw);
  };




  /*
  |
  | returns item from lookup
  |
  */
  self.getItem = function(id)
  {
    var self = this;

    return self.list[self.getItemIndex(id)];
  }

  self.getItemIndex = function(id)
  {
    var self = this;

    if(!self.key)
    {
      return id;
    }

    return self.lookup[id];
  }




  /*
  |
  | Adds our delegated events to our el
  |
  */
  self.addEvents = function()
  {
    var self = this;

    if(self.events !== undefined)
    {
      for(var e in self.events)
      {
        (function(){
          var eventCallback = self.events[e];
          var eventOptions = e.split(' ');
          var eventSelector = eventOptions.pop();
          var eventType = eventOptions.join(' ');

          if(self[eventCallback] !== undefined)
          {
            self.el.on(eventType, eventSelector, function(event)
            {
              var $target = $(event.currentTarget);
              self[eventCallback](event, $target);
            });
          }
          else
          {
            if(flour.isFunction(eventCallback))
            {
              self.el.on(eventType, eventSelector, function(event)
              {
                var $target = $(event.currentTarget);
                eventCallback(event, $target);
              });
            }
          }
        }());
      }
    }
  };


  // self.addEvent = function(eventType, eventSelector, eventCallback)
  // {
  //   var self = this;
    
  //   if(flour.isFunction(eventCallback))
  //   {
  //     self.el.on(eventType, eventSelector, function(event)
  //     {
  //       var $target = $(event.currentTarget);
  //       eventCallback(event, $target);
  //     });
  //   }
  // };




  /*
  |
  | Adds selected helpers into our view prototype name space
  |
  */
  self.addHelpers = function()
  {
    var self = this;

    if(self.helpers !== undefined)
    {
      for(var i = 0, n = self.helpers.length; i < n; i ++)
      {
        var helperName = self.helpers[i];
        self[helperName] = flour.getHelper(helperName);

        if(self[helperName].init !== undefined)
        {
          self[helperName].init(self);
        }
      }
    }
  };




  /*
  |
  | Returns an array of elements that match the selector within the view parent el
  |
  */
  self.find = function(selector)
  {
    var self = this;
    return self.el.find(selector);
  };






  /*
  |
  | Add an item to the list
  |
  */
  self.add = function(item, index)
  {
    var self = this;

    var createItem = function(item)
    {
      // check if this item already exists
      if(self.lookup[item[self.key]] !== undefined)
      {
        return;
      }

      // set item index and check in range
      if(index === undefined)
      {
        item['index'] = self.list.length;
      }
      else
      {
        if(index > self.list.length)
        {
          index = undefined;
          item['index'] = self.list.length;
        }
        else
        {
          item['index'] = index;
        }
      }

      // create element with rendered html
      var el = $('<' + self.itemElType + '>');
      el.attr('class', self.itemElClass);
      //el.html(flour.getTemplate(template)(item));

      var newItem = {
        data: item,
        el: el
      };

      self.renderItem(newItem);

      if(index === undefined)
      {
        // add to end of self.list
        self.list.push(newItem);
        self.el.append(el);
      }
      else
      {
        // add at specific spot
        if(index > 0)
        {
          var item = self.list[index - 1];
          self.list.splice(index, 0, newItem);
          item.el.after(el);
        }
        else
        {
          self.list.splice(0, 0, newItem);
          self.el.prepend(el);
        }

        // update all indexes on items > the one we added
        // for(var i = (index + 1), n = self.list.length; i < n; i ++)
        // {
        //   item = self.list[i];
        //   var itemIndex = item.data.index;
        //   self.setItem(item, 'index', itemIndex + 1);
        // }
      }
    }
    

    // create all items if array
    if(flour.isArray(item))
    {
      for(var i = 0, n = item.length; i < n; i ++)
      {
        createItem(item[i]);
        if(index !== undefined)
        {
          index ++;
        }
      }
    }
    else
    {
      createItem(item);
    }

    self.generateLookup();

    return index === undefined ? self.list.length : index;
  };



  /*
  |
  | Remove an item from the list
  |
  */
  self.remove = function(index)
  {
    var self = this;
    var index = self.getItemIndex(index);
    var item = self.list[index];
    
    if(item)
    {
      item.el.remove();
      item.data = null;
      self.list.splice(index, 1);

      // update all indexes on items > the one we removed
      // for(var i = index, n = self.list.length; i < n; i ++)
      // {
      //   item = self.list[i];
      //   var itemIndex = item.data.index;
      //   self.setItem(item, 'index', itemIndex - 1);
      // }

      self.generateLookup();

      return index;
    }

    return false;
  };



  /*
  |
  | Remove all items from the list
  |
  */
  self.removeAll = function()
  {
    var self = this;
    
    for(var i = 0, n = self.list.length; i < n; i ++)
    {
      var item = self.list[i];
      item.el.remove();
      item.data = null;
    }

    self.list.length = 0;
    self.generateLookup();
  };



  /*
  |
  | Move an item from one slot to the other
  |
  */
  self.move = function(id, newIndex)
  {
    var self = this;
    var item = self.getItem(id);
    var oldIndex = self.getItemIndex(id);
    var direction = oldIndex > newIndex ? 'up' : 'down';

    // max out
    if(newIndex > self.list.length)
    {
      newIndex = self.list.length;
    }

    // move the element
    if(newIndex > 0)
    {
      // when moving down, use newIndex as the item still
      // exists before the item you wish to append it after
      var beforeItem = direction === 'up' ? self.list[newIndex - 1] : self.list[newIndex];
      beforeItem.el.after(item.el);
    }
    else
    {
      self.el.prepend(item.el);
    }

    // move the item
    self.list.splice(newIndex, 0, self.list.splice(oldIndex, 1)[0]);
    self.generateLookup();
  };



  /*
  |
  | Updates an item in the list
  |
  */
  self.set = function(index, key, value, doRender)
  {
    var self = this;
    var item = self.getItem(index);
    self.setItem(item, key, value, doRender);
  };

  self.setItem = function(item, key, value, doRender)
  {
    var self = this;

    var data = item.data;
    var doRender = doRender === undefined ? true : doRender;
    var objectChain = flour.setObjectKeyValue(data, key, value);


  

    // Check for bindings
    // if(objectChain)
    // {
    //   var len = objectChain.length;
    //   for(var i = 0; i < len; i ++)
    //   {
    //     var bindingKey = objectChain.join('.');
    //     if(listeners[bindingKey] !== undefined)
    //     {
    //       var value = flour.getObjectKeyValue(data, bindingKey);

    //       for(var i = 0, n = listeners[bindingKey].length; i < n; i ++)
    //       {
    //         var bindingInfo = listeners[bindingKey][i];
    //         var options = flour.bind.binders[bindingInfo.name];
    //         var $el = item.el.find(bindingInfo.selector);


    //         options.change($el, value);
    //         doRender = false;
    //       }
    //     }
    //     objectChain.pop();
    //   }
    // }

    // if nothing was bound to that value, re-render?
    if(doRender)
    {
      if(key !== 'index' && self.key)
      {
        self.renderItem(item);
      }
    }

    // trigger callback
    self.trigger('change', self.raw);
  };






  /*
  |
  | Return an item's value
  |
  */
  self.get = function(index, key)
  {
    var self = this;
    var item = self.getItem(index);
    
    return flour.getObjectKeyValue(item.data, key);
  };






  /*
  |
  | Render item
  |
  */
  self.renderItem = function(item)
  {
    var self = this;

    item.el.html(flour.getTemplate(self.template)(item.data));

    // populate bound elements
    // for(var key in self.eventListeners)
    // {
    //   var bindings = self.eventListeners[key];
    //   for(var i = 0, n = bindings.length; i < n; i ++)
    //   {
    //     var bindingInfo = bindings[i];
    //     var $el = item.el.find(bindingInfo.selector);
    //     var value = flour.getObjectKeyValue(item.data, key);

    //     flour.bind.binders[bindingInfo.name].change($el, value);
    //   }
    // }
  };






  /*
  |
  | View event trigger and listeners
  |
  */
  self.on = function(event, callback)
  {
    var self = this;

    if(self.eventListeners[event] === undefined)
    {
      self.eventListeners[event] = [];
    }
    
    self.eventListeners[event].push(callback);
  };

  self.off = function(event, callback)
  {
    var self = this;
    var events = self.eventListeners[event];

    if(events === undefined)
    {
      return;
    }

    if(callback !== undefined)
    {
      for(var i = 0, n = events.length; i < n; i ++)
      {
        if(callback === events[i])
        {
          events[i] = null;
          break;
        }
      }
    }
    else
    {
      events.length = 0; // this properly empties an array from memory
    }
  }

  self.trigger = function(event, data)
  {
    var self = this;
    var eventListeners = self.eventListeners[event];

    if(eventListeners === undefined || eventListeners === null)
    {
      return;
    }

    for(var i = 0, n = eventListeners.length; i < n; i ++)
    {
      var listenerCallback = eventListeners[i];
      if(listenerCallback !== null && listenerCallback !== undefined)
      {
        listenerCallback(data);
      }
    }
  };






  /*
  |
  | Subscribe to events, handled by view so subscriptions can be destroyed
  |
  */
  self.subscribe = function(eventName, callback)
  {
    var self = this;
    var subscription = flour.subscribe(eventName, callback);
    
    self.subscriptions.push(
    {
      eventName: eventName,
      callback: callback
    });
  };





  /*
  |
  | Gets a view and keeps a copy of it to destroy on 
  |
  */
  self.getView = function(viewName, params)
  {
    var self = this;
    var view = flour.getView(viewName, params);
    self.views.push(view);

    return view;
  };




  
  /*
  |
  | Gets a list and keeps a copy of it to destroy on 
  |
  */
  self.getList = function(listName, params)
  {
    var self = this;
    var list = flour.getList(listName, params);
    self.views.push(list);

    return list;
  };





  /*
  |
  | Destroy this view, remove events, subscriptions etc
  |
  */
  self.destroy = function()
  {
    var self = this;

    // Trigger destroy event
    self.trigger('destroy');

    // Remove element events
    self.el.off();

    // Remove all subscriptions
    for(var i = 0, n = self.subscriptions.length; i < n; i ++)
    {
      var subscription = self.subscriptions[i];
      flour.unsubscribe(subscription.eventName, subscription.callback);
    }

    // Destroy all sub views created
    for(var i = 0, n = self.views.length; i < n; i ++)
    {
      var view = self.views[i];
      view.destroy();
    }

    // Remove all event listeners
    for(var eventName in self.eventListeners)
    {
      self.eventListeners[eventName] = null;
    }

    // Call post destroy
    if(self.postDestroy !== undefined)
    {
      self.postDestroy();
    }

    // publish destroy
    flour.publish('flour:list_destroy', self.id);
  };

};





var flour = flour || {};


/*
|
|
| Flour log func, if log view exists, pass it on
|
|
*/
flour.log = function(data, type)
{
  if(flour.logView !== undefined)
  {
    flour.logView.log(data, type);
  }
};

var flour = flour || {};

/*
|
| Store subsciption event callbacks here
|
*/
flour.subscriptions = {};



/*
|
| Publish events
|
*/
flour.publish = function(eventName, data)
{
  var subscriptions = flour.subscriptions[eventName];

  if(subscriptions !== undefined)
  {
    for(var i = 0, n = subscriptions.length; i < n; i ++)
    {
      if(subscriptions[i])
      {
        subscriptions[i](data);
      }
    }
  }
};



/*
|
| Subscribe to an event
|
*/
flour.subscribe = function(eventName, callback)
{
  if(flour.subscriptions[eventName] === undefined)
  {
    flour.subscriptions[eventName] = [];
  }

  flour.subscriptions[eventName].push(callback);
}





/*
|
| Unsubscribe from an event
|
*/
flour.unsubscribe = function(eventName, callback)
{
  if(flour.subscriptions[eventName] !== undefined)
  {
    for(var i = 0, n = flour.subscriptions[eventName].length; i < n; i ++)
    {
      if(callback === flour.subscriptions[eventName][i])
      {
        flour.subscriptions[eventName].splice(i, 1);
      }
    }
  }
}

var flour = flour || {};

/*
|
| flour router : class
|
*/
flour.router = function(routes, basePath)
{
  // Return an instance if the new keyword wasn't used
  if (!(this instanceof flour.router)) 
  {
    return new flour.router(name, options);
  }

  // defaults
  basePath = basePath || '';

  // Self keyword
  var self = this;
  var requestedURLs = [];
  var lastRequestIndex = false;




  /*
  |
  | Listen for window state change and react
  |
  */
  flour.subscribe('history:state_change', function(data)
  {
    self.matchCurrentRequest(data);
  });

  window.addEventListener('popstate', function(e)
  {
    flour.publish('history:state_change', {
      popstate: true
    });
  });




  /*
  |
  | Match the current request
  |
  */
  self.matchCurrentRequest = function(data)
  {
    data = data === undefined ? {} : data;

    var bits = false;
    var params = {};
    var getVariables = [];
    var hash = false;
    
    // define flag for publishing route change by silent 
    var publish = true;
    if(flour.isObject(data))
    {
      if(data.silent === true)
      {
        publish = false;
      }
    }

    // fetch the request url
    requestURL = document.URL;
    originalRequestURL = requestURL;

    // Pull out hash variables from the url
    if(requestURL.indexOf('#') !== -1) 
    {
      bits = requestURL.split('#');
      hash = bits[1];
      requestURL = bits[0];
    }
    else if(window.location.hash)
    {
      hash = window.location.hash.replace('#', '');
    }

    // Pull out get variables from the url
    if(requestURL.indexOf('?') !== -1) 
    {
      bits = requestURL.split('?');
      params = {};
      getVariables = bits[1].split('&');
      requestURL = bits[0];
    }


    // Strip and match our request URL
    var strippedRequestURL = requestURL.replace(flour.config('base_url') + basePath, '');
    var routeDetails = self.match(strippedRequestURL);
    var direction = 'forward';

    // Save full request URL with get params and # as original string
    routeDetails.requestURL = originalRequestURL.replace(flour.config('base_url') + basePath, '');

    // add hash value
    routeDetails.hash = hash;

    // check for direction
    var i = requestedURLs.length - 2;
    if(data.popstate && routeDetails.requestURL === requestedURLs[i])
    {
      requestedURLs.pop();
      direction = 'back';
    }
    else
    {
      requestedURLs.push(routeDetails.requestURL);
    }

    // add direction
    routeDetails.direction = direction

    // add get vars to the params
    if(getVariables)
    {
      for(var i = 0, n = getVariables.length; i < n; i ++)
      {
        var keyValue = getVariables[i].split('=');
        routeDetails.params[keyValue[0]] = keyValue[1];
      }
    }

    flour.store.set('route', routeDetails, publish);
  };


  // find match
  self.match = function(requestURL)
  {
    var params = {};
    var paramNames = false;

    for(var i in routes)
    {
      var route = i;
      var routeDetails = routes[i];
      
      // Create the regular expression
      var routeRegex = new RegExp('^' + self.getRegex(route) + '$', 'i');

      // Test for a match against our current URL
      if(routeRegex.test(requestURL))
      {
        var routeSections = route.split('/');
        var routeValues = requestURL.split('/');

        var paramName = '';
        for(var i = 0; i < routeSections.length; i ++)
        {
          if(paramName = routeSections[i].match(/:([\w-]+)/))
          {
            params[paramName[1]] = routeValues[i];
          }
        }

        routeDetails['route'] = route;
        routeDetails['params'] = params;

        return routeDetails;
      }
    }

    return false;
  };


  // create reg ex
  self.getRegex = function(route)
  {
    return route.replace(/:(\w+)/g, "([\\w-=%\.]+)");
  };

};

var flour = flour || {};


/*
|
| flour store, stores values used across a project
|
*/
flour.store = {
  
  values: {},

  set: function(name, value, silent)
  {
    var self = this;
    var objectChain = flour.setObjectKeyValue(self.values, name, value);

    if(silent !== false)
    {
      var rootKey = objectChain[0];
      var rootValue = self.values[rootKey];

      flour.publish(rootKey + ':change', rootValue);
    }

    flour.publish('flour:store_update', self.values);
  },

  get: function(name)
  {
    var self = this;

    if(!name)
    {
      return self.values;
    }

    var property = flour.getObjectKeyValue(self.values, name);

    return flour.clone(property);
  }

};

var flour = flour || {};


/*
|
| Store our templates in this object
|
*/
flour.templates = {};


/*
|
| Add and compile a template
|
*/
flour.addTemplate = function(name, template)
{
  flour.templates[name] = Handlebars.compile(template);
};


/*
|
| Return a template
|
*/
flour.getTemplate = function(name)
{
  if(name !== undefined)
  {
    if(flour.templates[name] !== undefined)
    {
      return flour.templates[name];
    }
  }


  if(flour.templates['flour:missing_template'] === undefined)
  {
    flour.addTemplate('flour:missing_template', '<div>Missing template.</div>');
  }

  return flour.templates['flour:missing_template'];
}


var flour = flour || {};




/*
|
|	Push state
|
*/
flour.pushState = function(url, data, title)
{
	title = title === undefined ? flour.config('title') : title;
	data = data === undefined ? {} : data;

	history.pushState(data, title, url);
	flour.publish('history:state_change', data);
};




/*
|
|	Returns true if passed param is an object, else false
|
*/
flour.isObject = function(obj)
{
	if((typeof obj == "object") && (obj !== null))
	{
	  return true;
	}
	
	return false;
};



/*
|
|	Returns true if passed param is an array, else false
|
*/
flour.isArray = function(arr)
{
	if( Object.prototype.toString.call( arr ) === '[object Array]' ) {
	  return true;
	}
	return false;
};




/*
|
|	Returns true if passed param is an object, else false
|
*/
flour.isFunction = function(func) 
{
 var getType = {};
 return func && getType.toString.call(func) === '[object Function]';
};



/*
|
|	Returns true is passed param is a string, else false
|
*/
flour.isString = function(str)
{
	if (typeof str == 'string' || str instanceof String)
	{
		return true;
	}
	else
	{
		return false;
	}
};




/*
|
|	Returns a clone
|
| This method was found here - http://stackoverflow.com/questions/728360/most-elegant-way-to-clone-a-javascript-object
|
*/
flour.clone = function(obj)
{
	var copy;

	// Handle the 3 simple types, and null or undefined
	if(null == obj || "object" != typeof obj) return obj;

	// Handle Date
	if(obj instanceof Date)
	{
	    copy = new Date();
	    copy.setTime(obj.getTime());
	    return copy;
	}

	// Handle Array
	if(obj instanceof Array)
	{
	    copy = [];
	    for(var i = 0, len = obj.length; i < len; i++)
	    {
	      copy[i] = flour.clone(obj[i]);
	    }
	    return copy;
	}

	// Handle Object
	if(obj instanceof Object) 
	{
    copy = {};
    for(var attr in obj) 
    {
      if (obj.hasOwnProperty(attr)) copy[attr] = flour.clone(obj[attr]);
    }
    return copy;
	}

	throw new Error("Unable to copy obj! Its type isn't supported.");
};






/*
|
|	Returns the string with an s if it's more than 1
|
*/
flour.pluralize = function(string, number)
{
	return number === 1 ? string : string + 's';
};




/*
|
|	Converts a rgb to hex
|
*/
flour.rgb2hex = function(rgb)
{
  if (/^#[0-9A-F]{6}$/i.test(rgb))
  {
    return rgb;
  }

  rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
  function hex(x) 
  {
    return ("0" + parseInt(x).toString(16)).slice(-2);
  }

  return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
};




/*
|
|	Filter and return a readable file size format
|
*/
flour.readableBytes = function(bytes) 
{
	bytes = parseInt(bytes);
	if(bytes === 0){ return 0; }
  var s = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'];
  var e = Math.floor(Math.log(bytes) / Math.log(1024));
  return (bytes / Math.pow(1024, Math.floor(e))).toFixed(2) + " " + s[e]; 
};




/*
|
|	Truncates a string
|
*/
flour.truncate = function(str, len)
{	
	if(str && str.length > len && str.length > 0) 
  {
    var new_str = str + " ";
    new_str = str.substr (0, len);
    new_str = str.substr (0, new_str.lastIndexOf(" "));
    new_str = (new_str.length > 0) ? new_str : str.substr (0, len);

    return new_str;
  }

  return str;
};




/*
|
|	Defer execution
|
*/
flour.defer = function(callback)
{
	setTimeout(callback, 0);
};




/*
|
|	Map a string value to an object
|
| var re = /\[(['"\w]+)\]/g;
|
*/
flour.setObjectKeyValue = function(object, key, value)
{
	if(!object || !key)
	{
		return;
	}

	// Create booleans
	var hasFullstop = key.indexOf('.') === -1 ? false : true;
	var hasSquareBrace = key.indexOf('[') === -1 ? false : true;
	

	// Split if we have either of these
	if(hasSquareBrace || hasFullstop)
	{
		key = key.replace(/\]|'|"/g, '');
		var pieces = key.split(/\.|\[/g);
		var objectPoint = object;

		var length = pieces.length;
		var lastIndex = length - 1;
		
		for(var i = 0; i < length; i ++)
		{
			var nextPoint = pieces[i];

			if(i === lastIndex)
			{
				objectPoint[nextPoint] = value;
			}
			else
			{
				if(!objectPoint[nextPoint])
				{
					objectPoint[nextPoint] = {};
				}

				objectPoint = objectPoint[nextPoint];
			}
		}

		return pieces;
	}
	else
	{
		object[key] = value;
		return[key];
	}
};


/*
|
|	Return an object value from a string key
|
*/
flour.getObjectKeyValue = function(object, key)
{
	if(!object || !key)
	{
		return;
	}

	// Create booleans
	var hasFullstop = key.indexOf('.') === -1 ? false : true;
	var hasSquareBrace = key.indexOf('[') === -1 ? false : true;
	

	// Split if we have either of these
	if(hasSquareBrace || hasFullstop)
	{
		key = key.replace(/\]|'|"/g, '');
		var pieces = key.split(/\.|\[/g);
		var objectPoint = object;

		var length = pieces.length;
		var lastIndex = length - 1;

		for(var i = 0; i < length; i ++)
		{
			var nextPoint = pieces[i];

			if(i === lastIndex)
			{
				return objectPoint[nextPoint];
			}
			else
			{
				if(!objectPoint[nextPoint])
				{
					return undefined;
				}

				objectPoint = objectPoint[nextPoint];
			}
		}
	}
	else
	{
		return object[key];
	}
};




/*
|
| Set flour app config vars : TODO
|
*/
flour.configValues = {};

flour.config = function(param, value)
{
	if(param === undefined)
	{
		return flour.configValues;
	}

	// If object, set all object key -> values
	if(flour.isObject(param))
	{
		for(var paramName in param)
		{
			flour.configValues[paramName] = param[paramName];
		}
	}
	else
	{
		// Setter getter behaviour
		if(value === undefined)
		{
			return flour.configValues[param];
		}
		else
		{
			flour.configValues[param] = value;
		}
	}
};




/*
|
|	Generates a lookup hash table
|
*/
flour.generateLookup = function(data, key)
{
	if(flour.isArray(data))
	{
		var lookup = {};
		for(var i = 0, n = data.length; i < n; i ++)
		{
			var item = data[i];
			if(item[key])
			{
				lookup[item[key]] = i;
			}
		}

		return lookup;
	}

	return false;
};




/*
|
|	Consoles our an error
|
*/
flour.error = function(error)
{
	console.error('flour: ' + error);
};




/*
|
|	Extracts and analysis a form submission, returns a formatted object with errors
|
*/
flour.validateFormData = function(form)
{
	var formData = {};
	var errors = {};
	var hasErrors = false;
	var inputs = form.find('input, textarea, select');


	// retrieve input data
	$.each(inputs, function(index, input)
	{
		// input name
		$input = $(input);

		var name = $input.attr('name');

		// $input value
		if($input[0].type === 'select-multiple')
		{
			var value = [];
			var options = $input.find('option');
			
			$.each(options, function(index, option)
			{
				var $option = $(option);
				if($option.data('selected'))
				{
					value.push($option.attr('value'));
				}
			});
			
			formData[name] = value;
		}
		else if($input[0].type === 'checkbox') 
		{
			var value = $input[0].checked ? true : false;
			formData[name] = value;
		}
		else if($input[0].type === 'radio') 
		{
			//var value = $input[0].checked ? true : false;
			if($input[0].checked)
			{
				var value = $input.val();
				formData[name] = value;
			}
		}
		else
		{
			var value = $input.val();	
			formData[name] = value;
		}


		// check for not blank
		if($input.hasClass('validate'))
		{
			if($input[0].type === 'select-multiple')
			{
				if(value.length === 0)
				{
					errors[name] = 'empty';
					hasErrors = true;
				}	
			}
			else
			{
				if(value === '' || value === false)
				{
					errors[name] = 'empty';
					hasErrors = true;
				}
			}
		}

		// check for valid email
		if($input.hasClass('validate-email'))
		{
			if(!flour.test.email(value))
			{
				errors[name] = 'invalid';
				hasErrors = true;
			}
		}
	});


	return {
		data: formData,
		errors: hasErrors ? errors : false
	};
};




var flour = flour || {};





/*
|
| Test module
|
*/
flour.test = {

  //
  //  Test for legit email
  //
  email: function(email)
  {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

};

var flour = flour || {};


/*
|
| Store our views in this object
|
*/
flour.views = {};


/*
|
| Add a view to our object
|
*/
flour.addView = function(name, view)
{
  view.prototype = new flour.baseView();
  flour.views[name] = view;
};


/*
|
| Returns an instance of a view
|
*/
flour.getView = function(name, params, extra)
{
  var view = new flour.views[name]();
  
  // set these on the view
  view.eventListeners = {};
  view.subscriptions = [];
  view.model = {};
  view.views = [];
  view.el = null;

  view.id = flour.instanceId;
  flour.instanceId ++;

  // publish create event
  flour.publish('flour:view_create', {name: name, view: view});

  // init
  view.initialize(params, extra);

  return view;
}


/*
|
| Base view class
|
*/
flour.baseView = function()
{
  

  /*
  |
  | View class variables
  |
  */
  var self = this;



  /*
  |
  | Set up our default el and add delegated events
  |
  */
  self.initialize = function(params, extra)
  {
    var self = this;

    // some view defaults
    self.events = self.events ? self.events : {};

    // view element container
    self.el = $('<div class="flour-view"></div>');

    // bring helpers into view name space
    self.addHelpers();

    // add events to our wrapper el
    self.addEvents();

    // create bindings
    flour.bindView(self);

    // init our view
    self.init(params, extra);
  };



  /*
  |
  | Adds our delegated events to our el
  |
  */
  self.addEvents = function()
  {
    var self = this;

    if(self.events !== undefined)
    {
      for(var e in self.events)
      {
        (function(){
          var eventCallback = self.events[e];
          var eventOptions = e.split(' ');
          var eventSelector = eventOptions.pop();
          var eventType = eventOptions.join(' ');

          if(self[eventCallback] !== undefined)
          {
            self.el.on(eventType, eventSelector, function(event)
            {
              var $target = $(event.currentTarget);
              self[eventCallback](event, $target);
            });
          }
          else
          {
            if(flour.isFunction(eventCallback))
            {
              self.el.on(eventType, eventSelector, function(event)
              {
                var $target = $(event.currentTarget);
                eventCallback(event, $target);
              });
            }
          }
        }());
      }
    }
  };




  /*
  |
  | Adds selected helpers into our view prototype name space
  |
  */
  self.addHelpers = function()
  {
    var self = this;

    if(self.helpers !== undefined)
    {
      for(var i = 0, n = self.helpers.length; i < n; i ++)
      {
        var helperName = self.helpers[i];
        self[helperName] = flour.getHelper(helperName);

        if(self[helperName].init !== undefined)
        {
          self[helperName].init(self);
        }
      }
    }
  };




  /*
  |
  | Returns an array of elements that match the selector within the view parent el
  |
  */
  self.find = function(selector)
  {
    var self = this;

    return self.el.find(selector);
  };



  /*
  |
  | Empties view el, inserts template - users self.template and self.model
  |
  */
  self.render = function()
  {
    var self = this;

    self.adoptTemplate();

    self.trigger('render');

    if(self.postRender !== undefined)
    {
      self.postRender();
    }
  };




  /*
  |
  | Empties view el, inserts template - users self.template and self.model
  |
  */
  self.adoptTemplate = function()
  {
    var self = this;

    // remove children views
    for(var i = 0, n = self.views.length; i < n; i ++)
    {
      self.views[i].el.detach();
    }


    // self.el.empty();
    var template = flour.getTemplate(self.template);
    self.el.html(template(self.model));
  };




  /*
  |
  | Get and set methods for manipulating our model object
  |
  */
  self.get = function(property)
  {
    var self = this;

    if(property === undefined)
    {
      return self.model;
    }

    return flour.getObjectKeyValue(self.model, property);
  };

  self.set = function(property, value, doRender)
  {
    var self = this;
    var objectChain;

    if(flour.isObject(property))
    {
      for(var propertyName in property)
      {
        self.model[propertyName] = property[propertyName];
      }
    }
    else
    {
      var temp = flour.getObjectKeyValue(self.model, property);
      if(value !== temp || flour.isArray(value) || flour.isObject(value))
      {
        objectChain = flour.setObjectKeyValue(self.model, property, value);
      }
      else
      {
        doRender = false;
      }
    }
    
    // major doRender (re-render)
    if(doRender !== false)
    {
      self.render();
    }

    // change events
    if(objectChain)
    {
      var len = objectChain.length;
      for(var i = 0; i < len; i ++)
      {
        var bindingKey = objectChain.join('.');
        self.trigger('model.' + bindingKey + ':change', self.get(bindingKey));

        objectChain.pop();
      }
    }
  };






  /*
  |
  | View event trigger and listeners
  |
  */
  self.on = function(event, callback)
  {
    var self = this;

    if(self.eventListeners[event] === undefined)
    {
      self.eventListeners[event] = [];
    }
    
    self.eventListeners[event].push(callback);
  };

  self.off = function(event, callback)
  {
    var self = this;

    var events = self.eventListeners[event];

    if(events === undefined)
    {
      return;
    }

    if(callback !== undefined)
    {
      for(var i = 0, n = events.length; i < n; i ++)
      {
        if(callback === events[i])
        {
          events[i] = null;
          break;
        }
      }
    }
    else
    {
      events.length = 0; // this properly empties an array from memory
    }
  }

  self.trigger = function(event, data)
  {
    var self = this;
    var eventListeners = self.eventListeners[event];

    if(eventListeners === undefined || eventListeners === null)
    {
      return;
    }

    for(var i = 0, n = eventListeners.length; i < n; i ++)
    {
      var listenerCallback = eventListeners[i];
      if(listenerCallback !== null && listenerCallback !== undefined)
      {
        listenerCallback(data);
      }
    }
  };




  /*
  |
  | Subscribe to events, handled by view so subscriptions can be destroyed
  |
  */
  self.subscribe = function(eventName, callback)
  {
    var self = this;
    var subscription = flour.subscribe(eventName, callback);
    
    self.subscriptions.push(
    {
      eventName: eventName,
      callback: callback
    });
  };





  /*
  |
  | Gets a view and keeps a copy of it to destroy on 
  |
  */
  self.getView = function(viewName, params, extra)
  {
    var self = this;
    var view = flour.getView(viewName, params, extra);
    self.views.push(view);

    return view;
  };





  /*
  |
  | Gets a list and keeps a copy of it to destroy on 
  |
  */
  self.getList = function(listName, params)
  {
    var self = this;
    var list = flour.getList(listName, params);
    self.views.push(list);

    return list;
  };





  /*
  |
  | Destroy this view, remove events, subscriptions etc
  |
  */
  self.destroy = function()
  {
    var self = this;

    // Trigger destroy event
    self.trigger('destroy');

    // Remove element events
    self.el.off();

    // Remove all subscriptions
    for(var i = 0, n = self.subscriptions.length; i < n; i ++)
    {
      var subscription = self.subscriptions[i];
      flour.unsubscribe(subscription.eventName, subscription.callback);
    }

    // Destroy all sub views created
    for(var i = 0, n = self.views.length; i < n; i ++)
    {
      var view = self.views[i];
      view.destroy();
    }

    // Remove all event listeners
    for(var eventName in self.eventListeners)
    {
      self.eventListeners[eventName] = null;
    }

    // Call post destroy
    if(self.postDestroy !== undefined)
    {
      self.postDestroy();
    }
    
    // publish destroy
    flour.publish('flour:view_destroy', self.id);

    // console.log('destroy view');
  };

};




