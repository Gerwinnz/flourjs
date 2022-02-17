var flour = flour || {};




/*
|
|
|
|
|
*/
flour.app = function(params)
{
	var instance = new flour_app(params);
	return instance;
};



class flour_app
{
	mView = false;
	mElement = false;
	mHostElement = false;
	mRouter = false;

	mViews = [];
	mCacheViewsCount = 5;
	mCurrentViewIndex = 0;
	mCurrentRoute = {};
	mTransitionHandler = false;

	mBaseURL = '';




	constructor(params)
	{
		this.mElement = params.element || document.createElement('div');
		this.mRouter = flour.router(params.routes, params.base_url);
		this.mBaseURL = params.base_url || document.location.origin;

		if(flour.util.isFunction(params.transitionHandler))
		{
			this.mTransitionHandler = params.transitionHandler;
		}
		

		if(params.view && flour.view.defined[params.view] !== undefined)
		{
			this.mView = flour.view.get(params.view);
			this.mElement.append(this.mView.el);

			if(this.mView.refs.app)
			{
				this.mHostElement = this.mView.refs.app;
			}
		}
		else
		{
			this.mHostElement = this.mElement;
		}


		flour.subscribe('history:state_change', (data) => 
		{
			this.matchRoute(data);
		});

		window.addEventListener('popstate', (event) => 
		{
			var state = event.state;
			state.popstate = true;
			flour.publish('history:state_change', state);
		});


		this.matchRoute({url: document.URL});
		this.attachLinkClicks();
	}



	/*
	|
	|
	|
	|
	|
	*/
	matchRoute(data)
	{
		var route = this.mRouter.match(data);

		if(!route)
		{
			flour.util.throw('No matching route found');
			return;
		}
		
		if(route.view === undefined)
		{ 
			flour.util.throw('Route has no view parameter.'); 
			return; 
		}
		
		if(flour.view.defined[route.view] === undefined)
		{ 
			flour.util.throw('View "' + route.view + '" has not been defined.'); 
			return; 
		}

		var isDifferentView = route.view !== this.mCurrentRoute.view;
		var isDifferentRoute = route.requestURL !== this.mCurrentRoute.requestURL;
		var isDifferentParams = JSON.stringify(route.params) !== JSON.stringify(this.mCurrentRoute.params);

		if(isDifferentView || isDifferentRoute || isDifferentParams)
		{
			var nextView = false;
        	var currentView = this.mViews[this.mCurrentViewIndex];


			//
			//	If same view with handler call it and stop there unless it explicitly returns false
			//			
			if(!isDifferentView && flour.util.isFunction(currentView.routeUpdate))
			{
				var handled = currentView.routeUpdate(route);

				if(handled !== false){
					this.mCurrentRoute = route;
					return;
				}
			}


			//
			//	Check for back direction, if so re-use the cached view
			//
			if(route.direction === 'back')
			{
				currentView = this.mViews.pop();
				currentView.destroy();
				this.mCurrentViewIndex --;

				if(this.mViews[this.mCurrentViewIndex] !== undefined)
				{
					nextView = this.mViews[this.mCurrentViewIndex];
				}
			}

			if(!nextView)
			{
				nextView = flour.view.get(route.view, route.params);
				this.mViews.push(nextView);
			}


			//
			//	Push new view on view stack
			//
			this.mCurrentViewIndex = this.mViews.length - 1;
			this.displayView(nextView, currentView, route);
		}


		//
		//	Check if route has an action and attempt to call a method on the new view of same action
		//
		if(route.action && flour.util.isFunction(nextView[route.action]))
		{
			nextView[route.action](route.params);
		}


		//
		//	Store our route for comparisons
		//
		this.mCurrentRoute = route;
	}



	/*
	|
	|
	|
	|
	|
	*/
	displayView(nextView, currentView, route)
	{
		var extra = undefined;

		if(currentView && flour.util.isFunction(currentView.willHide))
		{
			extra = currentView.willHide();
		}

		if(flour.util.isFunction(nextView.willShow))
		{
			nextView.willShow(extra);
		}

		if(nextView.ready === false)
		{
			var onReady = function()
			{
				self.transitionViews(nextView, currentView);
				nextView.ready = true;
				nextView.off('ready', onReady);
			};

			nextView.on('ready', onReady);
		}
		else
		{
			this.transitionViews(nextView, currentView, route);
		}
	}



	/*
	|
	|
	|	Default transition view basically appends our new view and cleans up the old
	|
	|
	*/
	transitionViews(nextView, currentView, route)
	{	
		if(this.mTransitionHandler)
		{
			var details = {
				hostElement: this.mHostElement,
				nextView: nextView,
				currentView: currentView,
				route: route
			};

			this.mTransitionHandler(details, () => 
			{
				this.cleanUp(currentView);
			});
		}
		else
		{
			this.mHostElement.append(nextView.el);
			this.cleanUp(currentView);
		}
	}



	/*
	|
	|
	|	Remove passed in view and destroy views past our cache count
	|
	|
	*/
	cleanUp(view)
	{
		if(view)
		{
			view.el.parentNode.removeChild(view.el);
		}

		if(this.mViews.length > this.mCacheViewsCount)
		{
			view = this.mViews.shift();
			view.destroy();
			view = false;

			this.mCurrentViewIndex = this.mViews.length - 1;
		}
	}




	attachLinkClicks()
	{
		this.mElement.onclick = (e) => 
		{				
			if(e.target.nodeName === 'A')
			{
				e.preventDefault();
				e.stopPropagation();

				var el = e.target;
				var href = el.getAttribute('href');
				var handledURL = false;
				
				if(href[0] === '/')
				{
					handledURL = this.mBaseURL + href;
				}
				else if(this.mBaseURL !== '' && href.indexOf(this.mBaseURL) === 0)
				{
					handledURL = href;
				}

				if(handledURL)
				{
					this.mRouter.push({}, null, handledURL);
				}
			}
		}
	}

}var flour = flour || {};




/*
|
|
|
|
|
*/
flour.binding = 
{
	defined: {}
};




/*
|
|
|
|
|
*/
flour.binding.add = function(bindingName, options)
{
	if(!flour.binding.defined[bindingName])
	{
		flour.binding.defined[bindingName] = options;
	}	
};var flour = flour || {};




/*
|
|
|
|
|
*/
flour.block = 
{
	defined: {}
};




/*
|
|
|
|
|
*/
flour.block.add = function(blockName, options)
{
	if(!flour.block.defined[blockName])
	{
		flour.block.defined[blockName] = options;
	}	
};var flour = flour || {};




