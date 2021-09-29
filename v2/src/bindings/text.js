

flour.binding.add('flour-text', 
{

	attach: function(element, attributeValue, view)
	{
		element.innerText = view.state.get(attributeValue);

		var remove = view.state.onChange(attributeValue, function(val)
		{
			element.innerText = val;
		});

		return function(){
			remove();
		}
	},


	remove: function()
	{

	},


	update: function()
	{

	}

});

