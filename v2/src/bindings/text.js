
/*
|
|	Sets inner text to the state value
|
*/
flour.binding.add('f-text', 
{

	attach: function(element, state, view)
	{
		var mValue = element.getAttribute('f-text');
		var mParts = mValue.split('|');
		var mKey = mParts[0].trim();
		var mFilter = false;

		if(mParts[1])
		{
			var filterName = mParts[1].trim();
			if(flour.filter.defined[filterName])
			{
				mFilter = flour.filter.defined[filterName];
			}
		}


		// display methods
		var displayText = function(value)
		{
			element.innerText = value;
		};

		var displayTextWithFilter = function(value)
		{
			element.innerText = mFilter(value);
		};


		// initial setup
		if(mFilter === false)
		{
			var listener = state.onChange(mKey, function(event)
			{
				displayText(event.value);
			});

			displayText(listener.value || '');
		}
		else
		{
			var listener = state.onChange(mKey, function(event)
			{
				displayTextWithFilter(event.value);
			});

			displayTextWithFilter(listener.value || '');
		}


		// cleanup
		return listener.remove
	}

});

