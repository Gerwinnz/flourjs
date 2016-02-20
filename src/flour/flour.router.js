
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
    self.matchCurrentRequest(data);
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
  self.matchCurrentRequest = function(data)
  {
    var bits = false;
    var params = {};
    var getVariables = [];
    var hash = false;
    
    // define flag for publishing route change by silent 
    var publish = true;
    if(flour.isObject(data))
    {
      if(data.silent === true)
      {
        publish = false;
      }
    }

    // fetch the request url
    requestURL = document.URL;
    originalRequestURL = requestURL;

    // Pull out hash variables from the url
    if(requestURL.indexOf('#') !== -1) 
    {
      bits = requestURL.split('#');
      hash = bits[1];
      requestURL = bits[0];
    }
    else if(window.location.hash)
    {
      hash = window.location.hash.replace('#', '');
    }

    // Pull out get variables from the url
    if(requestURL.indexOf('?') !== -1) 
    {
      bits = requestURL.split('?');
      params = {};
      getVariables = bits[1].split('&');
      requestURL = bits[0];
    }


    // Strip and match our request URL
    var strippedRequestURL = requestURL.replace(flour.config('base_url') + basePath, '');
    var routeDetails = self.match(strippedRequestURL);

    // Save full request URL with get params and # as original string
    routeDetails.requestURL = originalRequestURL.replace(flour.config('base_url') + basePath, '');

    // add hash value
    routeDetails.hash = hash;

    // add get vars to the params
    if(getVariables)
    {
      for(var i = 0, n = getVariables.length; i < n; i ++)
      {
        var keyValue = getVariables[i].split('=');
        routeDetails.params[keyValue[0]] = keyValue[1];
      }
    }

    flour.store.set('route', routeDetails, publish);
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
    return route.replace(/:(\w+)/g, "([\\w-=%\.]+)");
  };

};