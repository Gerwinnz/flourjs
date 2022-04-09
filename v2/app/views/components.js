
flour.view.add('examples', function()
{
	var view = this;
	var blockView = false;


	view.init = function(params)
	{
		view.render();
		displayBlockView(params);
	};

	view.routeUpdate = function(route)
	{
		displayBlockView(route.params);
	};



	var displayBlockView = function(params)
	{
		if(blockView)
		{
			blockView.remove();
		}

		blockView = flour.view.get(params.example || 'form');
		view.elements.dest.append(blockView.el);
	}



	view.templateHTML = `
		<div class="info-layout">
			<div class="sub-nav sub-nav--code">
				<ul>
					<li><a href="/examples/form">Form</a></li>
					<li><a href="/examples/http">HTTP</a></li>
					<li><a href="/examples/wall_builder">Wall builder</a></li>
				</ul>
			</div>
			<div f-name="dest">

			</div>
		</div>
	`;
});