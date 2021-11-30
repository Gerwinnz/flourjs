

flour.binding.add('flour-text', 
{

	attach: function(element, state, view)
	{
		var key = element.getAttribute('flour-text');
		var value = state.get(key)
		element.innerText = value;

		console.log('hello attaching', key, value, view);

		var remove = state.onChange(key, function(event)
		{
			element.innerText = event.value;
		});

		return function(){
			remove();
		}
	}

});

