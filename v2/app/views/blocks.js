
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

	view.willShow = function(data)
	{
		console.log('will show life cycle method called', data);
	};



	var displayBlockView = function(params)
	{
		if(blockView)
		{
			blockView.remove();
		}

		blockView = flour.view.get(params.block ? 'block-' + params.block : 'block-if');
		view.refs.dest.append(blockView.el);
	}
});