
/*
|
|	Sets inner text to the state value
|
*/
flour.binding.add('f-class', 
{

	attach: function(element, state, view)
	{
		var mKey = element.getAttribute('f-class');
		var mClasses = mKey.split(',');
		var mCleanups = [];
	

		for(var i = 0, n = mClasses.length; i < n; i ++)
		{
			(function(classString){

				var parts = classString.split(' ');
				var stateKey = parts[0];
				var className = parts[1] === undefined ? false : parts[1];

				if(className)
				{
					console.log('conditional class name', element);
				}
				else
				{
					console.log('string class name', element);
				}

			}(mClasses[i]));
		};

		return;


		mCleanups.push(state.onChange(mKey, function(event)
		{
			
		}));


		// initial setup
		


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

