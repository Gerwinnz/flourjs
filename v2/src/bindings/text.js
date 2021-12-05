

flour.binding.add('f-text', 
{

	attach: function(element, state, view)
	{
		var key = element.getAttribute('f-text');
		var value = state.get(key)
		element.innerText = value;

		var remove = state.onChange(key, function(event)
		{
			element.innerText = event.value;
		});

		return function(){
			remove();
		}
	}

});

