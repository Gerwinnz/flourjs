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
		this.el.style.backgroundColor = '#eee';
		this.el.style.padding = '8px';

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
		var html = templateHTML;
		var templateFragment = document.createElement('template');
		var blocks = [];
		
		// parse block tag
		html = html.replace(/{{#list (\w*)}}((.|\n)*){{\/list}}/g, (tag, list, itemHTML) => {
			
			flour.view.elementUniqueId ++;

			var elementUniqueId = flour.view.elementUniqueId;
			blocks.push({
				type: 'list',
				elementUniqueId: elementUniqueId,
				stateKey: list,
				html: itemHTML,
				items: []
			});

			return '<div id="flour-' + elementUniqueId + '"></div>';
		});


		// parse standard output tag
		html = html.replace(/{{\s?(\S*)\s?}}/g, (tag, tagInside) => {
			return this.state.get(tagInside);
		});


		// set our template HTML to our parsed output
		templateFragment.innerHTML = html;


		// empty our view element and append our fragment contents
		this.el.innerHTML = '';
		this.el.appendChild(templateFragment.content);


		// go through our blocks and fetch their destination element
		for(var i = 0, n = blocks.length; i < n; i ++)
		{
			blocks[i].el = this.el.querySelector('#flour-' + blocks[i].elementUniqueId);

			if(blocks[i].type === 'list')
			{
				var items = this.state.get(blocks[i].stateKey);
				console.log('list items', items);
			}
		}


		// attach bindings
		for(var bindingName in flour.binding.defined)
		{
			var elements = this.el.querySelectorAll('[' + bindingName + ']');
			if(elements.length > 0)
			{
				for(var i = 0, n = elements.length; i < n; i ++)
				{
					flour.binding.defined[bindingName].attach(elements[i], elements[i].getAttribute(bindingName), this);
				}
			}
		}

		window.templateFragment = templateFragment;


		console.log(blocks);
	};



	this.createState = function()
	{
		return {};
	};

};