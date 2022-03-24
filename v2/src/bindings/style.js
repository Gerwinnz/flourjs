
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
				var value = state.get(stateKey);

				if(value)
				{
					element.style[property] = value;
				}

				mCleanups.push(state.onChange(stateKey, function(event)
				{
					if(event.value)
					{
						element.style[property] = event.value;
					}
				}));

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
