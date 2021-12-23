
flour.view.add('binders', function()
{
	var view = this;

	view.templateHTML = `
		<div class="info-layout">
			<div class="sub-nav">
				<ul>
					<li><a href="/binders/click">Click</a></li>
					<li><a href="/binders/options">Options</a></li>
					<li><a href="/binders/ref">Ref</a></li>
					<li><a href="/binders/submit">Submit</a></li>
					<li><a href="/binders/text">Text</a></li>
					<li><a href="/binders/value">Value</a></li>
				</ul>
			</div>
			<div>

			</div>
		</div>
	`;

	view.init = function(params)
	{
		view.render();
	};

	view.routeUpdate = function(route)
	{
		console.log('UPDATE', route.params);
	};
});