

flour.block.add('if', function(block, state, view)
{
	var mKey = block.key;
	var mBlockHtml = block.html;
	var mShow = false;
	var mTemplate = false;


	// Show hide content
	function showContent(newValue)
	{
		var show = newValue ? true : false;
		
		if(show === mShow)
		{
			return;
		}

		mShow = show;

		if(show)
		{
			mTemplate = flour.template.parse(mBlockHtml, state, view);
			block.display(mTemplate.fragment);
		}
		else
		{
			if(mTemplate)
			{
				mTemplate.cleanup();
				mTemplate = false;
			}

			block.display(false);
		}
	};


	//Subscribe to expression
	var listener = state.onExpressionChange(mKey, function(value)
	{
		showContent(value);
	});


	// Set initial state
	showContent(listener.value);
	return listener.remove;
});

