
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

flour.view.add('f-show', function()
{
	var view = this;

	view.init = function()
	{
		view.state.set('show', true);
	};

	view.handleDisplayToggle = function()
	{
		view.state.set('show', !view.state.get('show'));
	};
	
	view.templateHTML = `
		<h1>f-show</h1>
		<p>
			A simple hide toggle when the passed in state is falsy.
		</p>

		<p>
			Show is set to <span f-show="show">true</span><span f-show="!show">false</span> as you can see.
		</p>

		<p f-show="show">Show me as a block!</p>

		<button f-on="click handleDisplayToggle">Toggle</button>
	`;
});

flour.view.add('f-class', function()
{
	var view = this;

	view.init = function()
	{
		view.state.set('my_class', 'square--red');
		view.state.set('red', true);
		view.state.set('rounded', true);
	};
	
	view.templateHTML = `
		<style>
			.square{
				width: 80px;
				height: 80px;
				margin: 16px 0;
				background-color: #888;

				transition: background 250ms, border-radius 250ms;
			}

			.square--red{
				background-color: salmon;
			}

			.square--rounded{
				border-radius: 8px;
			}
		</style>
		<h1>f-class</h1>
		

		<div>
			<input type="text" f-value="my_class" />
			<pre>my_class</pre>
			<div class="square" f-class="my_class"></div>
			<hr />

			<div>
				<div>red: <input type="checkbox" f-value="red" /></div>
				<div>rounded: <input type="checkbox" f-value="rounded" /></div>
			</div>
			<pre>red square--red,rounded square--rounded</pre>
			<div class="square" f-class="red square--red,rounded square--rounded"></div>
			<hr />
		</div>
	`;
});