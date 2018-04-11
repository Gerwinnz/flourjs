
var flour = flour || {};


/*
|
|
| Flour log func, if log view exists, pass it on
|
|
*/
flour.log = function(data, extra)
{
  if(flour.logView !== undefined)
  {
    flour.logView.log(data, extra);
  }
  else
  {
  	console.log(data);
  }
};

flour.warn = function(data, extra)
{
	if(flour.logView !== undefined)
  {
    flour.logView.warn(data, extra);
  }
  else
  {
  	console.warn(data);
  }
};

flour.error = function(data, extra)
{
	if(flour.logView !== undefined)
  {
    flour.logView.error(data, extra);
  }
  else
  {
  	console.error(data);
  }
};