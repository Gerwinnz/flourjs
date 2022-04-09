
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


		/*
		|
		|	Sub to change events 
		|
		*/
		var listener = state.onExpressionChange(mKey, function(value)
		{
			showContent(value);
		});

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


		// initial setup
		showContent(listener.value);


		// cleanup
		return listener.remove;
	}

});

