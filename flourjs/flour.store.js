
var flour = flour || {};


/*
#
# flour store, stores values used across a project
#
*/
flour.store = {
  
  values: {},

  set: function(name, value, silent)
  {
    var self = this;
    self.values[name] = value;

    if(silent !== false)
    {
      flour.publish(name + ':change', value);  
    }
  },

  get: function(name)
  {
    var self = this;

    if(!name)
    {
      return self.values;
    }

    return self.values[name];
  }

};