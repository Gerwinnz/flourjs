

flour.binding.add('on-click', 
{

	attach: function(element, state, view)
	{
		var clickHandler = element.getAttribute('on-click');
		
		if(view[clickHandler])
		{
			element.addEventListener('click', function(event)
			{
				view[clickHandler](event, element);
			});
		}
	}

});

