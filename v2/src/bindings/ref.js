

flour.binding.add('f-ref', 
{

	attach: function(element, state, view)
	{
		var ref = element.getAttribute('f-ref');
		
		if(view.refs === undefined)
		{
			view.refs = {};
		}

		view.refs[ref] = element;
	}

});

