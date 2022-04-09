
flour.view.add('block_if', function()
{
	var view = this;

	view.init = function()
	{
		view.state.set('show', true);
		view.state.set('count', 1);
		view.state.set('items', 
		[
			{
				id: 1,
				name: 'Gandalf'
			},
			{
				id: 2,
				name: 'Frodo'
			},
			{
				id: 3,
				name: 'Sam'
			}
		]);
	}

	view.handleToggleClick = function()
	{
		view.state.set('show', !view.state.get('show'));
	};

	view.handleIncrementCountClick = function()
	{
		view.state.set('count', view.state.get('count') + 1);
	};
	
	view.templateHTML = `
		<h1>Block if</h1>

		<p>Count: <span f-text="count"></span></p>

		<div f-show="count > 5">Greater than 5!</div>

		{{#if count > 10}}
			<div>COUNT IS GREATER THAN 10!!</div>
		{{/if}}

		<hr />
		
		{{#if show}}
			<div>SHOW === TRUE</div>
			<div>COUNT === <span f-text="count"></span></div>
			{{#list items}}
				<p>{{name}}</p>
			{{/list}}
			<hr />
		{{/if}}

		{{#if !show}}
			<div>SHOW === FALSE</div>
			<div>COUNT === <span f-text="count"></span></div>
			<hr />
		{{/if}}

		<button f-on="click handleToggleClick">Toggle show!</button>
		<button f-on="click handleIncrementCountClick">Increment count!</button>
	`;

});