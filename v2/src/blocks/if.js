

flour.block.add('if', function(block, state, view)
{
	var mKey = block.key;
	var mBlockHtml = block.html;
	var mValue = state.get(mKey);
	var mTemplate = false;


	/*
	|
	|	Sub to change events 
	|
	*/
	var cleanup = state.onChange(mKey, function(event)
	{
		mValue = event.value;
		showContent();
	});

	var showContent = function()
	{
		if(mValue)
		{
			mTemplate = flour.template.parse(mBlockHtml, state, view);
			block.display(mTemplate.fragment);
		}
		else
		{
			mTemplate.cleanup();
			mTemplate = false;
			block.display(false);
		}
	};

	showContent();

	return cleanup;
});

