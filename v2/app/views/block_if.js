
flour.view.add('block-if', function()
{
	var view = this;

	view.init = function()
	{
		view.state.set('show', true);
		view.state.set('count', 1);
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
		<div>
			<h1>Block if</h1>
			
			{{#if show}}
				<div>SHOW === TRUE</div>
				<div>COUNT === <span f-text="count"></span></div>
				<hr />
			{{/if}}

			<button f-on="click handleToggleClick">Toggle show!</button>
			<button f-on="click handleIncrementCountClick">Increment count!</button>
		</div>
	`;

});