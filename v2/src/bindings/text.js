

flour.binding.add('flour-text', 
{

	attach: function(element, state, view)
	{
		var key = element.getAttribute('flour-text');
		element.innerText = state.get(key);

		var remove = state.onChange(key, function(event)
		{
			element.innerText = event.value;
		});

		return function(){
			remove();
		}
	}

});

