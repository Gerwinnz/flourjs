

flour.block.add('list', function(block, state, view)
{
	var mKey = block.key;
	var mListEl = block.el.parentElement;
	var mBlockHtml = block.html;
	
	var mListItems = {};
	var mState = state.get(mKey);

	block.el.remove();


	/*
	|
	|	Sub to change events 
	|
	*/
	var cleanup = state.onChange(mKey, function(event)
	{
		if(event.type === 'insertItem')
		{
			handleInsertItem(event);
		}

		if(event.type === 'removeItem')
		{
			handleRemoveItem(event);
		}

		if(event.type === 'updateItem')
		{
			handleUpdateItem(event);
		}

		if(event.type === 'moveItem')
		{
			handleMoveItem(event);
		}

		mState = event.value;

		if(event.type === 'update')
		{
			renderListItems();
		}
	});





	/*
	|
	|	Insert item handler
	|
	|	@event - changeEvent - event details containing the item and its index
	|
	*/
	var handleInsertItem = function(event)
	{
		insertItem(event.item, event.index);
	};

	var insertItem = function(item, index)
	{
		var itemId = item.id;
		var itemState = flour.state(item);
		var itemTemplate = flour.template.parse(mBlockHtml, itemState, view);

		mListItems[item.id] = {
			el: itemTemplate.fragment.firstElementChild,
			state: itemState
		};

		itemState.onChange(function(event)
		{
			state.getItem(mKey, itemId).update(event.key, event.value);
		});

		if(event.index === 0)
		{
			mListEl.prepend(itemTemplate.fragment);
		}
		else if(event.index <= mState.length - 1)
		{
			mListEl.insertBefore(itemTemplate.fragment, mListItems[mState[event.index].id].el);
		}
		else
		{
			mListEl.append(itemTemplate.fragment);
		}
	}



	/*
	|
	|	Remove item handler
	|
	|	@event - changeEvent - event details containing the item to be removed
	|
	*/
	var handleRemoveItem = function(event)
	{
		var itemId = event.item.id;
		if(mListItems[itemId])
		{
			mListItems[itemId].el.remove();
			mListItems[itemId] = null;
		}
	};



	/*
	|
	|	Update item handler
	|
	|	@event - changeEvent - event details containing the item and the keys + values that were changed
	|
	*/
	var handleUpdateItem = function(event)
	{
		var itemId = event.item.id;
		if(mListItems[itemId])
		{
			for(var i = 0, n = event.keys.length; i < n; i ++)
			{
				mListItems[itemId].state.set(event.keys[i], event.values[i]);
			}
		}
	};



	/*
	|
	|	Move item handler
	|
	|	@event - changeEvent - event details containing the item and its new index
	|
	*/
	var handleMoveItem = function(event)
	{
		var itemId = event.item.id;
		if(mListItems[itemId])
		{
			if(event.index === 0)
			{
				mListEl.prepend(mListItems[itemId].el);
			}
			else if(event.index < event.value.length - 1)
			{
				mListEl.insertBefore(mListItems[itemId].el, mListItems[event.value[event.index + 1].id].el);
			}
			else
			{
				mListEl.append(mListItems[itemId].el);
			}
		}
	};





	/*
	|
	|	Basic render
	|
	*/
	var renderListItems = function()
	{
		mListItems = {};
		mListEl.innerHTML = '';

		mState.forEach((item) => 
		{
			insertItem(item);
		});
	}


	if(mState && mState.length > 0)
	{
		renderListItems();
	}


	return cleanup;
});

