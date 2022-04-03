

flour.block.add('if', function(block, state, view)
{
	var mKey = block.key;
	var mInverse = false;

	if(mKey[0] === '!')
	{
		mInverse = true;
		mKey = mKey.substring(1);
	}

	var evaluate = function(val)
	{
		return !!val;
	}

	var expressionPieces = mKey.split(' ');
	if(expressionPieces.length > 1)
	{
		console.log('we have an expression');

		for(var i = 0, n  = expressionPieces.length; i < n; i ++)
		{
			(function(piece){
				var type = 'var';
				var firstChar = piece[0];
				var lastChar = piece[piece.length - 1];

				if((firstChar === "'" && lastChar === "'") || (firstChar === '"' && lastChar === '"'))
				{
					type = 'string';
				}
				else if(!isNaN(parseFloat(piece)))
				{
					type = 'number';
				}

				console.log(piece + ' is ' + type);
			}(expressionPieces[i]))
		}
	}

	var mBlockHtml = block.html;
	var mValue = evaluate(state.get(mKey));
	var mShow = false;
	var mTemplate = false;





	/*
	|
	|	Sub to change events 
	|
	*/
	var cleanup = state.onChange(mKey, function(event)
	{
		mValue = evaluate(event.value);
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

