

flour.binding.add('flour-ref', 
{

	attach: function(element, state, view)
	{
		var ref = element.getAttribute('flour-ref');
		
		if(view.refs === undefined)
		{
			view.refs = {};
		}

		view.refs[ref] = element;
	}

});