/*
|
|
|	Custom element details
|
|
*/
flour.customElement = 
{
	defined: []
};




flour.customElement.add = function(tagName, details)
{
	flour.customElement.defined.push(tagName);

	customElements.define(tagName, 
		class extends HTMLElement 
		{	
			constructor() 
			{
				super();
				var params = {};

				if(details && details.props)
				{
					for(var i = 0, n = details.props.length; i < n; i ++)
					{
						if(this.hasAttribute(details.props[i]))
						{
							params[details.props[i]] = this.getAttribute(details.props[i]);
						}
					}
				}

				this.view = flour.view.get(details.view, params);
			}

			static get observedAttributes() 
			{
			  	return details.props;
			}

			attributeChangedCallback(property, oldValue, newValue) 
			{  
				if (oldValue === newValue)
				{
					return;
				}

				if(this.view.attributeChanged)
				{
					this.view.attributeChanged(property, newValue, oldValue);
				}
			}

			connectedCallback() 
			{
				if(details.shadow === true)
				{
					this.attachShadow({mode: 'open'}).append(this.view.el);

					var view = this.view;
					var slots = view.el.querySelectorAll('slot');

					for(var i = 0, n = slots.length; i < n; i ++)
					{
						(function(slot){
							slot.addEventListener('slotchange', function()
							{
								if(view.slotChanged)
								{
									view.slotChanged(slot);
								}
							});
						}(slots[i]));
					}
				}
				else
				{
					this.append(this.view.el);
				}
			}
		}
	);
};var flour = flour || {};




/*
|
|
|
|
|
*/
flour.filter = 
{
	defined: {}
};




/*
|
|
|
|
|
*/
flour.filter.add = function(filterName, filterFunction)
{
	if(!flour.filter.defined[filterName])
	{
		flour.filter.defined[filterName] = filterFunction;
	}	
};var flour = flour || {};


/*
|
|
|	Flour HTTP name space
|
|	options: default fetch/http options used on all created http resources but can be overridden
|
|
*/
flour.http = 
{
	options: 
	{
		responseType: 'json'
	}
};



flour.http.preFetchDataHandler = function(data)
{
	return data;
};



flour.http.postFetchResponseHandler = function(data)
{
	return data;
};


flour.http.parseURL = function(url, data)
{
	if(data !== undefined)
    {
		for(var key in data)
		{
			if(url.indexOf(':' + key) !== -1)
			{
				var replaceString = ':' + key;
				url = url.replace(replaceString, data[key]);
				delete(data[key]);
			}
		}
    }

    return url;
};



/*
|
|	Shortcut methods for common http verbs
|
*/
flour.http.get = function(url, optionOverrides)
{
	return flour.http.add(url, 'GET', optionOverrides);
}

flour.http.put = function(url, optionOverrides)
{
	return flour.http.add(url, 'PUT', optionOverrides);
}

flour.http.post = function(url, optionOverrides)
{
	return flour.http.add(url, 'POST', optionOverrides);
}

flour.http.delete = function(url, optionOverrides)
{
	return flour.http.add(url, 'DELETE', optionOverrides);
}


/*
|
|	Creates and returns a callable function which performs a fetch and returns the response promise for a simple
|	and clean api. This way the user only needs to use one .then()
|
*/
flour.http.add = function(url, method, optionOverrides)
{
	// Normalise options with base options
	var options = JSON.parse(JSON.stringify(flour.http.options));
	if(flour.util.isObject(optionOverrides))
	{
		for(var key in optionOverrides)
		{
			options[key] = optionOverrides[key];
		}
	}

	method = method === undefined ? 'GET' : method.toUpperCase();
	options.method = method;
	options.responseType = options.responseType !== undefined ? options.responseType.toLowerCase() : undefined;

	
	// Define the callable response function
	return function(data, extra)
	{
		var parsedURL = flour.http.parseURL(url, data);
		extra = extra === undefined ? {} : extra;


		// Add data to our request
		if(data !== undefined)
		{
			if(method === 'GET')
			{
				var urlParams = [];

				if(parsedURL.indexOf('?') === -1)
				{
					parsedURL += '?';
				}

				for(var key in data)
				{
					urlParams.push(key + '=' + data[key]);
				}

				parsedURL += urlParams.join('&');
			}
			else
			{
				options.body = flour.http.preFetchDataHandler(data);
			}
		}


		// Perform fetch and return promise
		return response = fetch(parsedURL, options).then(function(response)
		{
			var returnValue = false;


			// Handle a failed fetch
			if(!response.ok)
			{
				if(flour.util.isFunction(extra.error))
				{
					extra.error(response);
				}
				else
				{
					throw response;
				}

				return;
			}


			// Format the response
			if(options.responseType === 'array_buffer')
			{
				returnValue = response.arrayBuffer();
			}
			else if(options.responseType === 'blob')
			{
				returnValue = response.blob();
			}
			else if(options.responseType === 'form_data')
			{
				returnValue = response.formData();
			}
			else if(options.responseType === 'json')
			{
				returnValue = response.json();
			}
			else
			{
				returnValue = response.text();
			}


			// If using callbacks
			if(flour.util.isFunction(extra.success))
			{
				returnValue.then(function(output)
				{
					extra.success(output);	
				});
			}

			if(flour.util.isFunction(extra.done))
			{
				returnValue.then(function(output)
				{
					extra.done(output);	
				});
			}


			// Return promise
			return returnValue;
		});
	}
};
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
      if(subscriptions[i])
      {
        subscriptions[i](data);
      }
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

	    if(request.id === undefined)
	    {
	    	request.id = mRequestId;
	    	mRequestId ++;
	    }

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

};var flour = flour || {};

flour.stateId = 0;


