
/*
|
|	Stores reference to element in the view's ref name space with the passed in name
|
*/
flour.binding.add('f-ref', 
{

	attach: function(element, state, view)
	{
		var mRefName = element.getAttribute('f-ref');
		
		if(view.refs === undefined)
		{
			view.refs = {};
		}

		view.refs[mRefName] = element;
	}

});

