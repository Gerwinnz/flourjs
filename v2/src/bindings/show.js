
/*
|
|	Basic show/hide if value is truthy
|
*/
flour.binding.add('f-show', 
{

	attach: function(element, state, view)
	{
		var mKey = element.getAttribute('f-show');
		var mValue = state.get(mKey);
		var mDisplayDefault = element.style.display;


		// Show hide content
		var showContent = function(newValue)
		{
			var show = newValue ? true : false;

			if(!show)
			{
				element.style.display = 'none';
			}
			else
			{
				element.style.display = mDisplayDefault;
			}
		}


		// Subscribe to expression
		var listener = state.onExpressionChange(mKey, function(value)
		{
			showContent(value);
		});


		// Set initial state
		showContent(listener.value);
		return listener.remove;
	}

});

