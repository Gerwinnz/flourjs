
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
  list.list = [];
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

  var raw = [];
  var itemClass = '';

  // var lookup = {};
  // var lookupKey = false; //options.key === undefined ? false : options.key;
  // var template = false; //options.template === undefined ? '' : options.template;
  // var itemClass = false; //options.itemClass === undefined ? '' : options.itemClass;
  // var wrapElType = false; //options.wrapElType === undefined ? 'div' : options.wrapElType;



  /*
  |
  | Set up our default el and add delegated events
  |
  */
  self.initialize = function(params)
  {
    var self = this;

    // default key
    self.key = self.key ? self.key : false;

    // our list el
    self.el = $('<div class="flour-list"></div>');

    // bring helpers into view name space
    self.addHelpers();

    // add events to our wrapper el
    self.addEvents();

    // add items
    self.add(params.items);

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

    raw.length = 0;
    lookup = {};

    if(!self.key)
    {
      for(var i = 0, n = self.list.length; i < n; i ++)
      {
        var itemData = self.list[i].data;
        raw.push(itemData);
      }

      self.trigger('change', raw);
      return;
    }

    for(var i = 0, n = self.list.length; i < n; i ++)
    {
      var itemData = self.list[i].data;
      raw.push(itemData);
      lookup[itemData[self.key]] = i;
    }

    console.log('gen lookup');

    self.trigger('change', raw);
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

    return lookup[id];
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
  

    // self.trigger('render');

    // if(self.postRender !== undefined)
    // {
    //   self.postRender();
    // }
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
      var el = $('<div>');
      el.attr('class', itemClass);
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

        // update all indexes on items > the one we removed
        for(var i = (index + 1), n = self.list.length; i < n; i ++)
        {
          item = self.list[i];
          var itemIndex = item.data.index;
          self.updateItem(item, 'index', itemIndex + 1);
        }
      }
    }
    

    // create all items if array
    if(flour.isArray(item))
    {
      for(var i = 0, n = item.length; i < n; i ++)
      {
        createItem(item[i]);
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
    var item = list[index];
    
    item.el.remove();
    item.data = null;
    list.splice(index, 1);

    // update all indexes on items > the one we removed
    for(var i = index, n = list.length; i < n; i ++)
    {
      item = list[i];
      var itemIndex = item.data.index;
      self.updateItem(item, 'index', itemIndex - 1);
    }

    self.generateLookup();
  };



  /*
  |
  | Updates an item in the list
  |
  */
  self.update = function(index, key, value)
  {
    var self = this;
    var item = self.getItem(index);
    self.updateItem(item, key, value);
  };

  self.updateItem = function(item, key, value)
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

    //         console.log('updating ' + bindingInfo.selector + ' -> ' + value);

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
    self.trigger('change', raw);
  }





  /*
  |
  | Render item
  |
  */
  self.renderItem = function(item)
  {
    var self = this;
    console.log('render item');

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
  | Destroy this view, remove events, subscriptions etc
  |
  */
  self.destroy = function()
  {
    
  };

};

















































































































