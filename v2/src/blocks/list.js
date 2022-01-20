

flour.block.add('list', function(block, state, view)
{
	var mKey = block.key;
	var mBlockHtml = block.html;
	
	var mItems = [];
	var mLookup = {};

	var getItem = function(id)
	{
		return mItems[mLookup[id]];
	}


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
		var item = {
			id: itemId,
			el: itemTemplate.fragment.firstElementChild,
			state: itemState
		};

		if(index === undefined)
		{
			mItems.push(item);
		}
		else
		{
			mItems.splice(index, 0, item);
		}

		for(var i = 0, n = mItems.length; i < n; i ++)
		{
			mLookup[mItems[i].id] = i;
		}


		itemState.onChange(function(event)
		{
			state.getItem(mKey, itemId).update(event.key, event.value);
		});


		if(mItems.length === 1)
		{
			block.display(mItems[0].el);
		}
		else
		{
			if(index < mItems.length - 1)
			{
				var itemAhead = mItems[index + 1].el;
				itemAhead.parentNode.insertBefore(itemTemplate.fragment, itemAhead);
			}
			else
			{
				var endItem = mItems[mItems.length - 2].el;
				endItem.after(itemTemplate.fragment);
			}
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
		var item = getItem(event.item.id);

		if(item)
		{
			item.el.remove();
			mItems.splice(event.index, 1);
			
			mLookup[item.id] = null;
			for(var i = 0, n = mItems.length; i < n; i ++)
			{
				mLookup[mItems[i].id] = i;
			}
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
		var item = getItem(event.item.id);

		if(item)
		{
			for(var i = 0, n = event.keys.length; i < n; i ++)
			{
				item.state.set(event.keys[i], event.values[i]);
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
		var item = getItem(event.item.id);
		var newIndex = event.index;
		var currentIndex = event.oldIndex;

		if(item)
		{
			if(newIndex < event.value.length - 1)
			{
				var itemAheadIndex = mLookup[event.value[newIndex + 1].id];
				var itemAhead = mItems[itemAheadIndex].el;
				itemAhead.parentNode.insertBefore(item.el, itemAhead);
			}
			else
			{
				var endItem = mItems[mItems.length - 1].el;
				endItem.parentNode.append(item.el);
			}


			mItems.splice(newIndex, 0, mItems.splice(currentIndex, 1)[0]);
			for(var i = 0, n = mItems.length; i < n; i ++)
			{
				mLookup[mItems[i].id] = i;
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
		// clear existing
		for(var i = 0, n = mItems.length; i < n; i ++)
		{
			mItems[i].el.remove();
		}

		mItems.length = 0;


		// display items in state
		var items = state.get(mKey);
		items.forEach((item) => 
		{
			insertItem(item);
		});
	}


	
	renderListItems();

	return cleanup;
});

