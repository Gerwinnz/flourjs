
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
		function applyClassNames()
		{
			for(var i = 0, n = mClassNames.length; i < n; i ++)
			{
				const classNameToAdd = mClassNames[i].className ? mClassNames[i].className : mClassNames[i].value;
				
				if(mClassNames[i].value)
				{
					element.classList.add(classNameToAdd);
				}
			}
		};


		// initial setup
		for(let classString of mClasses)
		{
			let parts = classString.split(' ');
			let stateKey = parts[0];
			let info = {}


			if(parts.length > 1)
			{
			  stateKey = parts.slice(0, parts.length - 1).join(' ')
			  info.className = parts.pop();
			}


			let listener = state.onExpressionChange(stateKey, function(value)
			{
				element.classList.remove(info.className ? info.className : info.value);
				info.value = value;
				applyClassNames();
			});
			

			info.value = listener.value;

			mClassNames.push(info);
			mCleanups.push(listener.remove);
		};


		// init
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

