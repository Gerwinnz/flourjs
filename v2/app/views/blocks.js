
flour.view.add('blocks', function()
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

	view.willShow = function(data)
	{
		
	};


	var displayBlockView = function(params)
	{
		if(blockView)
		{
			blockView.remove();
		}

		blockView = flour.view.get(params.block ? 'block_' + params.block : 'block_if');
		view.elements.dest.append(blockView.el);
	}


	view.templateHTML = `
		<div class="info-layout">
			<div class="sub-nav sub-nav--code">
				<ul>
					<li><a href="/blocks/if">#if</a></li>
					<li><a href="/blocks/view">#view</a></li>
					<li><a href="/blocks/list">#list</a></li>
					<li><a href="/blocks/list_perf">#list_perf</a></li>
				</ul>
			</div>
			<div f-name="dest">

			</div>
		</div>
	`;
});