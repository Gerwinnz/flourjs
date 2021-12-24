
flour.view.add('binders', function()
{
	var view = this;
	var binderView = false;

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
			<div f-ref="dest">

			</div>
		</div>
	`;

	view.init = function(params)
	{
		view.render();
		displayBinderView(params);
	};

	view.routeUpdate = function(route)
	{
		displayBinderView(route.params);
	};



	var displayBinderView = function(params)
	{
		if(!params.binder)
		{
			return;
		}

		if(binderView)
		{
			binderView.destroy();
		}

		if(params.binder === 'submit')
		{
			binderView = flour.view.get('form');
			view.refs.dest.append(binderView.el);
		} 
	}
});