
flour.view.add('blocks', function()
{
	var view = this;

	view.init = function(params)
	{
		displayBlockView(params);
	};

	view.routeUpdate = function(route)
	{
		displayBlockView(route.params);
	};

	var displayBlockView = function(params)
	{
		var viewName = params.block ? 'block_' + params.block : 'block_if';
		view.embedView('view', view.getView(viewName));
	};


	view.templateHTML = `
		<div class="info-layout">
			<div class="sub-nav sub-nav--code">
				<ul>
					<li><a href="/blocks/if">#if</a></li>
					<li><a href="/blocks/list">#list</a></li>
					<li><a href="/blocks/list_perf">#list_perf</a></li>
				</ul>
			</div>
			<div f-view="view"></div>
		</div>
	`;
});