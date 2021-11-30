

flour.view.add('hello_world', function()
{
	var view = this;
	view.template = 'hello_world';


	/*
	|
	|	Init
	|
	*/
	view.init = function(params)
	{
		params = params || {};
		view.state.set('name', params.name);
		view.state.set('id', this.id);

		view.render();
	};



	view.handleNameClick = function()
	{
		view.state.set('name', 'clicked!!');
	};

});



class HelloWorld extends HTMLElement 
{	
	constructor() 
	{
		super();
		this.view = flour.view.get('hello_world');
	}

	static get observedAttributes() 
	{
	  	return ['name'];
	}

	attributeChangedCallback(property, oldValue, newValue) 
	{  
		if (oldValue === newValue)
		{
			return;
		}

	  	this.view.state.set(property, newValue);
	}

	connectedCallback() 
	{
		this.append(this.view.el);
	}
}


customElements.define('hello-world', HelloWorld);