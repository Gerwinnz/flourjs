
var flour = flour || {};

/*
|
| flour list class
|
*/
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
  var lookupKey = options.lookupKey === undefined ? false : options.lookupKey;
  var template = options.template === undefined ? '' : options.template;
  var itemClass = options.itemClass === undefined ? '' : options.itemClass;

  // Public vars
  self.el = options.wrapElType ? $('<' + options.wrapElType + ' class="flour-list"></' + options.wrapElType + '>') : $('<div class="flour-list"></div>');





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
  self.init = function()
  {
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
      el.html(flour.getTemplate(template)(item));
      //var el = $(flour.getTemplate(template)(item));

      var newItem = {
        data: item,
        el: el
      }

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
    flour.setObjectKeyValue(data, key, value);
    self.renderItem(item);
  }



  /*
  |
  | Render item
  |
  */
  self.renderItem = function(item)
  {
    item.el.html(flour.getTemplate(template)(item.data));
  };



  // Call init
  self.init();

};