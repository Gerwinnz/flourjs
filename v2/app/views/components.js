
flour.view.add('components', function()
{
	var view = this;
	var binderView = false;

	view.templateHTML = `
		<div>
			<h1>Components</h1>
			<p>Creating a component in flour.js is the same as creating a view and then calling flour.customElement.add().</p>
			<pre>flour.customElement.add('card-box', {
	view: 'card',
	shadow: true,
	props: ['name']
});</pre>
			<p>This will create the component for you.</p>
			<ul>
				<li>One</li>
				<li>Two</li>
			</ul>
		</div>
	`;
});