var flour = flour || {};




/*
|
|
|
|
|
*/
flour.router = function(routes, baseURL)
{
	var mRoutes = [];
	var mRequests = [];
	var mLastRequestIndex = false;
	var mRequestId = 0;



	/*
	|
	|
	|
	*/
	var push = function(state, title, url)
	{
		if(!state)
		{
			state = {};
		}

		state.id = mRequestId;
		state.url = url;
		mRequestId ++;
		history.pushState(state, null, url);
		flour.publish('history:state_change', state);
	}


	
	/*
	|
	|	Checks for a route that matches the requestURL passed in
	|
	|	@request - object - {url: string}
	|
	*/
	var match = function(request)
	{
		request = request === undefined ? {} : request;

		var hash = false;
		var bits = false;
	    var params = {};
	    var getVariables = [];
	    var publish = request.silent === true ? false : true;
	    
	    var requestURL = request.url === undefined ? document.URL : request.url;
	    var originalRequestURL = requestURL;


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
	    	params = {};
	     	bits = requestURL.split('?');
	     	getVariables = bits[1].split('&');
	     	requestURL = bits[0];
	    }


	    // Strip base from our url and match against routes
	    var matchedRoute = matchRoute(requestURL.replace(baseURL, ''));
	    if(!matchedRoute)
	    {
	    	return false;
	    }

	    
	    // Add request info such as original url and hash value
    	matchedRoute.requestURL = originalRequestURL.replace(baseURL, '');
    	matchedRoute.hash = hash


    	// Determine if this request is the same as the last one, if so direction is back
    	var previousRequestId = mRequests[mRequests.length - 2];
    	var currentRequestId = mRequests[mRequests.length - 1];

	    if(request.popstate && request.id === previousRequestId)
	    {
	      	mRequests.pop();
	      	matchedRoute.direction = 'back';
	    }
	    else
	    {
	      	mRequests.push(request.id);
	      	matchedRoute.direction = 'forward';
	    }

	    console.log(matchedRoute.direction, mRequests);


	    // add get vars to the params
	    if(getVariables.length > 0)
	    {
			for(var i = 0, n = getVariables.length; i < n; i ++)
			{
				var keyValue = getVariables[i].split('=');
				matchedRoute.params[keyValue[0]] = keyValue[1];
			}
	    }

	    return matchedRoute;
	};

	var matchRoute = function(requestURL)
	{
		for(var i = 0, n = mRoutes.length; i < n; i ++)
		{
			var route = mRoutes[i];
			if(route.regEx.test(requestURL))
			{
				return extractRouteDetails(JSON.parse(JSON.stringify(route)), requestURL);
			}
		}

		return false;
	};

	var extractRouteDetails = function(route, requestURL)
	{
		var params = {};
		var options = route.options;
		var sections = route.route.split('/');
		var values = requestURL.split('/');
		var paramName = '';

		for(var i = 0; i < sections.length; i ++)
        {
			if(paramName = sections[i].match(/:([\w-]+)/))
			{
				params[paramName[1]] = values[i];
			}
        }

        options.params = params;

        return options;
	};




	/*
	|
	|	Create regular expression for each of our routes
	|
	*/
	var transformRoutes = function(routes)
	{
		for(var route in routes)
		{
			var options = routes[route];
			var regEx = new RegExp('^' + route.replace(/:(\w+)/g, "([\\w-=%\.]+)") + '$', 'i');

			mRoutes.push({
				regEx: regEx,
				route: route,
				options: options
			});
		}
	};




	/*
	|
	|	Setup and return
	|
	*/
	transformRoutes(routes);

	return {
		match: match,
		push: push
	};

};