
flour.view.add('build', function()
{

	// Create build resource
	var createBuild = flour.http.get('http://localhost/flourjs/v2/api/build');


	// Click handler
	this.handleCreateBuildClick = function(event, el)
	{
		createBuild().then(function(response)
		{
			console.log(response);
		});
	};


	// Output
	this.templateHTML = 
	`
		<div>
			<button f-on="click handleCreateBuildClick">Create build</button>
		</div>
	`;

});