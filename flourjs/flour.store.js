
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