
/*
|
|	Calls the named function if it exists passing in the element reference
|
*/
flour.binding.add('f-ref', 
{

	attach: function(element, state, view)
	{
		var mFunctionName = element.getAttribute('f-ref');
		
		if(flour.util.isFunction(view[mFunctionName]))
		{
			view[mFunctionName](element);
		}
	}

});

