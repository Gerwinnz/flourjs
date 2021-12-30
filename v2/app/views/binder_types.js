
flour.view.add('f-on', function()
{
	var view = this;
	
	view.templateHTML = `
		<h1>f-on</h1>
		<p>
			This binder allows you to easily attach event listeners to elements.
		</p>
	`;
});



flour.view.add('f-options', function()
{
	var view = this;
	
	view.templateHTML = `
		<h1>f-options</h1>
		<p>
			Used on select elements this binder will create option children elements.
		</p>
	`;
});


flour.view.add('f-ref', function()
{
	var view = this;
	
	view.templateHTML = `
		<h1>f-ref</h1>
		<p>
			Create a reference to the element for manipulation by the view.
		</p>
	`;
});


flour.view.add('f-text', function()
{
	var view = this;
	
	view.templateHTML = `
		<h1>f-text</h1>
		<p>
			The state value will be set as the text content for the element.
		</p>
	`;
});


flour.view.add('f-value', function()
{
	var view = this;
	
	view.templateHTML = `
		<h1>f-value</h1>
		<p>
			A two way binding to for form elements with the state.
		</p>
	`;
});