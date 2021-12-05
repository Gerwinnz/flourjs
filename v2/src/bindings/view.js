

flour.binding.add('f-view', 
{

	attach: function(element, state, view)
	{
		var viewName = element.getAttribute('f-view');
		
		element.innerHTML = 'view: ' + viewName;	
	}

});

