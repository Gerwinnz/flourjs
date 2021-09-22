

flour.binding.add('on-click', 
{

	attach: function(element, attributeValue, view)
	{
		if(view[attributeValue])
		{
			element.addEventListener('click', function(event)
			{
				view[attributeValue](event, element);
			});
		}
	},


	remove: function()
	{

	},


	update: function()
	{

	}

});

