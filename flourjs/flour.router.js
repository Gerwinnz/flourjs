
var flour = flour || {};

/*
|
| flour router : class
|
*/
flour.router = function(routes, basePath)
{
  // Return an instance if the new keyword wasn't used
  if (!(this instanceof flour.router)) 
  {
    return new flour.router(name, options);
  }

  // defaults
  basePath = basePath || '';

  // Self keyword
  var self = this;




  /*
  |
  | Listen for window state change and react
  |
  */
  flour.subscribe('history:state_change', function(data)
  {
    if(data.silent !== true)
    {
      self.matchCurrentRequest();
    }
  });

  window.addEventListener('popstate', function(e)
  {
    flour.publish('history:state_change', {});
  });




  /*
  |
  | Match the current request
  |
  */
  self.matchCurrentRequest = function()
  {
    var bits = false;
    var params = {};
    var getVariables = {};

    requestURL = document.URL;

    // Pull out get variables from the url
    if(requestURL.indexOf('?') !== -1) 
    {
      bits = requestURL.split('?');
      params = {};
      getVariables = bits[1].split('&');
      requestURL = bits[0];
    }

    var strippedRequestURL = requestURL.replace(flour.config('base_url') + basePath, '');
    var routeDetails = self.match(strippedRequestURL);
    routeDetails.requestURL = strippedRequestURL;

    // add get vars to the params
    if(getVariables)
    {
      for(var i = 0, n = getVariables.length; i < n; i ++)
      {
        var keyValue = getVariables[i].split('=');
        routeDetails.params[keyValue[0]] = keyValue[1];
      }
    }

    flour.store.set('route', routeDetails);
  };


  // find match
  self.match = function(requestURL)
  {
    var params = {};
    var paramNames = false;

    for(var i in routes)
    {
      var route = i;
      var routeDetails = routes[i];
      
      // Create the regular expression
      var routeRegex = new RegExp('^' + self.getRegex(route) + '*$', 'i');

      // Test for a match against our current URL
      if(routeRegex.test(requestURL))
      {
        var routeSections = route.split('/');
        var routeValues = requestURL.split('/');

        var paramName = '';
        for(var i = 0; i < routeSections.length; i ++)
        {

          if(paramName = routeSections[i].match(/:([\w-]+)/))
          {
            params[paramName[1]] = routeValues[i];
          }
        }

        routeDetails['route'] = route;
        routeDetails['params'] = params;

        return routeDetails;
      }
    }

    return false;
  };


  // create reg ex
  self.getRegex = function(route)
  {
    return route.replace(/:(\w+)/g, "([\\w-]+)");
  };

};