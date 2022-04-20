
flour.view.add('block_view', function()
{
	var childViewParams = {
		count: 0
	};

	this.init = () => 
	{
		this.createChildView();
	};

	this.createChildView = () => 
	{
		this.getView('block_view_child', childViewParams);
		childViewParams.count ++;
	}
	
	this.templateHTML = `
		<h1>Block view</h1>
		<div f-view="block_view_child"></div>
		<div>
			<button f-on="click createChildView">Create child view</button>
		</div>
	`;
});





flour.view.add('block_view_child', function()
{
	this.init = (params) => 
	{
		this.state.set('params', params);
	};

	this.templateHTML = `
		<h2>Child view</h2>
		<p>Just a simple view to demonstrate adding a view within a view.</p>
		<div>
			<p>These are the props passed to this view.</p>
			<pre f-text="params | json"></pre>
		</div>
	`;
});