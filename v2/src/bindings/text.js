

flour.binding.add('flour-text', 
{

	attach: function(element, attributeValue, view)
	{
		element.innerText = view.state.get(attributeValue);

		var remove = view.state.onChange(attributeValue, function(event)
		{
			element.innerText = event.value;
		});

		return function(){
			remove();
		}
	}

});

