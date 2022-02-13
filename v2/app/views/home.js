

flour.view.add('home', function()
{
	this.templateHTML = `
		<div class="card">
			<h1>Flour JS</h1>
			<p>Welcome to flour js home page. Check out some of flourjs's functionality below:</p>
			<ul>
				<li><a href="/binders">Binders</a></li>
				<li><a href="/blocks">Blocks</a></li>
				<li><a href="/components">Components</a></li>
			</ul>
		</div>
	`;
});