
flour.view.add('blocks', function()
{
	var view = this;

	view.templateHTML = `
		<div class="info-layout">
			<div class="sub-nav">
				<ul>
					<li><a href="/blocks/list">list</a></li>
					<li><a href="/blocks/if">if</a></li>
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

	view.routeUpdate = function(params)
	{

	};

});