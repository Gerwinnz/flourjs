
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
  };



  /*
  |
  | Updates an item in the list
  |
  */
  self.set = function(index, key, value)
  {
    var self = this;
    var item = self.getItem(index);
    self.setItem(item, key, value);
  };

  self.setItem = function(item, key, value)
  {
    var self = this;

    var data = item.data;
    var doRender = true;
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
  };

};



