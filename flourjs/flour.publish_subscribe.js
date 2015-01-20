
var flour = flour || {};

/*
|
| Store subsciption event callbacks here
|
*/
flour.subscriptions = {};



/*
|
| Publish events
|
*/
flour.publish = function(eventName, data)
{
  var subscriptions = flour.subscriptions[eventName];

  if(subscriptions !== undefined)
  {
    for(var i = 0, n = subscriptions.length; i < n; i ++)
    {
      subscriptions[i](data);
    }
  }
};



/*
|
| Subscribe to an event
|
*/
flour.subscribe = function(eventName, callback)
{
  if(flour.subscriptions[eventName] === undefined)
  {
    flour.subscriptions[eventName] = [];
  }

  flour.subscriptions[eventName].push(callback);
}





/*
|
| Unsubscribe from an event
|
*/
flour.unsubscribe = function(eventName, callback)
{
  if(flour.subscriptions[eventName] !== undefined)
  {
    for(var i = 0, n = flour.subscriptions[eventName].length; i < n; i ++)
    {
      if(callback === flour.subscriptions[eventName][i])
      {
        flour.subscriptions[eventName].splice(i, 1);
      }
    }
  }
}