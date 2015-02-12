
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
flour.getView = function(name, params)
{
  var view = new flour.views[name]();
  
  // set these on the view
  view.eventListeners = {};
  view.subscriptions = [];
  view.model = {};
  view.views = [];
  view.el = null;

  // init
  view.initialize(params);

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
  self.initialize = function(params)
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
    self.init(params);
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
    
    // console.log('destroy view');
  };

};




