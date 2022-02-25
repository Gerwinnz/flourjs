
flour.view.add('build', function()
{
	var view = this;


	// Create build resource
	var getVersion = flour.http.get('http://localhost/flourjs/v2/api/version');
	var createBuild = flour.http.get('http://localhost/flourjs/v2/api/build');


	// Init
	view.init = function()
	{
		view.state.set('version_bump', 'patch');
		view.state.set('loading', false);

		view.state.set('general', '');
		added: view.state.set('added', '');
		changed: view.state.set('changed', '');
		deprecated: view.state.set('deprecated', '');
		removed: view.state.set('removed', '');
		fixed: view.state.set('fixed', '');
		security: view.state.set('security', '');

		view.state.set('new_version', {
			major: '',
			minor: '',
			patch: ''
		});

		getVersion().then(function(response)
		{
			var versionPieces = response.version.split('.');

			view.state.set('current_version', {
				major: parseInt(versionPieces[0]),
				minor: parseInt(versionPieces[1]),
				patch: parseInt(versionPieces[2])
			});

			updateNewVersion();
		});

		view.state.onChange('version_bump', updateNewVersion);
	};


	// Update new version
	var updateNewVersion = function()
	{
		var bump = view.state.get('version_bump');
		var v = view.state.get('current_version');

		v[bump] ++;
		view.state.set('new_version', v);
	};


	// Click handler
	view.handleFormSubmit = function(event, el)
	{
		event.preventDefault();

		var postData = {
			version: view.state.get('new_version.major') + '.' + view.state.get('new_version.minor') + view.state.get('new_version.patch'),
			general: view.state.get('general'),
			added: view.state.get('added'),
			changed: view.state.get('changed'),
			deprecated: view.state.get('deprecated'),
			removed: view.state.get('removed'),
			fixed: view.state.get('fixed'),
			security: view.state.get('security')
		};

		view.state.set('loading', true);
		createBuild(postData).then(function(response)
		{
			console.log(response);
			view.state.set('loading', false);
		});
	};


	// Output
	view.templateHTML = 
	`
		<form f-on="submit handleFormSubmit">
			<div>
				<h2>Version</h2>
				
				<h3>
					New: 
					<span f-text="new_version.major"></span>.<span f-text="new_version.minor"></span>.<span f-text="new_version.patch"></span>
				</h3>
				<h3>
					Current: 
					<span f-text="current_version.major"></span>.<span f-text="current_version.minor"></span>.<span f-text="current_version.patch"></span>
				</h3>
				
				<div>
					<label for="version_major">Major</label>
					<input id="version_major" type="radio" value="major" name="version" f-value="version_bump" />
				</div>
				<div>
					<label for="version_minor">Minor</label>
					<input id="version_minor" type="radio" value="minor" name="version" f-value="version_bump" />
				</div>
				<div>
					<label for="version_patch">Patch</label>
					<input id="version_patch" type="radio" value="patch" name="version" f-value="version_bump" />
				</div>
			</div>

			<div>
				<h2>Change log details</h2>

				<div class="form__line">
					<label>General</label>
					<textarea f-value="general" placeholder="General comments about this release"></textarea>
				</div>

				<div class="form__line">
					<label>Added</label>
					<textarea f-value="added" placeholder="Added features and functionality"></textarea>
				</div>

				<div class="form__line">
					<label>Changed</label>
					<textarea f-value="changed" placeholder="Changes to existing functionality"></textarea>
				</div>

				<div class="form__line">
					<label>Deprecated</label>
					<textarea f-value="deprecated" placeholder="What's been deprecated and marked for removal"></textarea>
				</div>

				<div class="form__line">
					<label>Removed</label>
					<textarea f-value="removed" placeholder="What's been removed"></textarea>
				</div>

				<div class="form__line">
					<label>Fixed</label>
					<textarea f-value="fixed" placeholder="Bug fixes"></textarea>
				</div>

				<div class="form__line">
					<label>Security</label>
					<textarea f-value="security" placeholder="Fixes specifically around security"></textarea>
				</div>
			</div>

			<div>
				<button f-class="loading button--loading">
					{{#if loading}}Loading...{{/if}}
					{{#if !loading}}Create build{{/if}}
				</button>
			</div>
		</form>
	`;

});