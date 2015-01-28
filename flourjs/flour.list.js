
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

  // Privates
  var list = [];
  var lookup = {};
  var lookupKey = options.lookupKey === undefined ? false : options.lookupKey;
  var template = options.template === undefined ? '' : options.template;


  // itterates our items and creates a lookup
  var generateLookup = function()
  {
    lookup = {};

    if(!lookupKey)
    {
      return;
    }

    for(var i = 0, n = list.length; i ++; i < n)
    {
      var item = list[i].data;
      lookup[item[lookupKey]] = i;
    }
  };

  // returns item from lookup
  var getItem = function(id)
  {
    if(!lookupKey)
    {
      return list[id];
    }

    return list[lookup[id]];
  }


  // Publics
  self.el = options.wrapElType ? $('<' + options.wrapElType + ' class="flour-list"></' + options.wrapElType + '>') : $('<div class="flour-list"></div>');


  /*
  |
  | Initialise list
  |
  */
  self.init = function()
  {
    // add items to list
    for(var i = 0, n = items.length; i < n; i ++)
    {
      self.add(items[i]);
    }
  }



  /*
  |
  | Add an item to the list
  |
  */
  self.add = function(item, index)
  {
    var el = $('<div>');
    el.html(flour.getTemplate(template)(item));

    var newItem = {
      data: item,
      el: el
    }

    list.push(newItem);
    self.el.append(el);
    generateLookup();
  }



  /*
  |
  | Remove an item from the list
  |
  */
  self.remove = function(index)
  {

  }



  /*
  |
  | Updates an item in the list
  |
  */
  self.update = function(index, key, value)
  {

  }



  // Call init
  self.init();

};