/*
|
|
|
|
|
*/
flour.state = function(defaultValues)
{
	var mValues = defaultValues ? JSON.parse(JSON.stringify(defaultValues)) : {};
	var mKeyChangeListeners = {};
	var mAllChangeListeners = [];
	var mManagedArrays = {};
	var mId = 0;

	var mChangeTypes = {
		'update': 'update',
		'insertItem': 'insertItem',
		'removeItem': 'removeItem',
		'updateItem': 'updateItem',
		'moveItem': 'moveItem'
	};




	/*
	|
	|
	|	Managed array - factory that returns a handleful of methods for updating arrays in our state
	|
	|   @key - string - the key of the array we wish to manage in our state
	|   @itemKey - string - the unique identifier we use to identify items inside of each array - defaults to 'id'
	|
	|
	*/
	var managedArray = function(key, itemKey)
	{
		itemKey = itemKey ? itemKey : 'id';

		var mItems = get(key);
		var mLookup = false;

		if(!flour.util.isArray(mItems))
		{
			flour.util.throw('Generating managed array failed as state value at "' + key + '" is not an array.');
			return;
		}



		/*
		|
		|	Update our lookup anytime an item is added, removed or moved
		|
		*/
		onChange(key, function(event)
		{
			mItems = event.value;
			
			if(event.type === mChangeTypes.insertItem)
			{
				updateLookup();
			}

			if(event.type === mChangeTypes.removeItem)
			{
				updateLookup();
			}

			if(event.type === mChangeTypes.moveItem)
			{
				updateLookup();
			}
		});
		


		/*
		|
		|	Update lookup function
		|
		*/
		var updateLookup = function()
		{
			var items = get(key);
			var newLookup = {};

			if(!flour.util.isArray(items))
			{
				return;
			}

			for(var i = 0, n = items.length; i < n; i ++)
			{
				newLookup[items[i][itemKey]] = i;
			}

			mLookup = newLookup;
		};



		/*
		|
		|
		|	Return a specified item and include methods for removing and updating returned item
		|
		|   @itemId - the id of the item we want to return
		|
		|
		*/
		var getItem = function(itemId)
		{
			var itemIndex = mLookup[itemId];
			if(itemIndex === undefined)
			{
				return false;
			}
			var value = mItems[itemIndex];

			return {
				value: value,
				index: itemIndex,
				move: function(newIndex)
				{
					moveItem(itemId, newIndex);
				},
				update: function(keys, values)
				{
					updateItem(itemId, keys, values);
				},
				remove: function()
				{
					removeItem(itemId);
				}
			};
		};



		/*
		|
		|
		|	Add an item to our array
		|
		|   @newItem - the object we wish to insert
		|   @newItemIndex - the index we wish to insert the new object
		|
		|
		*/
		var insertItem = function(newItem, newItemIndex)
		{
			var position = 0;
			var targetArray = get(key);
			if(!flour.util.isArray(targetArray))
			{
				flour.util.throw('Adding item failed as state value at "' + key + '" is not an array.');
				return;
			}

			if(mLookup[newItem[itemKey]] !== undefined)
			{
				flour.util.throw('Adding item already exists');
				return;
			}


			// insert at specified position or at end by default
			if(newItemIndex !== undefined)
			{
				if(newItemIndex < 0)
				{
					targetArray.unshift(newItem);
					position = 0;
				}
				else if(newItemIndex > (targetArray.length - 1))
				{
					targetArray.push(newItem);
					position = targetArray.length - 1;
				}
				else
				{	
					targetArray.splice(newItemIndex, 0, newItem);
					position = newItemIndex;
				}
			}
			else
			{
				targetArray.push(newItem);
				position = targetArray.length - 1;
			}


			// create event details
			var eventDetails = {
				type: mChangeTypes.insertItem,
				item: newItem,
				index: position
			};

			set(key, targetArray, eventDetails);
		};



		/*
		|
		|
		|	Move an item to a new index
		|
		|	@itemId - the id of the item we want to move
		| 	@newIndex - the new index we want to move the item to
		|
		|
		|
		*/
		var moveItem = function(itemId, newIndex)
		{
			var targetArray = get(key);
			if(!flour.util.isArray(targetArray))
			{
				flour.util.throw('Removing item failed as state value at "' + key + '" is not an array.');
				return;
			}

			var index = mLookup[itemId];
			var item = mItems[index];

			if(!item)
			{
				return;
			}

			if(newIndex < 0)
			{
				newIndex = 0;
			}

			if(newIndex > mItems.length - 1)
			{
				newIndex = mItems.length - 1;
			}

			if(newIndex === index)
			{
				return;
			}


			// shift position in our array
			targetArray.splice(newIndex, 0, targetArray.splice(index, 1)[0]);

			// create event details
			var eventDetails = {
				type: mChangeTypes.moveItem,
				item: item,
				index: newIndex,
				oldIndex: index
			};

			set(key, targetArray, eventDetails);
		};



		/*
		|
		|
		|	Remove an item from out array
		|
		|   @itemId - the id of the item we want to update
		|
		|
		*/
		var removeItem = function(itemId)
		{
			var targetArray = get(key);
			if(!flour.util.isArray(targetArray))
			{
				flour.util.throw('Removing item failed as state value at "' + key + '" is not an array.');
				return;
			}

			var index = mLookup[itemId];
			var item = mItems[index];

			if(!item)
			{
				return;
			}


			// remove 
			targetArray.splice(index, 1);


			// create event details
			var eventDetails = {
				type: mChangeTypes.removeItem,
				item: item,
				index: index
			};

			set(key, targetArray, eventDetails);
		};



		/*
		|
		|
		|	Update a property with the passed in new value on an item in our array
		|
		|   @itemId - the id of the item we want to update
		|   @itemKey - the property key we wish to change
		|   @itemValue - the new value we wish to set
		|
		|
		*/
		var updateItem = function(itemId, keys, values)
		{
			var targetArray = get(key);
			if(!flour.util.isArray(targetArray))
			{
				flour.util.throw('Updating item failed as state value at "' + key + '" is not an array.');
				return;
			}

			var index = mLookup[itemId];
			var item = targetArray[index];
			if(!item){ return; }

			var updatedKeys = [];
			var updatedKeyValues = [];

			if(flour.util.isObject(keys))
			{
				for(var itemKey in keys)
				{
					var updated = updateItemValue(item, itemKey, keys[itemKey]);
					if(updated !== null)
					{
						item = updated.item;
						updatedKeys.push(updated.key);
						updatedKeyValues.push(updated.value);
					}
				}
			}
			else
			{
				var updated = updateItemValue(item, keys, values);
				if(updated !== null)
				{
					item = updated.item;
					updatedKeys.push(updated.key);
					updatedKeyValues.push(updated.value);
				}
			}

			if(updatedKeys.length > 0)
			{
				console.log('managed_array::update_item', updatedKeys, updatedKeyValues);

				var eventDetails = {
					type: mChangeTypes.updateItem,
					item: item,
					index: index,
					keys: updatedKeys,
					values: updatedKeyValues
				};

				set(key, targetArray, eventDetails);
			}
		}

		var updateItemValue = function(item, itemKey, itemValue)
		{
			// update item value
			if(flour.util.isObject(item))
			{
				var currentValue = item[itemKey];

				if(flour.util.isObject(item[itemKey]) || flour.util.isArray(item[itemKey]))
				{
					if(JSON.stringify(item[itemKey]) === JSON.stringify(itemValue))
					{
						return null;
					}
				}

				if(currentValue === itemValue){ 
					return null;
				}
				
				item[itemKey] = itemValue;
			}
			else
			{
				if(item === itemKey)
				{
					return null;
				}

				item = itemKey;
			}

			return {
				item: item,
				key: itemKey,
				value: itemValue
			};
		};



		/*
		|
		|
		|	Update all items in our array
		|
		|   @newItems - our new set of items we want to compare to our current set
		|
		|
		*/
		var updateItems = function(newItems)
		{
			var newItemsLookup = {};
			var itemsToUpdate = [];
			var itemsToRemove = [];
			var itemsToAdd = [];


			// create new items mLookup and check for items to add or update
			for(var i = 0, n = newItems.length; i < n; i ++)
			{
				newItemsLookup[newItems[i].id] = i;

				if(mLookup[newItems[i].id] === undefined)
				{
					itemsToAdd.push({
						index: i,
						value: newItems[i]
					});
				}
				else
				{
					itemsToUpdate.push({
						index: i,
						value: newItems[i]
					});
				}
			}


			// find items to remove first
			for(var i = 0, n = mItems.length; i < n; i ++)
			{
				if(newItemsLookup[mItems[i].id] === undefined)
				{
					itemsToRemove.push(mItems[i].id);
				}
			}

			for(var i = 0, n = itemsToRemove.length; i < n; i ++)
			{
				removeItem(itemsToRemove[i]);
			}

			for(var i = 0, n = itemsToAdd.length; i < n; i ++)
			{
				insertItem(itemsToAdd[i].value, itemsToAdd[i].index);
			}

			for(var i = 0, n = itemsToUpdate.length; i < n; i ++)
			{
				if(mLookup[itemsToUpdate[i].value[itemKey]] !== itemsToUpdate[i].index)
				{
					moveItem(itemsToUpdate[i].value[itemKey], itemsToUpdate[i].index);
				}

				updateItem(itemsToUpdate[i].value[itemKey], itemsToUpdate[i].value)
			}
		};


		updateLookup();


		return {
			items: mItems,
			lookup: mLookup,

			getItem: getItem,
			insertItem: insertItem,
			removeItem: removeItem,

			updateItem: updateItem,
			updateItems: updateItems
		};
	};




	/*
	|
	|
	|	Return the value held by the specified key
	|
	|   @key - string - name of stored value to be returned, can be 'foo.bar'
	|	
	|
	*/
	var get = function(key)
	{
		// console.log('state::get', key);

		var value = getValue(mValues, key);

		if(flour.util.isArray(value))
		{
			value = JSON.parse(JSON.stringify(value));
		}
		else if(flour.util.isObject(value))
		{
			value = JSON.parse(JSON.stringify(value));
		}

		return value;
	};

	function getValue(obj, key)
	{
	    key = (typeof key === "string") ? key.split(".") : key;

	    const currentKey = key.shift();
	    if (obj.hasOwnProperty(currentKey) && key.length === 0)
	    {
	        return obj[currentKey];
	    }
	    else if (!obj.hasOwnProperty(currentKey))
	    {
	        return undefined;
	    }
	    else
	    {
	        return getValue(obj[currentKey], key);
	    }
	}




	/*
	|
	|
	|	Store the value passed in at the location specified by the key
	|
	|   @key - string - name of stored value to be returned, can be 'foo.bar'
	|   @value - any - the value to be stored in the key's location
	|	
	|
	*/
	var set = function(key, value, changeEvent)
	{
		var changedKey = false;
		var changeEvent = changeEvent ? changeEvent : {type: mChangeTypes.update};
		

		// handle updating a managed array
		if(changeEvent.type === mChangeTypes.update && flour.util.isArray(value))
		{
			if(flour.util.isArray(get(key)) && mManagedArrays[key])
	    	{
	    		mManagedArrays[key].updateItems(value);
	    		return;
	    	}
		}


		var setResponse = setValue(mValues, key, value);
		if(setResponse.changes)
		{
			console.log('state::set::' + changeEvent.type, key, value);
			for(var i = 0, n = setResponse.changes.length; i < n; i ++)
			{
				changedKey = changedKey === false ? setResponse.changes[i] : changedKey + '.' + setResponse.changes[i];

				if(mKeyChangeListeners[changedKey])
				{
					changeEvent.key = changedKey;
					changeEvent.value = get(changedKey);
					callKeyChangeListeners(changedKey, changeEvent);
				}

				if(mAllChangeListeners.length > 0)
				{
					changeEvent.key = changedKey;
					changeEvent.value = get(changedKey);
					callAllChangeListeners(changeEvent);
				}
			}
		}
	}

	function setValue(obj, key, value, changes)
	{
		key = (typeof key === "string") ? key.split(".") : key;
		if(changes === undefined)
		{
			changes = [];
		}

	    var currentKey = key.shift();
	    var valueChanged = false;
	    changes.push(currentKey);

	    if (key.length === 0)
	    {
	    	valueChanged = obj[currentKey] !== value;
	        obj[currentKey] = value;
	        return {
	        	value: value,
	        	changes: valueChanged ? changes : false
	        };
	    }
	    else if (!obj.hasOwnProperty(currentKey))
	    {
	        obj[currentKey] = {};
	    }

	    return(setValue(obj[currentKey], key, value, changes));
	}


	
	/*
	|
	|
	|	Get an item from an array 
	|
	|   @key - string - name of the array we wish to get our item from
	|   @id - string || int - id of the item we wish to retrieve
	|	
	|
	*/
	var getItem = function(key, id)
	{
		if(!mManagedArrays[key])
		{
			mManagedArrays[key] = managedArray(key);
		}

		return mManagedArrays[key].getItem(id);
	};



	/*
	|
	|
	|	Add item to an array stored at the specified key
	|
	|   @key - string - name of the array we wish to add to
	|   @newItem - any - what ever we are adding to the array
	|   @newItemIndex - int - position where we want to add the new item to the array
	|	
	|
	*/
	var insertItem = function(key, newItem, newItemIndex)
	{
		if(!mManagedArrays[key])
		{
			mManagedArrays[key] = managedArray(key);
		}

		return mManagedArrays[key].insertItem(newItem, newItemIndex);
	};



	/*
	|
	|
	|	Remove item to from an array with a specified id
	|
	|   @key - string - name of the array we wish to remove the item from
	|   @id - any - unique identifier of the item we wish to remove
	|	
	|
	*/
	var removeItem = function(key, id)
	{
		if(!mManagedArrays[key])
		{
			mManagedArrays[key] = managedArray(key);
		}

		return mManagedArrays[key].removeItem(id);
	};



	




	/*
	|
	|
	|	Add a change listener to fire when the specified key has changed
	|
	|   @key - string - name of stored value to fire on when a change occurs 'foo.bar'
	|   @callback - function - function to call 
	|	
	|
	*/
	var onChange = function(key, callback)
	{
		var id = mId;
		mId ++;


		// Add listener for all changes
		if(flour.util.isFunction(key))
		{
			mAllChangeListeners.push(
			{
				id: id,
				calls: 0,
				callback: key
			});

			return function(){
				for(var i = 0, n = mAllChangeListeners.length; i < n; i ++)
				{
					if(mAllChangeListeners[i].id === id)
					{
						mAllChangeListeners.splice(i,1);
						i --;
						n --;
					}
				}
			};
		}


		// Add listener for a specific change to a key value
		if(mKeyChangeListeners[key] === undefined)
		{
			mKeyChangeListeners[key] = [];
		}

		var length = mKeyChangeListeners[key].push(
		{
			id: id,
			calls: 0,
			callback: callback
		});

		return function(){
			for(var i = 0, n = mKeyChangeListeners[key].length; i < n; i ++)
			{
				if(mKeyChangeListeners[key][i].id === id)
				{
					mKeyChangeListeners[key].splice(i,1);
					i --;
					n --;
				}
			}
		};
	};



	/*
	|
	|
	|	Call all the change listeners stored against a key
	|
	|   @key - string - name of stored value callbacks are stored which need to be called
	|	
	|
	*/
	function callKeyChangeListeners(key, event)
	{
		for(var i = 0, n = mKeyChangeListeners[key].length; i < n; i ++)
		{
			if(mKeyChangeListeners[key][i])
			{
				mKeyChangeListeners[key][i].callback(event);
				mKeyChangeListeners[key][i].calls ++;
			}
		}
	};

	function callAllChangeListeners(event)
	{
		for(var i = 0, n = mAllChangeListeners.length; i < n; i ++)
		{
			if(mAllChangeListeners[i])
			{
				mAllChangeListeners[i].callback(event);
				mAllChangeListeners[i].calls ++;
			}
		}
	};








	/*
	|
	|
	|	Our factory function return object
	|	
	|
	*/
	flour.stateId ++;

	return {
		id: flour.stateId,
		get: get,
		set: set,

		getItem: getItem,
		insertItem: insertItem,
		removeItem: removeItem,

		values: mValues,
		onChange: onChange
	};
};var flour = flour || {};



