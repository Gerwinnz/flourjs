

flour.view.add('app', function()
{
	var view = this;
	view.templateHTML = `
		<div class="nav">
			<a href="/" class="logo">f</a>
			<ul>
				<li><a href="/binders">Binders</a></li>
				<li><a href="/blocks">Blocks</a></li>
				<li><a href="/components">Components</a></li>
				<li><a href="/form">Form</a></li>
				<li><a href="/http">HTTP</a></li>
			</ul>
		</div>

		<div f-ref="app" class="body"></div>

		<div class="footer">flour.js</div>
	`;

});