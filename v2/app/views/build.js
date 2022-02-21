
flour.view.add('build', function()
{
	var view = this;

	// Create build resource
	var createBuild = flour.http.get('http://localhost/flourjs/v2/api/build');


	view.init = function()
	{
		view.state.set('loading', false);
	}


	// Click handler
	view.handleCreateBuildClick = function(event, el)
	{
		view.state.set('loading', true);
		createBuild().then(function(response)
		{
			console.log(response);
			view.state.set('loading', false);
		});
	};


	// Output
	view.templateHTML = 
	`
		<div>
			<button f-on="click handleCreateBuildClick">
				{{#if loading}}Loading...{{/if}}
				{{#if !loading}}Create build{{/if}}
			</button>
		</div>
	`;

});