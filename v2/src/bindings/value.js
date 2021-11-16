

flour.binding.add('flour-value', 
{

	attach: function(element, state, view)
	{
		var key = element.getAttribute('flour-value');
		var value = state.get(key);

		if(value === undefined)
		{
			value = '';
		}

		element.value = value;

		var remove = state.onChange(key, function(event)
		{
			element.value = event.value;
		});

		element.addEventListener('input', function()
		{
			state.set(key, element.value);
		});

		return function(){
			remove();
		}
	}

});