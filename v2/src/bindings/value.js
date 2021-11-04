

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




// flour.binding.add('flour-val', function(element, attributeValue, view)
// {
// 	element.value = view.state.get(attributeValue);

// 	var remove = view.state.onChange(attributeValue, function(val)
// 	{
// 		element.value = val;
// 	});

// 	element.addEventListener('input', function()
// 	{
// 		view.state.set(attributeValue, element.value);
// 	});



// 	return function(){
// 		remove();
// 	};
// });