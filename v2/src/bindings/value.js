

flour.binding.add('f-value', 
{

	attach: function(element, state, view)
	{
		var key = element.getAttribute('f-value');
		var type = element.type ? element.type.toLowerCase() : 'text';
		var value = state.get(key);


		if(value === undefined)
		{
			value = '';
		}


		var remove = state.onChange(key, function(event)
		{
			if(type === 'radio' || type === 'checkbox')
			{
				if(element.getAttribute('value') === event.value)
				{
					element.checked = 'checked';
				}
			}
			else
			{
				element.value = event.value;
			}
		});


		if(type === 'radio' || type === 'checkbox')
		{
			if(element.getAttribute('value') === value)
			{
				element.checked = 'checked';
			}

			element.addEventListener('change', function()
			{
				state.set(key, element.getAttribute('value'));
			});
		}
		else
		{
			element.value = value;
			element.addEventListener('input', function()
			{
				state.set(key, element.value);
			});
		}

		return function(){
			remove();
		}
	}

});