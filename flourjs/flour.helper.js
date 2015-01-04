
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