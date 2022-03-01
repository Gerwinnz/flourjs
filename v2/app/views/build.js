
flour.view.add('build', function()
{
	var view = this;


	// Create build resource
	var getVersion = flour.http.get('http://localhost/flourjs/v2/api/version');
	var createBuild = flour.http.post('http://localhost/flourjs/v2/api/build');


	//
	// Init
	//
	view.init = function()
	{
		view.state.set('version_bump', 'patch');
		view.state.set('loading', false);

		view.state.set('general', '');
		view.state.set('added', '');
		view.state.set('changed', '');
		view.state.set('deprecated', '');
		view.state.set('removed', '');
		view.state.set('fixed', '');
		view.state.set('security', '');

		view.state.set('new_version', {major: '', minor: '', patch: ''});
		view.state.set('current_version', {major: 0, minor: 0, patch: 0});


		// Fetch details
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


	//
	// Update new version
	//
	var updateNewVersion = function()
	{
		var bump = view.state.get('version_bump');
		var v = view.state.get('current_version');

		v[bump] ++;
		view.state.set('new_version', v);
	};


	//
	// Click handler
	//
	view.handleFormSubmit = function(event, el)
	{
		event.preventDefault();

		var postData = {
			version: view.state.get('new_version.major') + '.' + view.state.get('new_version.minor') + '.' + view.state.get('new_version.patch'),
			general: view.state.get('general'),
			added: view.state.get('added'),
			changed: view.state.get('changed'),
			deprecated: view.state.get('deprecated'),
			removed: view.state.get('removed'),
			fixed: view.state.get('fixed'),
			security: view.state.get('security')
		};


		// Post
		view.state.set('loading', true);
		createBuild(postData).then(function(response)
		{
			view.state.set('loading', false);

			if(response.status === 'success')
			{
				var versionPieces = response.version.split('.');
				view.state.set('current_version', {
					major: parseInt(versionPieces[0]),
					minor: parseInt(versionPieces[1]),
					patch: parseInt(versionPieces[2])
				});

				updateNewVersion();
			}
		});
	};


	// Output
	view.templateHTML = 
	`
		<form f-on="submit handleFormSubmit">
			<div class="build-contents__section">
				<div class="form__line">
					<textarea auto-resize f-value="general" placeholder="General comments"></textarea>
				</div>

				<div class="form__line">
					<label>Added</label>
					<textarea auto-resize f-value="added" placeholder="Added"></textarea>
				</div>

				<div class="form__line">
					<label>Changed</label>
					<textarea auto-resize f-value="changed" placeholder="Changed"></textarea>
				</div>

				<div class="form__line">
					<label>Deprecated</label>
					<textarea auto-resize f-value="deprecated" placeholder="Deprecated"></textarea>
				</div>

				<div class="form__line">
					<label>Removed</label>
					<textarea auto-resize f-value="removed" placeholder="Removed"></textarea>
				</div>

				<div class="form__line">
					<label>Fixed</label>
					<textarea auto-resize f-value="fixed" placeholder="Fixed"></textarea>
				</div>

				<div class="form__line">
					<label>Security</label>
					<textarea auto-resize f-value="security" placeholder="Security"></textarea>
				</div>
			</div>

			<div class="form__line">
				Current version 
				<span f-text="current_version.major"></span>.<span f-text="current_version.minor"></span>.<span f-text="current_version.patch"></span>
			</div>

			<div class="form__line">
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

			<div class="form__line">
				<button f-class="loading button--loading">
					{{#if loading}}Creating...{{/if}}

					{{#if !loading}}
						Create build 
						<span f-text="new_version.major"></span>.<span f-text="new_version.minor"></span>.<span f-text="new_version.patch"></span>
					{{/if}}
				</button>
			</div>
		</form>
	`;

});