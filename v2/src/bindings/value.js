

flour.binding.add('f-value', 
{

	attach: function(element, state, view)
	{
		var key = element.getAttribute('f-value');
		var type = element.type ? element.type.toLowerCase() : 'text';
		var value = state.get(key);
		var elementValue = element.getAttribute('value');

		if(value === undefined)
		{
			value = '';
		}


		var remove = state.onChange(key, function(event)
		{
			if(type === 'radio')
			{
				element.checked = elementValue === event.value;
			}
			else if (type === 'checkbox')
			{
				if(flour.util.isArray(event.value))
				{
					element.checked = event.value.includes(elementValue);
				}
				else
				{
					element.checked = elementValue === event.value;
				}
			}
			else
			{
				element.value = event.value;
			}
		});


		if(type === 'radio')
		{
			if(elementValue === value)
			{
				element.checked = 'checked';
			}

			element.addEventListener('change', function()
			{
				state.set(key, elementValue);
			});
		}
		else if(type === 'checkbox')
		{
			if(flour.util.isArray(value))
			{
				element.checked = value.includes(elementValue);

				element.addEventListener('change', function()
				{
					var checkedItems = state.get(key);
					var itemPosition = checkedItems.indexOf(elementValue);
					
					if(element.checked)
					{
						if(itemPosition === -1)
						{
							checkedItems.push(elementValue);
						}
					}
					else
					{
						if(itemPosition !== -1)
						{
							checkedItems.splice(itemPosition, 1);
						}
					}

					state.set(key, checkedItems);
				});
			}
			else
			{
				element.checked = elementValue === value;
				element.addEventListener('change', function()
				{
					state.set(key, elementValue);
				});
			}
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