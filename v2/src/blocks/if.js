

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
		var isVarRegEx = new RegExp(/[a-zA-Z.]{1,}/);

		var details = {
			value: piece
		};

		if((firstChar === "'" && lastChar === "'") || (firstChar === '"' && lastChar === '"'))
		{
			details.type = 'string';
			details.value = piece.substr(1, piece.length - 2);
		}
		else if(!isNaN(parseFloat(piece)))
		{
			details.type = 'number';
			details.value = parseFloat(piece);
		}
		else if(isVarRegEx.test(piece))
		{
			details.type = 'var';
			details.name = piece;
			details.value = state.get(piece);
		}

		return details;
	}

	var expressionPieces = mKey.split(' ');
	if(expressionPieces.length > 1)
	{
		var vars = [];
		var mFunc = false;

		for(var i = 0, n = expressionPieces.length; i < n; i ++)
		{
			(function(piece){
				var pieceDetails = getPieceDetails(piece);
				if(pieceDetails.type === 'var')
				{
					vars.push(pieceDetails.name);
				}
			}(expressionPieces[i]));
		}
		
		mKey = vars.join(',');
		mFunc = new Function(mKey, 'return ' + expressionPieces.join(' ') + ';');

		evaluate = function()
		{
			var params = [];
			for(var i = 0, n = vars.length; i < n; i ++)
			{
				params.push(state.get(vars[i]));
			}

			return mFunc.apply(this, params);
		};
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
	console.log('IF onchange for: ' + mKey);
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

