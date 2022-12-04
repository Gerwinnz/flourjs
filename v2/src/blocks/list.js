

flour.block.add('list', function(block, state, view)
{
	var mKey = block.key;
	var mBlockHtml = block.html;
	
	var mItems = [];
	var mLookup = {};
	var mIsUpdating = false;


	/*
	|
	|	Helpers for managing the list of items
	|
	*/
	var getItem = function(id)
	{
		return mItems[mLookup[id]];
	}

	var updateLookup = function()
	{
		for(var i = 0, n = mItems.length; i < n; i ++)
		{
			mLookup[mItems[i].id] = i;
		}
	}


	/*
	|
	|	Sub to change events 
	|
	*/
	var listener = state.onChange(mKey, function(event)
	{
		if(event.type === 'updatedItems')
		{
			mIsUpdating = true;
			
			removeItems(event.changes.remove);
			
			for(addChange of event.changes.add)
			{
				handleInsertItem(addChange);
			}

			for(moveChange of event.changes.move)
			{
				handleMoveItem(moveChange, event.value);
			}

			for(updateChange of event.changes.update)
			{
				handleUpdateItem(updateChange);
			}

			mIsUpdating = false;
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
	function handleInsertItem(event)
	{
		insertItem(event.item, event.index);
	}

	function insertItem(item, index)
	{
		var itemId = item.id;
		var itemState = flour.state(item);
		var itemTemplate = flour.template.parse(mBlockHtml, itemState, view);
		var item = {
			id: itemId,
			el: itemTemplate.fragment.firstElementChild,
			state: itemState
		};

		itemState.onChange(function(event)
		{
			if(mIsUpdating === false)
			{
				let item = state.getItem(mKey, itemId);
				item.update(event.key, event.value);
			}
		});


		if(index === undefined)
		{
			mItems.push(item);
		}
		else
		{
			mItems.splice(index, 0, item);
		}

		updateLookup();

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
	|	Remove items handler
	|
	|	@removeChanges - array of remove changes that happened to this state array
	|
	*/
	function removeItems(removeChanges)
	{
		var indexesToRemove = [];

		for(var itemToRemove of removeChanges)
		{
			var item = itemToRemove.item;
			var currentIndex = mLookup[item.id];
			var listItem = mItems[currentIndex];

			listItem.el.remove();
			mItems.splice(currentIndex, 1);
			updateLookup();
		}
	}



	/*
	|
	|	Update item handler
	|
	|	@event - changeEvent - event details containing the item and the keys + values that were changed
	|
	*/
	function handleUpdateItem(event)
	{
		var item = getItem(event.item.id);
		if(item)
		{
			for(var i = 0, n = event.keys.length; i < n; i ++)
			{
				item.state.set(event.keys[i], event.values[i]);
			}
		}
		
	}



	/*
	|
	|	Move item handler
	|
	|	@event - changeEvent - event details containing the item and its new index
	|
	*/
	function handleMoveItem(event, newItems)
	{
		var item = getItem(event.item.id);
		var newIndex = event.index;
		var currentIndex = mLookup[item.id];

		if(newIndex === currentIndex)
		{
			return;
		}

		if(item)
		{
			if(newIndex < newItems.length - 1)
			{
				var itemAheadIndex = mLookup[newItems[newIndex + 1].id];
				var itemAhead = mItems[itemAheadIndex].el;
				itemAhead.parentNode.insertBefore(item.el, itemAhead);
			}
			else
			{
				var endItem = mItems[mItems.length - 1].el;
				endItem.parentNode.append(item.el);
			}

			if(mItems.length > 1)
			{
				mItems.splice(newIndex, 0, mItems.splice(currentIndex, 1)[0]);	
			}
			
			updateLookup();
		}
	}





	/*
	|
	|	Basic render
	|
	*/
	function renderListItems()
	{
		// clear existing
		for(var i = 0, n = mItems.length; i < n; i ++)
		{
			mItems[i].el.remove();
		}

		mItems.length = 0;


		// display items in state
		var items = state.get(mKey);
		if(items)
		{
			items.forEach((item) => 
			{
				insertItem(item);
			});
		}
	}


	
	renderListItems();

	return listener.remove;
});