/*
|
|
|
|
|
*/
flour.template = {
	elementUniqueId: 0
};



/*
|
|
|
|
|
*/
flour.template.parse = function(html, state, view)
{
	var templateFragment = document.createElement('template');
	var blocks = [];
	var cleanupCallbacks = [];

	

	//
	// parse block tags {{#block}}{{/block}}
	//
	for(var blockType in flour.block.defined)
	{
		(function(){
			var regEx = new RegExp('{{#' + blockType + ' (.*)}}', 'g');
			var result;

			while((result = regEx.exec(html)) !== null)
			{
				var key = result[1];
				var found = result[0];
				var closeTag = '{{/' + blockType + '}}';
				var nextOpenIndex = result.index;
				var nextCloseIndex = result.index;

				do
				{
					nextOpenIndex = html.indexOf('{{#', nextOpenIndex + 1);
					nextCloseIndex = html.indexOf('{{/', nextCloseIndex + 1);
				} 
				while(nextOpenIndex !== -1 && nextCloseIndex !== -1 && nextCloseIndex > nextOpenIndex);

				var start = result.index;
				var end = nextCloseIndex + closeTag.length;
				var replaceString = html.substr(start, end - start);
				var innerHTML = replaceString.substr(found.length, replaceString.length - found.length - closeTag.length);

				var elementId = flour.template.elementUniqueId;
				flour.template.elementUniqueId ++;

				html = html.replace(replaceString, '<option id="flour-' + elementId + '"></option>');
				blocks.push({
					elementId: elementId,
					type: blockType,
					key: key,
					html: innerHTML
				});
			}
		}());
	}



	//
	// parse standard output tag {{tag_output}}
	//
	html = html.replace(/{{\s?(\w*)\s?}}/g, (tag, stateName) => {
		return state.get(stateName);
	});



	//
	// set our template HTML to our parsed output
	//
	templateFragment.innerHTML = html;



	//
	// attach bindings
	//
	for(var bindingName in flour.binding.defined)
	{
		var elements = templateFragment.content.querySelectorAll('[' + bindingName + ']');
		if(elements.length > 0)
		{
			for(var i = 0, n = elements.length; i < n; i ++)
			{
				var cleanup = flour.binding.defined[bindingName].attach(elements[i], state, view);
				if(flour.util.isFunction(cleanup))
				{
					cleanupCallbacks.push(cleanup);
				}

				elements[i].removeAttribute(bindingName);
			}
		}
	}



	//
	// Find custom elements/components and update attributes mapped to a state value
	//
	var stateVariablePattern = /\{([\w.]+)}/;
	var customElements = templateFragment.content.querySelectorAll(flour.customElement.defined.join(','));

	for(var i = 0, n = customElements.length; i < n; i ++)
	{
		(function(customElement){
			var attributes = customElement.attributes;

			for(var i = 0, n = attributes.length; i < n; i ++)
			{
				(function(attribute){
					var attributeName = attribute.nodeName;
					var attributeValue = customElement.getAttribute(attributeName);
					var match = false;

					if(!flour.binding.defined[attributeName])
					{
						if(match = attributeValue.match(stateVariablePattern))
						{
							var key = match[1];
							var value = state.get(key);
							customElement.setAttribute(attributeName, value);

							var cleanup = state.onChange(key, function(event)
							{
								customElement.setAttribute(attributeName, event.value);
							});

							cleanupCallbacks.push(cleanup);
						}
					}
				}(attributes[i]));
			}

		}(customElements[i]));
	}



	//
	// go through our found blocks and call them
	//
	for(var i = 0, n = blocks.length; i < n; i ++)
	{
		(function(block){
			var el = templateFragment.content.querySelector('#flour-' + block.elementId);
			var referenceNode = document.createTextNode('');
			var blockContents = [];

			el.after(referenceNode);
			el.remove();

			block.display = function(contents)
			{
				if(contents)
				{
					for(var i = 0, n = contents.children.length; i < n; i ++)
					{
						blockContents.push(contents.children[i]);
					}

					referenceNode.after(contents);
				}
				else
				{
					if(blockContents)
					{
						for(var i = 0, n = blockContents.length; i < n; i ++)
						{
							blockContents[i].parentNode.removeChild(blockContents[i]);
						}

						blockContents.length = 0;
					}
				}
			};

			//block.el = el;
			
			var cleanup = flour.block.defined[block.type](block, state, view);
			if(flour.util.isFunction(cleanup))
			{
				cleanupCallbacks.push(cleanup);
			}
		}(blocks[i]));
	}



	//
	// return the fragment plus cleanup
	//
	return {
		fragment: templateFragment.content,
		cleanup: function()
		{
			for(var i = 0, n = cleanupCallbacks.length; i < n; i ++)
			{
				cleanupCallbacks[i]();
			}
		}
	};
};var flour = flour || {};




