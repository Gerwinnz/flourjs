
/*
|
|	Stores reference to element in the view's el name space with the passed in name
|
*/
flour.binding.add('f-name', 
{

	attach: function(element, state, view)
	{
		var mElementName = element.getAttribute('f-name');
		
		view.elements[mElementName] = element;
	}

});

