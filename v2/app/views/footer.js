
flour.view.add('footer', function()
{
	this.init = function(params)
	{
		this.state.set('message', params.message);
	};
});