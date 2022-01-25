

flour.binding.add('f-view', 
{

	attach: function(element, state, view)
	{
		var mView = element.getAttribute('f-view');
		
		element.innerHTML = 'view: ' + mView;	
	}

});

