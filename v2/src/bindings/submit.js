

flour.binding.add('on-submit', 
{

	attach: function(element, state, view)
	{
		var submit = element.getAttribute('on-submit');
		
		if(view[submit])
		{
			element.addEventListener('submit', function(event)
			{
				view[submit](event, element);
			});
		}
	}

});