flour.util = {
	logSteps: 0
};



/*
|
|	Throws a flour console error
|
*/
flour.util.throw = function(error)
{
	console.error('Flour error: ' + error);
};

flour.util.warn = function(error)
{
	console.warn('Flour warn: ' + error);
};





/*
|
|	Defer
|
*/
flour.util.defer = function(callback)
{
	setTimeout(function()
	{
		callback();
	}, 0);
};





/*
|
|	Throws a flour console error
|
*/
flour.util.log = function()
{
	var args = Array.prototype.slice.call(arguments);
	
	if(flour.util.logSteps > 0)
	{
		var step = '- - -';
		var steps = '';
		for(var i = 0, n = flour.util.logSteps; i < n; i ++)
		{
			steps = steps + ' ' + step;
		}

		args.unshift(steps);
	}

	console.log.apply(console, args);
};



/*
|
|	Returns true if passed param is an object, else false
|
*/
flour.util.isObject = function(obj)
{
	return (typeof obj == "object") && (obj !== null);
};



/*
|
|	Returns true if passed param is an array, else false
|
*/
flour.util.isArray = function(arr)
{
	return Array.isArray(arr);
};




/*
|
|	Returns true if passed param is an object, else false
|
*/
flour.util.isFunction = function(func) 
{
 	return typeof func === 'function';
};