flour.list = function(items, options)
{
  // Return an instance if the new keyword wasn't used
  if (!(this instanceof flour.list)) 
  {
    return new flour.list(items, options);
  }


  // Self keyword
  var self = this;


  // Private vars
  var raw = items;
  var list = [];
  var lookup = {};
  var lookupKey = options.key === undefined ? false : options.key;
  var template = options.template === undefined ? '' : options.template;
  var itemClass = options.itemClass === undefined ? '' : options.itemClass;
  var wrapElType = options.wrapElType === undefined ? 'div' : options.wrapElType;
  var listeners = {};


  // Public vars
  self.el = $('<' + wrapElType + ' class="flour-list"></' + wrapElType + '>');





  /*
  |
  | calls a callback method defined in options
  |
  */
  var trigger = function(callback, data)
  {
    if(options[callback])
    {
      options[callback](data);
    }
  };





  /*
  |
  | itterates our items and creates a lookup
  |
  */ 
  var generateLookup = function()
  {
    raw.length = 0;
    lookup = {};

    if(!lookupKey)
    {
      for(var i = 0, n = list.length; i < n; i ++)
      {
        var itemData = list[i].data;
        raw.push(itemData);
      }

      trigger('onChange', raw);
      return;
    }

    for(var i = 0, n = list.length; i < n; i ++)
    {
      var itemData = list[i].data;
      raw.push(itemData);
      lookup[itemData[lookupKey]] = i;
    }

    console.log('gen lookup');

    trigger('onChange', raw);
  };





  /*
  |
  | returns item from lookup
  |
  */
  var getItem = function(id)
  {
    return list[getItemIndex(id)];
  }

  var getItemIndex = function(id)
  {
    if(!lookupKey)
    {
      return id;
    }

    return lookup[id];
  }


  


  /*
  |
  | Initialise list
  |
  */
  var init = function()
  {
    // create bindings
    flour.bindList(self, template);

    // add items to list
    self.add(items);
  }



  /*
  |
  | Add an item to the list
  |
  */
  self.add = function(item, index)
  {
    var createItem = function(item)
    {
      // set item index and check in range
      if(index === undefined)
      {
        item['index'] = list.length;
      }
      else
      {
        if(index > list.length)
        {
          index = undefined;
          item['index'] = list.length;
        }
        else
        {
          item['index'] = index;
        }
      }

      // create element with rendered html
      var el = $('<div>');
      el.attr('class', itemClass);
      //el.html(flour.getTemplate(template)(item));

      var newItem = {
        data: item,
        el: el
      };

      self.renderItem(newItem);

      if(index === undefined)
      {
        // add to end of list
        list.push(newItem);
        self.el.append(el);
      }
      else
      {
        // add at specific spot
        if(index > 0)
        {
          var item = list[index - 1];
          list.splice(index, 0, newItem);
          item.el.after(el);
        }
        else
        {
          list.splice(0, 0, newItem);
          self.el.prepend(el);
        }

        // update all indexes on items > the one we removed
        for(var i = (index + 1), n = list.length; i < n; i ++)
        {
          item = list[i];
          var itemIndex = item.data.index;
          self.updateItem(item, 'index', itemIndex + 1);
        }
      }
    }
    

    // create all items if array
    if(flour.isArray(item))
    {
      for(var i = 0, n = item.length; i < n; i ++)
      {
        createItem(items[i]);
      }
    }
    else
    {
      createItem(item);
    }

    generateLookup();
  };



  /*
  |
  | Remove an item from the list
  |
  */
  self.remove = function(index)
  {
    var index = getItemIndex(index);
    var item = list[index];
    
    item.el.remove();
    item.data = null;
    list.splice(index, 1);

    // update all indexes on items > the one we removed
    for(var i = index, n = list.length; i < n; i ++)
    {
      item = list[i];
      var itemIndex = item.data.index;
      self.updateItem(item, 'index', itemIndex - 1);
    }

    generateLookup();
  };



  /*
  |
  | Updates an item in the list
  |
  */
  self.update = function(index, key, value)
  {
    var item = getItem(index);
    self.updateItem(item, key, value);
  };

  self.updateItem = function(item, key, value)
  {
    var data = item.data;
    var doRender = true;
    var objectChain = flour.setObjectKeyValue(data, key, value);
  

    // Check for bindings
    if(objectChain)
    {
      var len = objectChain.length;
      for(var i = 0; i < len; i ++)
      {
        var bindingKey = objectChain.join('.');
        if(listeners[bindingKey] !== undefined)
        {
          var value = flour.getObjectKeyValue(data, bindingKey);

          for(var i = 0, n = listeners[bindingKey].length; i < n; i ++)
          {
            var bindingInfo = listeners[bindingKey][i];
            var options = flour.bind.binders[bindingInfo.name];
            var $el = item.el.find(bindingInfo.selector);

            console.log('updating ' + bindingInfo.selector + ' -> ' + value);

            options.change($el, value);
            doRender = false;
          }
        }
        objectChain.pop();
      }
    }

    // if nothing was bound to that value, re-render?
    if(doRender)
    {
      if(key !== 'index' && lookupKey)
      {
        self.renderItem(item);
      }
    }

    // trigger callback
    trigger('onChange', raw);
  }



  /*
  |
  | Add a listener for a value change
  |
  */
  self.addBinding = function(bindingName, bindOn, elementSelector)
  {
    if(listeners[bindOn] === undefined)
    {
      listeners[bindOn] = [];
    }

    listeners[bindOn].push({
      name: bindingName,
      selector: elementSelector
    });
  };



  /*
  |
  | Render item
  |
  */
  self.renderItem = function(item)
  {
    console.log('render item');

    item.el.html(flour.getTemplate(template)(item.data));

    // populate bound elements
    for(var key in listeners)
    {
      var bindings = listeners[key];
      for(var i = 0, n = bindings.length; i < n; i ++)
      {
        var bindingInfo = bindings[i];
        var $el = item.el.find(bindingInfo.selector);
        var value = flour.getObjectKeyValue(item.data, key);

        flour.bind.binders[bindingInfo.name].change($el, value);
      }
    }
  };



  // Call init
  init();

};