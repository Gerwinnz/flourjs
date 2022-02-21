
flour.view.add('build', function()
{
	var view = this;


	// Create build resource
	var createBuild = flour.http.get('http://localhost/flourjs/v2/api/build');


	// Init0
	view.init = function()
	{
		view.state.set('loading', false);
	};


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
		<h1>Create build</h1>

		<div>
			<h2>Version</h2>
			<div>
				Major <input type="radio" value="major" name="version" f-value="version_size" />
			</div>
			<div>
				Minor <input type="radio" value="minor" name="version" f-value="version_size" />
			</div>
			<div>
				Patch <input type="radio" value="patch" name="version" f-value="version_size" />
			</div>
		</div>

		<div>
			<h2>Change log details</h2>

			<div class="form__line">
				<label>Added</label>
				<textarea f-value="added"></textarea>
			</div>

			<div class="form__line">
				<label>Changed</label>
				<textarea f-value="changed"></textarea>
			</div>

			<div class="form__line">
				<label>Deprecated</label>
				<textarea f-value="deprecated"></textarea>
			</div>

			<div class="form__line">
				<label>Removed</label>
				<textarea f-value="removed"></textarea>
			</div>

			<div class="form__line">
				<label>Fixed</label>
				<textarea f-value="fixed"></textarea>
			</div>

			<div class="form__line">
				<label>Security</label>
				<textarea f-value="security"></textarea>
			</div>
		</div>

		<div>
			<button f-on="click handleCreateBuildClick" f-class="loading button--loading">
				{{#if loading}}Loading...{{/if}}
				{{#if !loading}}Create build{{/if}}
			</button>
		</div>
	`;

});