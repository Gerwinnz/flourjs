
/*
|
|	Two way binding between the state and the elements value
|   
|   State values should be formatted for the appropriate input as such
|	 - input:type=text,password,number,email etc - string
|	 - input:type=radio - string
|    - input:type=checkbox - array or bool
|	 - select - string matching option value
|
|
*/
flour.binding.add('f-value', 
{

	attach: function(element, state, view)
	{
		var mKey = element.getAttribute('f-value');
		var mType = element.type ? element.type.toLowerCase() : 'text';
		var mValue = state.get(mKey);
		var mElementValue = element.getAttribute('value');

		if(mValue === undefined)
		{
			mValue = '';
		}



		//
		// Function to Set the element's value depending on the element type and input type
		//
		function setElementValue(val)
		{
			if(mType === 'radio')
			{
				element.checked = mElementValue === val;
				return;
			}
			
			if(mType === 'checkbox')
			{
				if(flour.util.isArray(val))
				{
					element.checked = val.includes(mElementValue);
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
		var cleanup = state.onChange(mKey, function(event)
		{
			setElementValue(event.value);
		});




		//		
		// Attach appropriate change/input listeners on our element so we can update the state
		//
		if(mType === 'radio')
		{
			element.addEventListener('change', function()
			{
				state.set(mKey, mElementValue);
			});
		}
		else if(mType === 'checkbox')
		{
			if(flour.util.isArray(mValue))
			{
				element.addEventListener('change', function()
				{
					var checkedItems = state.get(mKey);
					var itemPosition = checkedItems.indexOf(mElementValue);
					
					if(element.checked)
					{
						if(itemPosition === -1)
						{
							checkedItems.push(mElementValue);
						}
					}
					else
					{
						if(itemPosition !== -1)
						{
							checkedItems.splice(itemPosition, 1);
						}
					}

					state.set(mKey, checkedItems);
				});
			}
			else
			{
				element.addEventListener('change', function()
				{
					state.set(mKey, element.checked ? true : false);
				});
			}
		}
		else
		{
			element.addEventListener('input', function()
			{
				state.set(mKey, element.value);
			});
		}


		// initial setup
		setElementValue(mValue);
		flour.util.defer(function()
		{
			setElementValue(mValue);
		});
		

		// cleanup
		return cleanup;
	}

});