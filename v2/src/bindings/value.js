

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



		//
		// Function to Set the element's value depending on the element type and input type
		//
		function setElementValue(val)
		{
			if(type === 'radio')
			{
				element.checked = elementValue === val;
				return;
			}
			
			if(type === 'checkbox')
			{
				if(flour.util.isArray(val))
				{
					element.checked = val.includes(elementValue);
				}
				else
				{
					element.checked = val ? true : false;
				}

				return;
			}
			
			element.value = val;
		}



		//
		// Sub to state change so we update the element to match
		//
		var remove = state.onChange(key, function(event)
		{
			setElementValue(event.value);
		});




		//		
		// Attach appropriate change/input listeners on our element so we can update the state
		//
		if(type === 'radio')
		{
			element.addEventListener('change', function()
			{
				state.set(key, elementValue);
			});
		}
		else if(type === 'checkbox')
		{
			if(flour.util.isArray(value))
			{
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
				element.addEventListener('change', function()
				{
					state.set(key, element.checked ? true : false);
				});
			}
		}
		else
		{
			element.addEventListener('input', function()
			{
				state.set(key, element.value);
			});
		}


		setElementValue(value);


		return function(){
			remove();
		}
	}

});