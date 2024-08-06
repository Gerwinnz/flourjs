var flour = flour || {};

/*
|
|
|	Managed array - factory that returns a handleful of methods for updating arrays in our state
|
|	@state - the state instance we are getting our data from and updating to
|   @key - string - the key of the array we wish to manage in our state
|   @itemKey - string - the unique identifier we use to identify items inside of each array - defaults to 'id'
|
|
*/
flour.manageArray = function(state, key, itemKey)
{
	itemKey = itemKey ? itemKey : 'id';

	var mItems = state.get(key);
	var mLookup = false;
	var mItemChangeListeners = {};
	
	var listenerOptions = {
		priority: true
	};

	var mChangeTypes = {
		'update': 'update',
		'updatedItems': 'updatedItems'
	};


	if(!flour.util.isArray(mItems))
	{
		flour.util.throw('Generating managed array failed as state value at "' + key + '" is not an array.');
		return;
	}


	console.log('MANAGE ARRAY', key, mItems);


	/*
	|
	|	Update our lookup anytime an our array items are updated
	|
	*/
	state.onChange(key, function(event)
	{
		if(event.type === mChangeTypes.updatedItems)
		{
			mItems = event.value;
			updateLookup();
		}
	}, listenerOptions);
	


	/*
	|
	|	Update lookup function
	|
	*/
	function updateLookup()
	{
		var items = state.get(key);
		var newLookup = {};
		var isValid = true;

		if(!flour.util.isArray(items))
		{
			return;
		}

		for(var i = 0, n = items.length; i < n; i ++)
		{
			if(!items[i][itemKey])
			{
				isValid = false;
			}
			newLookup[items[i][itemKey]] = i;
		}

		// console.log('updating lookup::' + key, items);

		mLookup = newLookup;
		return isValid;
	}



	/*
	|
	|
	|	Return a specified item and include methods for removing and updating returned item
	|
	|   @itemId - the id of the item we want to return
	|
	|
	*/
	function getItem(itemId)
	{
		const itemIndex = mLookup[itemId];
		if(itemIndex === undefined)
		{
			return false;
		}

		const value = structuredClone(mItems[itemIndex]);

		return {
			value: value,
			index: itemIndex,
			move: function(newIndex)
			{
				moveItem(itemId, newIndex);
			},
			update: function(keys, values)
			{
				updateItem(itemId, keys, values);
			},
			remove: function()
			{
				removeItem(itemId);
			},
			onChange: function(callback)
			{
				const listenerId = addItemChangeListener(itemId, callback);

				return {
					mItemChangeListeners: mItemChangeListeners,
					remove: function(){
						removeItemChangeListener(itemId, listenerId)
					}
				};
			}
		};
	}

	function callItemChangeListeners(eventDetails)
	{
		const changes = eventDetails.changes;

		for(const key in changes)
		{
			for(let change of changes[key])
			{
				const itemId = change.item[itemKey];
				change.type = key;

				if(mItemChangeListeners[itemId])
				{
					for(const listener of mItemChangeListeners[itemId])
					{
						listener.calls ++;
						listener.callback(change);
					}
				}		
			}
		}
	}

	function addItemChangeListener(itemId, callback)
	{
		const id = flour.util.generateId();

		if(mItemChangeListeners[itemId] === undefined)
		{
			mItemChangeListeners[itemId] = [];
		}

		mItemChangeListeners[itemId].push(
		{
			id: id,
			calls: 0,
			callback: callback
		});

		return id;
	}

	function removeItemChangeListener(itemId, listenerId)
	{
		for(var i = 0, n = mItemChangeListeners[itemId].length; i < n; i ++)
		{
			if(mItemChangeListeners[itemId][i].id === listenerId)
			{
				mItemChangeListeners[itemId].splice(i, 1);
				break;
			}
		}
	}



	/*
	|
	|
	|	Add an item to our array
	|
	|   @newItem - the object we wish to insert
	|   @newItemIndex - the index we wish to insert the new object
	|
	|
	*/
	function insertItem(newItem, newItemIndex)
	{
		var position = 0;
		var targetArray = state.get(key);


		// Checks
		if(!flour.util.isArray(targetArray))
		{
			flour.util.throw('Adding item failed as state value at "' + key + '" is not an array.');
			return;
		}

		if(mLookup[newItem[itemKey]] !== undefined)
		{
			flour.util.throw('Adding item already exists');
			return;
		}


		// Clone
		newItem = structuredClone(newItem);


		// insert at specified position or at end by default
		if(newItemIndex !== undefined)
		{
			if(newItemIndex < 0)
			{
				targetArray.unshift(newItem);
				position = 0;
			}
			else if(newItemIndex > (targetArray.length - 1))
			{
				targetArray.push(newItem);
				position = targetArray.length - 1;
			}
			else
			{	
				targetArray.splice(newItemIndex, 0, newItem);
				position = newItemIndex;
			}
		}
		else
		{
			targetArray.push(newItem);
			position = targetArray.length - 1;
		}


		// create event details
		var eventDetails = {
			type: mChangeTypes.updatedItems,
			changes: {
				remove: [],
				add: [{
					item: newItem,
					index: position
				}],
				move: [],
				update: []
			}
		};

		state.set(key, targetArray, eventDetails);
	}


	function insertItems(newItems, newItemsIndex)
	{
		var addedItems = [];
		var position = 0;
		var targetArray = state.get(key);

		if(!flour.util.isArray(targetArray))
		{
			flour.util.throw('Adding items failed as state value at "' + key + '" is not an array.');
			return;
		}


		// Clone
		newItems = structuredClone(newItems);

		
		// insert at specified position or at end by default
		if(newItemsIndex !== undefined)
		{
			position = newItemsIndex;
			targetArray.splice.apply(targetArray, [newItemsIndex, 0].concat(newItems));
		}
		else
		{
			position = targetArray.length === 0 ? 0 : targetArray.length;
			targetArray = targetArray.concat(newItems);
		}

		for(var i = 0, n = newItems.length; i < n; i ++)
		{
			addedItems.push({
				item: newItems[i],
				index: (position + i)
			});
		}

		// create event details
		var eventDetails = {
			type: mChangeTypes.updatedItems,
			changes: {
				remove: [],
				add: addedItems,
				move: [],
				update: []
			}
		};

		state.set(key, targetArray, eventDetails);
	}



	/*
	|
	|
	|	Move an item to a new index
	|
	|	@itemId - the id of the item we want to move
	| 	@newIndex - the new index we want to move the item to
	|
	|
	|
	*/
	function moveItem(itemId, newIndex)
	{
		var targetArray = state.get(key);
		if(!flour.util.isArray(targetArray))
		{
			flour.util.throw('Removing item failed as state value at "' + key + '" is not an array.');
			return;
		}

		var index = mLookup[itemId];
		var item = mItems[index];

		if(!item)
		{
			return;
		}

		if(newIndex < 0)
		{
			newIndex = 0;
		}

		if(newIndex > mItems.length - 1)
		{
			newIndex = mItems.length - 1;
		}

		if(newIndex === index)
		{
			return;
		}


		// shift position in our array
		targetArray.splice(newIndex, 0, targetArray.splice(index, 1)[0]);


		// create event details
		var eventDetails = {
			type: mChangeTypes.updatedItems,
			changes: {
				remove: [],
				add: [],
				move: [{
					item: item,
					index: newIndex,
					oldIndex: index
				}],
				update: []
			}
		};

		state.set(key, targetArray, eventDetails);
		callItemChangeListeners(eventDetails);
	}



	/*
	|
	|
	|	Remove an item from out array
	|
	|   @itemId - the id of the item we want to update
	|
	|
	*/
	function removeItem(itemId)
	{
		var targetArray = state.get(key);
		if(!flour.util.isArray(targetArray))
		{
			flour.util.throw('Removing item failed as state value at "' + key + '" is not an array.');
			return;
		}

		var index = mLookup[itemId];
		var item = mItems[index];

		if(!item)
		{
			return;
		}


		// remove 
		targetArray.splice(index, 1);


		// create event details
		var eventDetails = {
			type: mChangeTypes.updatedItems,
			changes: {
				remove: [{
					item: item,
					index: index
				}],
				add: [],
				move: [],
				update: []
			}
		};

		state.set(key, targetArray, eventDetails);
		callItemChangeListeners(eventDetails);
	}



	/*
	|
	|
	|	Update a property with the passed in new value on an item in our array
	|
	|   @itemId - the id of the item we want to update
	|   @itemKey - the property key we wish to change
	|   @itemValue - the new value we wish to set
	|
	|
	*/
	function updateItem(itemId, keys, values)
	{
		var targetArray = state.get(key);
		if(!flour.util.isArray(targetArray))
		{
			flour.util.throw('Updating item failed as state value at "' + key + '" is not an array.');
			return;
		}

		var index = mLookup[itemId];
		var item = targetArray[index];
		if(!item){ return; }

		var updatedKeys = [];
		var updatedKeyValues = [];

		if(flour.util.isObject(keys))
		{
			for(var itemKey in keys)
			{
				var updated = updateItemValue(item, itemKey, keys[itemKey]);
				if(updated !== null)
				{
					item = updated.item;
					updatedKeys.push(updated.key);
					updatedKeyValues.push(updated.value);
				}
			}
		}
		else
		{
			var updated = updateItemValue(item, keys, values);
			if(updated !== null)
			{
				item = updated.item;
				updatedKeys.push(updated.key);
				updatedKeyValues.push(updated.value);
			}
		}

		if(updatedKeys.length > 0)
		{
			var eventDetails = {
				type: mChangeTypes.updatedItems,
				changes: {
					remove: [],
					add: [],
					move: [],
					update: [{
						item: item,
						index: index,
						keys: updatedKeys, 
						values: updatedKeyValues
					}]
				}
			};

			state.set(key, targetArray, eventDetails);
			callItemChangeListeners(eventDetails);
		}
	}

	function updateItemValue(item, itemKey, itemValue)
	{
		// update item value
		if(flour.util.isObject(item))
		{
			var currentValue = item[itemKey];

			if(flour.util.isObject(item[itemKey]) || flour.util.isArray(item[itemKey]))
			{
				if(JSON.stringify(item[itemKey]) === JSON.stringify(itemValue))
				{
					return null;
				}
			}

			if(currentValue === itemValue){ 
				return null;
			}
			
			item[itemKey] = itemValue;
		}
		else
		{
			if(item === itemKey)
			{
				return null;
			}

			item = itemKey;
		}

		return {
			item: item,
			key: itemKey,
			value: itemValue
		};
	}



	/*
	|
	|
	|	Update all items in our array
	|
	|   @newItems - our new set of items we want to compare to our current set
	|
	|
	*/
	function updateItems(newItems)
	{
		var newItemsLookup = {};
		var removeChanges = [];
		var addChanges = [];
		var moveChanges = [];
		var updateChanges = [];

		// Clone
		newItems = structuredClone(newItems);


		// ADD AND UPDATE
		for(var i = 0, n = newItems.length; i < n; i ++)
		{
			var newItem = newItems[i];
			newItemsLookup[newItem.id] = i;

			if(mLookup[newItem.id] === undefined)
			{
				// ADD
				addChanges.push({
					item: newItem,
					index: i
				});
			}
			else
			{
				// UPDATE
				var itemDiffs = flour.util.diff(mItems[mLookup[newItem.id]], newItem, {shallow: true});
				if(itemDiffs.length)
				{	
					var keys = [];
					var values = [];

					for(itemDiff of itemDiffs)
					{
						keys.push(itemDiff.path.join('.'));
						values.push(itemDiff.value);
					}

					updateChanges.push({
						item: newItem,
						index: i,
						keys: keys, 
						values: values
					});
				}

				// MOVE 
				var currentIndex = mLookup[newItem[itemKey]];
				if(currentIndex !== i)
				{
					moveChanges.push({
						item: newItem,
						index: i,
						oldIndex: currentIndex
					});
				}
			}
		}


		// REMOVE
		for(existingItem of mItems)
		{
			if(newItemsLookup[existingItem.id] === undefined)
			{
				removeChanges.push({
					item: existingItem,
					index: mLookup[existingItem[itemKey]]
				});
			}
		}


		if(removeChanges.length + addChanges.length + moveChanges.length + updateChanges.length)
		{
			var eventDetails = {
				type: mChangeTypes.updatedItems,
				changes: {
					remove: removeChanges,
					add: addChanges,
					move: moveChanges,
					update: updateChanges
				}
			};

			state.set(key, newItems, eventDetails);
			callItemChangeListeners(eventDetails);
		}
	}

	if(updateLookup())
	{

		return {
			items: mItems,
			lookup: mLookup,

			getItem: getItem,
			insertItem: insertItem,
			insertItems: insertItems,
			removeItem: removeItem,

			updateItem: updateItem,
			updateItems: updateItems
		};
	}
	else
	{
		return false;
	}
};