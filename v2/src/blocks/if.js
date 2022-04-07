

flour.block.add('if', function(block, state, view)
{
	var mKey = block.key;
	var mBlockHtml = block.html;
	var mShow = false;
	var mTemplate = false;





	/*
	|
	|	Sub to change events 
	|
	*/
	var expression = state.onExpressionChange(mKey, function(value)
	{
		showContent(value);
	});


	var showContent = function(newValue)
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

	showContent(expression.value);

	return expression.cleanup;
});

