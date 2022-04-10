
/*
|
|	Sets inner text to the state value
|
*/
flour.binding.add('f-style', 
{

	attach: function(element, state, view)
	{
		var mKey = element.getAttribute('f-style');
		var mStyles = mKey.split(',');
		var mCleanups = [];
	

		// initial setup
		for(var i = 0, n = mStyles.length; i < n; i ++)
		{
			(function(styleOption){

				var parts = styleOption.trim().split(' ');
				var property = parts[0].trim();
				var stateKey = parts[1].trim();

				var listener = state.onChange(stateKey, function(event)
				{
					if(event.value)
					{
						element.style[property] = event.value;
					}
				});

				if(listener.value)
				{
					element.style[property] = listener.value;
				}

				mCleanups.push(listener.remove);

			}(mStyles[i]));
		};
		

		// cleanup
		return function()
		{
			for(var i = 0, n = mCleanups.length; i < n; i ++)
			{
				mCleanups[i]();
			}
		};
	}

});

