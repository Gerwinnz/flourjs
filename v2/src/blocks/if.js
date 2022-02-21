

flour.block.add('if', function(block, state, view)
{
	var mKey = block.key;
	var mInverse = false;

	if(mKey[0] === '!')
	{
		mInverse = true;
		mKey = mKey.substring(1);
	}

	var mBlockHtml = block.html;
	var mValue = state.get(mKey);
	var mShow = false;
	var mTemplate = false;

	console.log(mKey);


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
		var show = mValue ? true : false;
		show = mInverse ? !show : show;
		
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

	showContent();

	return cleanup;
});

