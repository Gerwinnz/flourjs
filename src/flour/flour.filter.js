
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






