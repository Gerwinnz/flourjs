
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
  var list = [];
  var lookup = {};
  var lookupKey = options.lookupKey === undefined ? false : options.lookupKey;
  var template = options.template === undefined ? '' : options.template;
  var itemClass = options.itemClass === undefined ? '' : options.itemClass;

  // Public vars
  self.el = options.wrapElType ? $('<' + options.wrapElType + ' class="flour-list"></' + options.wrapElType + '>') : $('<div class="flour-list"></div>');





  /*
  |
  | itterates our items and creates a lookup
  |
  */ 
  var generateLookup = function()
  {
    lookup = {};

    if(!lookupKey)
    {
      for(var i = 0, n = list.length; i < n; i ++)
      {
        var item = list[i].data;
        item['@index'] = i;
      }
      return;
    }

    for(var i = 0, n = list.length; i < n; i ++)
    {
      var item = list[i].data;
      item['@index'] = i;
      lookup[item[lookupKey]] = i;
    }
  };

  // var addToLookup = function()
  // {

  // }



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
    var createItem = function(item){
      
      var el = $('<div>');
      el.attr('class', itemClass);
      el.html(flour.getTemplate(template)(item));
      //var el = $(flour.getTemplate(template)(item));

      var newItem = {
        data: item,
        el: el
      }

      list.push(newItem);
      self.el.append(el);
    }
    
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
  }



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
    generateLookup();
  }



  /*
  |
  | Updates an item in the list
  |
  */
  self.update = function(index, key, value)
  {
    var item = getItem(index);
    var data = item.data;

    flour.setObjectKeyValue(data, key, value);
    self.renderItem(index);
  }


  /*
  |
  | Render item
  |
  */
  self.renderItem = function(index)
  {
    var item = getItem(index);
    item.el.html(flour.getTemplate(template)(item.data));
  }



  // Call init
  self.init();

};