/*
|
|	Returns true is passed param is a string, else false
|
*/
flour.util.isString = function(str)
{
	return (typeof str == 'string' || str instanceof String);
};



var flour = flour || {};




/*
|
|
|
|
|
*/
flour.view = 
{
	id: 0,
	elementUniqueId: 0,
	defined: {}
};




/*
|
|
|	Add and get
|
|
*/
flour.view.add = function(name, view)
{
	view.prototype = new flour.view.base();
	flour.view.defined[name] = view;
};

flour.view.get = function(name, params)
{
	var viewInstance = false;

	if(!flour.view.defined[name])
	{
		throw 'Flour: View "' + name + '" has not been defined.';
	}

	flour.view.id ++;
	viewInstance = new flour.view.defined[name]();
	viewInstance.initialize(params, flour.view.id);

	return viewInstance;
};




/*
|
|
|	Base view
|
|
*/
flour.view.base = function()
{
	var templateHTML = null;
	this.templateInstance = null;



	/*
	|
	|
	|	Main view initialiser
	|
	|   @params - view params
	|   @id - unique id
	|
	| 	- Define view variables
	|   - Call user defined init (constructor)
	|
	|
	*/
	this.initialize = function(params, id)
	{
		if(!this.state){ this.state = flour.state(); }
		if(!this.tag){ this.tag = 'div'; }
		if(!this.events){ this.events = {}; }
		if(!this.refs){ this.refs = {}; }
		if(!this.renderCount){ this.renderCount = 0; }

		this.id = id;
		this.el = document.createElement(this.tag);
		
		if(this.templateHTML)
		{
			templateHTML = this.templateHTML;
		}
		else if(this.template)
		{
			var templateEl = document.getElementById('f-template.' + this.template);
			if(!templateEl)
			{
				templateHTML = '<p>No template found.</p>';
			}
			else
			{
				templateHTML = document.getElementById('f-template.' + this.template).innerHTML;
			}
		}

		if(this.init)
		{
			this.init(params);
		}

		if(this.renderCount === 0)
		{
			this.render();
		}
	};



	/*
	|
	|
	|	Render template into our view element
	|
	|
	*/
	this.render = function()
	{
		if(this.templateInstance)
		{
			this.templateInstance.cleanup();
		}

		this.templateInstance = flour.template.parse(templateHTML, this.state, this);

		this.el.innerHTML = '';
		this.el.appendChild(this.templateInstance.fragment);

		this.renderCount ++;

		this.trigger('rendered');
	};



	/*
	|
	|
	|	Tear down of view when it's being removed
	|
	|
	*/
	this.destroy = function()
	{
		
	};



	this.remove = function()
	{
		this.destroy();
		this.el.parentNode.removeChild(this.el);
	};



	/*
	|
	|
	|	Add an event listener for this view
	|
	|	@event - string - event name
	| 	@callback - function - to be called when the view triggers an event with the matching name
	|
	|
	*/
	this.on = function(event, callback)
	{
		if(this.events[event] === undefined)
	    {
	      	this.events[event] = [];
	    }
	    
	    this.events[event].push(callback);
	};


	this.off = function(event, callback)
	{
		var eventListeners = this.events[event];

	    if(eventListeners === undefined)
	    {
	      	return;
	    }

	    if(callback !== undefined)
	    {
			for(var i = 0, n = eventListeners.length; i < n; i ++)
			{
				if(callback === eventListeners[i])
				{
					eventListeners[i] = null;
					break;
				}
			}
	    }
	    else
	    {
	      	eventListeners.length = 0;
	    }
	};


	this.trigger = function(event, eventDetails)
	{
		var eventListeners = this.events[event];

	    if(eventListeners === undefined || eventListeners === null)
	    {
	      return;
	    }

	    for(var i = 0, n = eventListeners.length; i < n; i ++)
	    {
	      	var listenerCallback = eventListeners[i];
	      	if(flour.util.isFunction(listenerCallback))
	      	{
	        	listenerCallback(eventDetails);
	      	}
	    }
	};


};
/*
|
|	Sets inner text to the state value
|
*/
flour.binding.add('f-class', 
{

	attach: function(element, state, view)
	{
		var mKey = element.getAttribute('f-class');
		var mClasses = mKey.split(',');
		var mCleanups = [];
		var mClassNames = [];
	

		// apply classNames
		var applyClassNames = function()
		{
			for(var i = 0, n = mClassNames.length; i < n; i ++)
			{
				if(mClassNames[i].className)
				{
					if(mClassNames[i].value)
					{
						element.classList.add(mClassNames[i].className);
					}
				}
				else
				{
					element.classList.add(mClassNames[i].value);
				}
			}
		};


		// initial setup
		for(var i = 0, n = mClasses.length; i < n; i ++)
		{
			(function(classString){

				var parts = classString.split(' ');
				var stateKey = parts[0];
				var info = {
					value: state.get(stateKey),
					className: parts[1] === undefined ? false : parts[1]
				};

				mClassNames.push(info);

				mCleanups.push(state.onChange(stateKey, function(event)
				{
					element.classList.remove(info.className ? info.className : info.value);
					info.value = event.value;
					applyClassNames();
				}));

			}(mClasses[i]));
		};

		applyClassNames();
		

		// cleanup
		return function()
		{
			for(var i = 0, n = mCleanups.length; i < n; i ++)
			{
				mCleanups[i]();
			}
		};
	}

});


