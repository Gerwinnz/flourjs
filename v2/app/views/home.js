

flour.view.add('home', function()
{
	var view = this;
	view.templateHTML = `
		<div class="card">
			<h1>Flour JS</h1>
			<p>Welcome to flour js home page.</p>
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