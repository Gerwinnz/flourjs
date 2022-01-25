
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
		var mInverse = false;

		if(mKey[0] === '!')
		{
			mInverse = true;
			mKey = mKey.substring(1);
		}

		var mValue = state.get(mKey);
		var mDisplayDefault = element.style.display;


		/*
		|
		|	Sub to change events 
		|
		*/
		var cleanup = state.onChange(mKey, function(event)
		{
			mValue = event.value;
			showContent();
		});

		var showContent = function()
		{
			var show = mValue ? true : false;
			show = mInverse ? !show : show;

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
		showContent();


		// cleanup
		return cleanup;
	}

});