/*
|
|	Generic event attaching binder that allows adding multiple events separated by commas
|
|	Attribute format:
|	[javascriptEvent] [handlerName]
| 	eg. "click myClickHandler" or "click myClickHandler,submit mySubmitHandler"
|
|
*/
flour.binding.add('f-on', 
{

	attach: function(element, state, view)
	{
		var mValue = element.getAttribute('f-on');
		var mEvents = mValue.split(',');

		for(var i = 0, n = mEvents.length; i < n; i ++)
		{
			(function(eventString){

				var parts = eventString.split(' ');
				var type = parts[0].trim();
				var handler = false;
				
				if(!parts[1])
				{
					flour.util.warn('Binding "f-on" expects two params. Only one given here "' + eventString + '"');
					return;
				}

				handler = parts[1].trim();
				
				if(view[handler])
				{
					element.addEventListener(type, function(event)
					{
						view[handler](event, element);
					});
				}

			}(mEvents[i]));
		}
	}

});


/*
|
|	Sets the select elements inner html to contain options matching the state value
|
|	State value should be an array formatted as:
|   [
|		{
|			value: 'foo',
|			label: 'Foo'
|		}
|	]
|
*/
flour.binding.add('f-options', 
{

	attach: function(element, state, view)
	{
		var mKey = element.getAttribute('f-options');
		var mValue = element.getAttribute('f-value');
		var mOptions = state.get(mKey) || [];

		var cleanup = state.onChange(mKey, function(event)
		{
			setOptions(event.value);
		});

		var setOptions = function(options)
		{
			var html = '';
			for(var i = 0, n = options.length; i < n; i ++)
			{
				html += '<option value="' + options[i].value + '">' + options[i].label + '</option>';
			}

			element.innerHTML = html;

			if(mValue){
				element.value = state.get(mValue);
			}
		};

		
		// initial setup
		setOptions(mOptions);


		// cleanup
		return cleanup;
	}

});


/*
|
|	Stores reference to element in the view's ref name space with the passed in name
|
*/
flour.binding.add('f-ref', 
{

	attach: function(element, state, view)
	{
		var mRefName = element.getAttribute('f-ref');
		
		if(view.refs === undefined)
		{
			view.refs = {};
		}

		view.refs[mRefName] = element;
	}

});


/*
|
|	Basic show/hide if value is truthy
|
*/
flour.binding.add('f-show', 
{

	attach: function(element, state, view)
	{
		var mKey = element.getAttribute('f-show');
		var mInverse = false;

		if(mKey[0] === '!')
		{
			mInverse = true;
			mKey = mKey.substring(1);
		}

		var mValue = state.get(mKey);
		var mDisplayDefault = element.style.display;


		/*
		|
		|	Sub to change events 
		|
		*/
		var cleanup = state.onChange(mKey, function(event)
		{
			mValue = event.value;
			showContent();
		});

		var showContent = function()
		{
			var show = mValue ? true : false;
			show = mInverse ? !show : show;

			if(!show)
			{
				element.style.display = 'none';
			}
			else
			{
				element.style.display = mDisplayDefault;
			}
		}


		// initial setup
		showContent();


		// cleanup
		return cleanup;
	}

});


/*
|
|	Sets inner text to the state value
|
*/
flour.binding.add('f-text', 
{

	attach: function(element, state, view)
	{
		var mValue = element.getAttribute('f-text');
		var mParts = mValue.split('|');
		var mKey = mParts[0].trim();
		var mFilter = false;

		if(mParts[1])
		{
			var filterName = mParts[1].trim();
			if(flour.filter.defined[filterName])
			{
				mFilter = flour.filter.defined[filterName];
			}
		}


		// display methods
		var displayText = function(value)
		{
			element.innerText = value;
		};

		var displayTextWithFilter = function(value)
		{
			element.innerText = mFilter(value);
		};


		// initial setup
		if(mFilter === false)
		{
			displayText(state.get(mKey));
			var cleanup = state.onChange(mKey, function(event)
			{
				displayText(event.value);
			});
		}
		else
		{
			displayTextWithFilter(state.get(mKey));
			var cleanup = state.onChange(mKey, function(event)
			{
				displayTextWithFilter(event.value);
			});
		}


		// cleanup
		return cleanup;
	}

});


/*
|
|	Two way binding between the state and the elements value
|   
|   State values should be formatted for the appropriate input as such
|	 - input:type=text,password,number,email etc - string
|	 - input:type=radio - string
|    - input:type=checkbox - array or bool
|	 - select - string matching option value
|
|
*/
flour.binding.add('f-value', 
{

	attach: function(element, state, view)
	{
		var mKey = element.getAttribute('f-value');
		var mType = element.type ? element.type.toLowerCase() : 'text';
		var mValue = state.get(mKey);
		var mElementValue = element.getAttribute('value');

		if(mValue === undefined)
		{
			mValue = '';
		}



		//
		// Function to Set the element's value depending on the element type and input type
		//
		function setElementValue(val)
		{
			if(mType === 'radio')
			{
				element.checked = mElementValue === val;
				return;
			}
			
			if(mType === 'checkbox')
			{
				if(flour.util.isArray(val))
				{
					element.checked = val.includes(mElementValue);
				}
				else
				{
					element.checked = val ? true : false;
				}

				return;
			}
			
			element.value = val;
		}



		//
		// Sub to state change so we update the element to match
		//
		var cleanup = state.onChange(mKey, function(event)
		{
			setElementValue(event.value);
		});




		//		
		// Attach appropriate change/input listeners on our element so we can update the state
		//
		if(mType === 'radio')
		{
			element.addEventListener('change', function()
			{
				state.set(mKey, mElementValue);
			});
		}
		else if(mType === 'checkbox')
		{
			if(flour.util.isArray(mValue))
			{
				element.addEventListener('change', function()
				{
					var checkedItems = state.get(mKey);
					var itemPosition = checkedItems.indexOf(mElementValue);
					
					if(element.checked)
					{
						if(itemPosition === -1)
						{
							checkedItems.push(mElementValue);
						}
					}
					else
					{
						if(itemPosition !== -1)
						{
							checkedItems.splice(itemPosition, 1);
						}
					}

					state.set(mKey, checkedItems);
				});
			}
			else
			{
				element.addEventListener('change', function()
				{
					state.set(mKey, element.checked ? true : false);
				});
			}
		}
		else
		{
			element.addEventListener('input', function()
			{
				state.set(mKey, element.value);
			});
		}


		// initial setup
		setElementValue(mValue);
		flour.util.defer(function()
		{
			setElementValue(mValue);
		});
		

		// cleanup
		return cleanup;
	}

});

