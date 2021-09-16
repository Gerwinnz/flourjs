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

		this.el = document.createElement(this.tag);

		if(this.template)
		{
			templateHTML = document.getElementById('flour-template.' + this.template).innerHTML;
		}
		else
		{
			templateHTML = '<p>No template found.</p>';
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
		templateHTML = templateHTML.replace(/{{\s?(\S*)\s?}}/g, (tag, tagInside) => {
			return this.state.get(tagInside);
		});

		this.el.innerHTML = templateHTML;

		var elsWithEvents = this.el.querySelectorAll('[on-click]');
	};



	this.createState = function()
	{
		return {};
	};

};