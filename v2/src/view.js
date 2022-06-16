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

flour.view.get = function(name, params, extraOptions)
{
	var viewInstance = false;

	if(!flour.view.defined[name])
	{
		flour.util.throw('Flour: View "' + name + '" has not been defined.');
		return;
	}

	viewInstance = new flour.view.defined[name]();

	if(extraOptions)
	{
		if(extraOptions.templateHTML)
		{
			viewInstance.templateHTML = extraOptions.templateHTML;
		}
	}

	viewInstance.initialize(params, extraOptions);

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
	this.initialize = function(params, extraOptions)
	{
		if(!this.state){ this.state = flour.state(); }
		if(!this.tag){ this.tag = 'div'; }
		if(!this.events){ this.events = {}; }
		if(!this.renderCount){ this.renderCount = 0; }
		if(!this.views){ this.views = []; }
		if(!this.embeddedViews){ this.embeddedViews = {}; }
		if(!this.subscriptions){ this.subscriptions = []; }

		this.id = flour.util.generateId();
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
			this.init(params, extraOptions);
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
		if(this.templateInstance)
		{
			this.templateInstance.cleanup();
		}

		// Remove all children views
		for(var i = 0, n = this.views.length; i < n; i ++)
		{
			this.views[i].destroy();
		}

		// Remove all subscriptions
	    for(var i = 0, n = this.subscriptions.length; i < n; i ++)
	    {
	      flour.unsubscribe(this.subscriptions[i].eventName, this.subscriptions[i].callback);
	    }
	};



	this.remove = function()
	{
		this.destroy();
		this.el.parentNode.removeChild(this.el);
	};




	/*
	|
	|
	|	Initiates a view and stores a reference to it so it can destroy the children views 
	|
	|	@viewName - string - the name of the view as it was added
	| 	@viewParams - object - the params to init the view with
	|
	|
	*/
	this.getView = function(viewName, viewParams)
	{
		var viewInstance = flour.view.get(viewName, viewParams);
		this.views.push[name] = viewInstance;
		
		return viewInstance;
	};



	/*
	|
	|
	|	Creates a names reference to a view which the f-view binder can use to inject into the template
	|
	|	@embedName - string - the name of the reference the binder will use
	| 	@viewInstance - flour view - the view to embed
	|
	|
	*/
	this.embedView = function(embedName, viewInstance)
	{
		if(this.embeddedViews[embedName] !== undefined)
		{
			this.embeddedViews[embedName].remove();
		}

		this.embeddedViews[embedName] = viewInstance;
		this.trigger('embeddedViewUpdate', embedName);

		return viewInstance;
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


	/*
	|
	|
	|	Add a subscription to the global flourjs pub/sub service that is automatically removed when 
	|	the view is destroyed
	|
	|	@eventName - string - event name
	| 	@callback - function - to be called when the subscription is triggered
	|
	|
	*/
	this.subscribe = function(eventName, callback)
	{
	    var subscription = flour.subscribe(eventName, callback);
	    
	    this.subscriptions.push(
	    {
	      eventName: eventName,
	      callback: callback
	    });
	}

};