

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

	var getPieceDetails = function(piece)
	{
		var firstChar = piece[0];
		var lastChar = piece[piece.length - 1];
		var type = 'var';
		var value = piece;

		if((firstChar === "'" && lastChar === "'") || (firstChar === '"' && lastChar === '"'))
		{
			type = 'string';
			value = piece.substr(1, piece.length - 2);
		}
		else if(!isNaN(parseFloat(piece)))
		{
			type = 'number';
			value = piece;
		}

		return {
			type: type,
			value: value
		}
	}

	var expressionPieces = mKey.split(' ');
	if(expressionPieces.length === 3)
	{
		console.log('we have a comparison expression');

		var firstItem = getPieceDetails(expressionPieces[0]);
		var comparison = expressionPieces[1];
		var lastItem = getPieceDetails(expressionPieces[2]);

		console.log(firstItem);
		console.log(comparison);
		console.log(lastItem);
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

