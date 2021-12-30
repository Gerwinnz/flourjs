
flour.view.add('blocks', function()
{
	var view = this;
	var blockView = false;

	view.templateHTML = `
		<div class="info-layout">
			<div class="sub-nav sub-nav--code">
				<ul>
					<li><a href="/blocks/if">#if</a></li>
					<li><a href="/blocks/list">#list</a></li>
				</ul>
			</div>
			<div f-ref="dest">

			</div>
		</div>
	`;



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

		if(params.block === undefined)
		{
			blockView = flour.view.get('block-if');
		}
		else
		{
			blockView = flour.view.get('block-' + params.block);
		}

		view.refs.dest.append(blockView.el);
	}
});