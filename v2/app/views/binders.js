
flour.view.add('binders', function()
{
	var view = this;

	view.init = function(params)
	{
		displayBinderView(params);
	};

	view.routeUpdate = function(route)
	{
		displayBinderView(route.params);
	};

	var displayBinderView = function(params)
	{
		var viewName = params.binder ? 'f-' + params.binder : 'f-on';
		view.embedView('view', view.getView(viewName));
	};


	view.templateHTML = `
		<div class="info-layout">
			<div class="sub-nav sub-nav--code">
				<ul>
					<li><a href="/binders/on">f-on</a></li>
					<li><a href="/binders/ref">f-ref</a></li>
					<li><a href="/binders/text">f-text</a></li>
					<li><a href="/binders/view">f-view</a></li>
					<li><a href="/binders/value">f-value</a></li>
					<li><a href="/binders/show">f-show</a></li>
					<li><a href="/binders/class">f-class</a></li>
				</ul>
			</div>
			<div f-view="view"></div>
		</div>
	`;

});