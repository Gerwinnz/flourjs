
flour.view.add('binders', function()
{
	var view = this;
	var binderView = false;

	view.init = function(params)
	{
		view.render();
		displayBinderView(params);
	};

	view.routeUpdate = function(route)
	{
		displayBinderView(route.params);
	};

	view.willHide = function()
	{
		return {prev: 'binders'};
	}


	var displayBinderView = function(params)
	{
		if(binderView)
		{
			binderView.remove();
		}

		binderView = flour.view.get(params.binder ? 'f-' + params.binder : 'f-on');
		view.elements.dest.append(binderView.el);
	}


	view.templateHTML = `
		<div class="info-layout">
			<div class="sub-nav sub-nav--code">
				<ul>
					<li><a href="/binders/on">f-on</a></li>
					<li><a href="/binders/options">f-options</a></li>
					<li><a href="/binders/ref">f-ref</a></li>
					<li><a href="/binders/text">f-text</a></li>
					<li><a href="/binders/value">f-value</a></li>
					<li><a href="/binders/show">f-show</a></li>
					<li><a href="/binders/class">f-class</a></li>
				</ul>
			</div>
			<div f-name="dest">

			</div>
		</div>
	`;

});