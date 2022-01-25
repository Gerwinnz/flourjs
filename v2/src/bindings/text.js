

flour.binding.add('f-text', 
{

	attach: function(element, state, view)
	{
		var mKey = element.getAttribute('f-text');
		var mValue = state.get(mKey)
		
		var cleanup = state.onChange(mKey, function(event)
		{
			element.innerText = event.value;
		});


		// initial setup
		element.innerText = mValue;


		// cleanup
		return cleanup;
	}

});

