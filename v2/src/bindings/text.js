

flour.binding.add('flour-text', 
{

	attach: function(element, attributeValue, view)
	{
		element.innerText = view.state.get(attributeValue);

		view.state.onChange(attributeValue, function(val)
		{
			element.innerText = val;
		});

		// TODO: return a remove callback?
	},


	remove: function()
	{

	},


	update: function()
	{

	}

});

