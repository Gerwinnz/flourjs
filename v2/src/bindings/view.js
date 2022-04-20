

flour.binding.add('f-view', 
{

	attach: function(element, state, view)
	{
		var mView = element.getAttribute('f-view');
		
		if(view.embeddedViews[mView])
		{
			element.append(view.embeddedViews[mView].el);
		}

		view.on('embeddedViewUpdate', function(viewName)
		{
			if(viewName === mView)
			{
				element.append(view.embeddedViews[mView].el);
			}
		})
	}

});