flour.binding.add('f-view', 
{

	attach: function(element, state, view)
	{
		var mView = element.getAttribute('f-view');
		
		element.innerHTML = 'view: ' + mView;	
	}

});



flour.block.add('if', function(block, state, view)
{
	var mKey = block.key;
	var mInverse = false;

	if(mKey[0] === '!')
	{
		mInverse = true;
		mKey = mKey.substring(1);
	}

	var mBlockHtml = block.html;
	var mValue = state.get(mKey);
	var mShow = false;
	var mTemplate = false;


	/*
	|
	|	Sub to change events 
	|
	*/
	var cleanup = state.onChange(mKey, function(event)
	{
		mValue = event.value;
		showContent();
	});

	var showContent = function()
	{
		var show = mValue ? true : false;
		show = mInverse ? !show : show;
		
		if(show === mShow)
		{
			return;
		}

		mShow = show;

		if(show)
		{
			mTemplate = flour.template.parse(mBlockHtml, state, view);
			block.display(mTemplate.fragment);
		}
		else
		{
			if(mTemplate)
			{
				mTemplate.cleanup();
				mTemplate = false;
			}

			block.display(false);
		}
	};

	showContent();

	return cleanup;
});



flour.block.add('list', function(block, state, view)
{
	var mKey = block.key;
	var mBlockHtml = block.html;
	
	var mItems = [];
	var mLookup = {};


	/*
	|
	|	Helpers for managing the list of items
	|
	*/
	var getItem = function(id)
	{
		return mItems[mLookup[id]];
	}

	var updateLookup = function()
	{
		for(var i = 0, n = mItems.length; i < n; i ++)
		{
			mLookup[mItems[i].id] = i;
		}
	}


	/*
	|
	|	Sub to change events 
	|
	*/
	var cleanup = state.onChange(mKey, function(event)
	{
		if(event.type === 'insertItem')
		{
			handleInsertItem(event);
		}

		if(event.type === 'removeItem')
		{
			handleRemoveItem(event);
		}

		if(event.type === 'updateItem')
		{
			handleUpdateItem(event);
		}

		if(event.type === 'moveItem')
		{
			handleMoveItem(event);
		}

		if(event.type === 'update')
		{
			renderListItems();
		}
	});





	/*
	|
	|	Insert item handler
	|
	|	@event - changeEvent - event details containing the item and its index
	|
	*/
	var handleInsertItem = function(event)
	{
		insertItem(event.item, event.index);
	};

	var insertItem = function(item, index)
	{
		var itemId = item.id;
		var itemState = flour.state(item);
		var itemTemplate = flour.template.parse(mBlockHtml, itemState, view);
		var item = {
			id: itemId,
			el: itemTemplate.fragment.firstElementChild,
			state: itemState
		};

		itemState.onChange(function(event)
		{
			state.getItem(mKey, itemId).update(event.key, event.value);
		});


		if(index === undefined)
		{
			mItems.push(item);
		}
		else
		{
			mItems.splice(index, 0, item);
		}

		updateLookup();


		if(mItems.length === 1)
		{
			block.display(mItems[0].el);
		}
		else
		{
			if(index < mItems.length - 1)
			{
				var itemAhead = mItems[index + 1].el;
				itemAhead.parentNode.insertBefore(itemTemplate.fragment, itemAhead);
			}
			else
			{
				var endItem = mItems[mItems.length - 2].el;
				endItem.after(itemTemplate.fragment);
			}
		}
	}



	/*
	|
	|	Remove item handler
	|
	|	@event - changeEvent - event details containing the item to be removed
	|
	*/
	var handleRemoveItem = function(event)
	{
		var item = getItem(event.item.id);

		if(item)
		{
			item.el.remove();
			mItems.splice(event.index, 1);
			updateLookup();
		}
	};



	/*
	|
	|	Update item handler
	|
	|	@event - changeEvent - event details containing the item and the keys + values that were changed
	|
	*/
	var handleUpdateItem = function(event)
	{
		var item = getItem(event.item.id);

		if(item)
		{
			for(var i = 0, n = event.keys.length; i < n; i ++)
			{
				item.state.set(event.keys[i], event.values[i]);
			}
		}
	};



	/*
	|
	|	Move item handler
	|
	|	@event - changeEvent - event details containing the item and its new index
	|
	*/
	var handleMoveItem = function(event)
	{
		var item = getItem(event.item.id);
		var newIndex = event.index;
		var currentIndex = event.oldIndex;

		if(item)
		{
			if(newIndex < event.value.length - 1)
			{
				var itemAheadIndex = mLookup[event.value[newIndex + 1].id];
				var itemAhead = mItems[itemAheadIndex].el;
				itemAhead.parentNode.insertBefore(item.el, itemAhead);
			}
			else
			{
				var endItem = mItems[mItems.length - 1].el;
				endItem.parentNode.append(item.el);
			}


			mItems.splice(newIndex, 0, mItems.splice(currentIndex, 1)[0]);
			updateLookup();
		}
	};





	/*
	|
	|	Basic render
	|
	*/
	var renderListItems = function()
	{
		// clear existing
		for(var i = 0, n = mItems.length; i < n; i ++)
		{
			mItems[i].el.remove();
		}

		mItems.length = 0;


		// display items in state
		var items = state.get(mKey);
		items.forEach((item) => 
		{
			insertItem(item);
		});
	}


	
	renderListItems();

	return cleanup;
});


/*
|
|	Simple json stringify filter
|
*/
flour.filter.add('json', function(data)
{
	return JSON.stringify(data, undefined, 2);
});
