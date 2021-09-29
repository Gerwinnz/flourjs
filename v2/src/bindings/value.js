

flour.binding.add('flour-value', 
{

	attach: function(element, attributeValue, view)
	{
		element.value = view.state.get(attributeValue);

		var remove = view.state.onChange(attributeValue, function(val)
		{
			element.value = val;
		});

		element.addEventListener('input', function()
		{
			view.state.set(attributeValue, element.value);
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