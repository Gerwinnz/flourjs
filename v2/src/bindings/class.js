
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
		var mClassNames = [];
	

		// apply classNames
		var applyClassNames = function()
		{
			for(var i = 0, n = mClassNames.length; i < n; i ++)
			{
				if(mClassNames[i].className)
				{
					if(mClassNames[i].value)
					{
						element.classList.add(mClassNames[i].className);
					}
				}
				else
				{
					element.classList.add(mClassNames[i].value);
				}
			}
		};


		// initial setup
		for(var i = 0, n = mClasses.length; i < n; i ++)
		{
			(function(classString){

				var parts = classString.split(' ');
				var stateKey = parts[0];

				if(parts.length > 1)
				{
				  stateKey = parts.slice(0, parts.length - 1).join(' ')
				}

				var info = {
					className: (parts.length > 1 ? parts.pop() : false)
				};

				var listener = state.onExpressionChange(stateKey, function(value)
				{
					element.classList.remove(info.className ? info.className : info.value);
					info.value = value;
					applyClassNames();
				});
				

				info.value = listener.value;

				mClassNames.push(info);
				mCleanups.push(listener.remove);

			}(mClasses[i]));
		};

		applyClassNames();
		

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

