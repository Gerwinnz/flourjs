
var flour = flour || {};


/*
|
|
| Flour log func, if log view exists, pass it on
|
|
*/
flour.log = function(data, type)
{
  if(flour.logView !== undefined)
  {
    flour.logView.log(data, type);
  }
};