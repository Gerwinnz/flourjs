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

		this.id = id;
		this.el = document.createElement(this.tag);
		
		if(this.templateHTML)
		{
			templateHTML = this.templateHTML;
		}
		else if(this.template)
		{
			var templateEl = document.getElementById('flour-template.' + this.template);
			if(!templateEl)
			{
				templateHTML = '<p>No template found.</p>';
			}
			else
			{
				templateHTML = document.getElementById('flour-template.' + this.template).innerHTML;
			}
		}

		if(this.init)
		{
			this.init(params);
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