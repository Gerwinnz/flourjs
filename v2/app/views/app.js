

flour.view.add('app', function()
{
	var view = this;
	view.templateHTML = `
		<div class="nav">
			<div class="logo">f</div>
			<ul>
				<li><a href="/binders">Binders</a></li>
				<li><a href="/blocks">Blocks</a></li>
				<li><a href="/components">Components</a></li>
			</ul>
		</div>

		<div f-ref="app" class="body"></div>

		<div class="footer">
			Flourjs - 2021
		</div>
	`;


	/*
	|
	|	Init
	|
	*/
	view.init = function(params)
	{
		view.render();
	};

});