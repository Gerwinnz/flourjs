var flour = flour || {};




/*
|
|
|
|
|
*/
flour.state = function(defaultValues)
{
	var mValues = defaultValues ? defaultValues : {};
	var mChangeListeners = {};
	var mManagedArrays = {};
	var mId = 0;

	var mChangeTypes = {
		'update': 'update',
		'insertItem': 'insertItem',
		'removeItem': 'removeItem',
		'updateItem': 'updateItem'
	};




	/*
	|
	|
	|
	|
	|
	*/
	var managedArray = function(key, itemKey)
	{
		console.log('Creating managed array for: "' + key + '"');

		itemKey = itemKey ? itemKey : 'id';
		var items = get(key);
		var lookup = false;

		if(!flour.util.isArray(items))
		{
			flour.util.throw('Generating managed array failed as state value at "' + key + '" is not an array.');
			return;
		}



		onChange(key, function(event)
		{
			items = event.value;
			
			if(event.type === mChangeTypes.insertItem)
			{
				updateLookup();
			}

			if(event.type === mChangeTypes.removeItem)
			{
				updateLookup();
			}
		});
		



		var updateLookup = function()
		{
			var items = get(key);
			var newLookup = {};

			if(!flour.util.isArray(items))
			{
				return;
			}


			for(var i = 0, n = items.length; i < n; i ++)
			{
				newLookup[items[i][itemKey]] = i;
			}

			lookup = newLookup;
			console.log('lookup', lookup);
		};



		/*
		|
		|
		|	Return a specified item and include methods for removing and updating returned item
		|
		|   @itemId - the id of the item we want to return
		|
		|
		*/
		var getItem = function(itemId)
		{
			var itemIndex = lookup[itemId];
			var value = items[itemIndex];

			return {
				value: value,
				update: function(key, value)
				{
					updateItem(itemId, key, value);
				},
				remove: function()
				{
					removeItem(itemId);
				}
			};
		};



		/*
		|
		|
		|	Add an item to our array
		|
		|   @itemId - the id of the item we want to update
		|   @itemKey - the property key we wish to change
		|   @itemValue - the new value we wish to set
		|
		|
		*/
		var insertItem = function(newItem, newItemIndex)
		{
			var position = 0;
			var targetArray = get(key);
			if(!flour.util.isArray(targetArray))
			{
				flour.util.throw('Adding item failed as state value at "' + key + '" is not an array.');
				return;
			}


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
				type: mChangeTypes.insertItem,
				item: newItem,
				index: position
			};

			set(key, targetArray, eventDetails);
		};



		/*
		|
		|
		|	Remove an item from out array
		|
		|   @itemId - the id of the item we want to update
		|
		|
		*/
		var removeItem = function(itemId)
		{
			var targetArray = get(key);
			if(!flour.util.isArray(targetArray))
			{
				flour.util.throw('Adding item failed as state value at "' + key + '" is not an array.');
				return;
			}

			var index = lookup[itemId];
			var item = items[index];

			if(!item)
			{
				return;
			}


			// remove 
			targetArray.splice(index, 1);


			// create event details
			var eventDetails = {
				type: mChangeTypes.removeItem,
				item: item,
				index: index
			};

			set(key, targetArray, eventDetails);
		};



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
		var updateItem = function(itemId, itemKey, itemValue)
		{
			var targetArray = get(key);
			if(!flour.util.isArray(targetArray))
			{
				flour.util.throw('Adding item failed as state value at "' + key + '" is not an array.');
				return;
			}

			var index = lookup[itemId];
			var item = targetArray[index];

			if(!item)
			{
				return;
			}


			// update item value
			if(flour.util.isObject(item))
			{
				item[itemKey] = itemValue;
			}
			else
			{
				item = itemKey;
			}


			// create event details
			var eventDetails = {
				type: mChangeTypes.updateItem,
				item: item,
				index: index,
				itemKey: itemKey,
				itemValue: itemValue
			};

			set(key, targetArray, eventDetails);
		};



		/*
		|
		|
		|	Update all items in our array
		|
		|   @newItems - our new set of items we want to compare to our current set
		|
		|
		*/
		var updateItems = function(newItems)
		{
			var newItemsLookup = {};
			var itemsToUpdate = [];
			var itemsToRemove = [];
			var itemsToAdd = [];


			// create local lookup of new items and items we need to add
			for(var i = 0, n = newItems.length; i < n; i ++)
			{
				newItemsLookup[newItems[i].id] = i;

				if(lookup[newItems[i].id] === undefined)
				{
					itemsToAdd.push({
						index: i,
						value: newItems[i]
					});
				}
				else
				{
					itemsToUpdate.push({
						index: i,
						value: newItems[i]
					});
				}
			}


			// find items to remove first
			for(var i = 0, n = items.length; i < n; i ++)
			{
				if(newItemsLookup[items[i].id] === undefined)
				{
					itemsToRemove.push(items[i].id);
				}
			}

			console.log('--- Comparing arrays ---')
			
			console.log('Add: ', itemsToAdd);
			console.log('Remove: ', itemsToRemove);
			console.log('Update: ', itemsToUpdate);
			
			console.log('------------------------');
		};


		updateLookup();


		return {
			items: items,
			lookup: lookup,

			getItem: getItem,
			insertItem: insertItem,
			removeItem: removeItem,

			updateItem: updateItem,
			updateItems: updateItems
		};
	};




	/*
	|
	|
	|	Return the value held by the specified key
	|
	|   @key - string - name of stored value to be returned, can be 'foo.bar'
	|	
	|
	*/
	var get = function(key)
	{
		var value = getValue(mValues, key);

		if(flour.util.isArray(value))
		{
			value = JSON.parse(JSON.stringify(value));
		}
		else if(flour.util.isObject(value))
		{
			value = JSON.parse(JSON.stringify(value));
		}

		return value;
	};

	function getValue(obj, key)
	{
	    key = (typeof key === "string") ? key.split(".") : key;

	    const currentKey = key.shift();
	    if (obj.hasOwnProperty(currentKey) && key.length === 0)
	    {
	        return obj[currentKey];
	    }
	    else if (!obj.hasOwnProperty(currentKey))
	    {
	        return undefined;
	    }
	    else
	    {
	        return getValue(obj[currentKey], key);
	    }
	}




	/*
	|
	|
	|	Store the value passed in at the location specified by the key
	|
	|   @key - string - name of stored value to be returned, can be 'foo.bar'
	|   @value - anything - the value to be stored in the key's location
	|	
	|
	*/
	var set = function(key, value, changeEvent)
	{
		var changedKey = false;
		var changeEvent = changeEvent ? changeEvent : {type: mChangeTypes.update};
		
		if(changeEvent.type === mChangeTypes.update && flour.util.isArray(value))
		{
			if(flour.util.isArray(get(key)) && mManagedArrays[key])
	    	{
	    		mManagedArrays[key].updateItems(value);
	    		return;
	    	}
		}

		var setResponse = setValue(mValues, key, value);
		if(setResponse.changes)
		{
			console.log('changed ' + key + ' to', value);

			for(var i = 0, n = setResponse.changes.length; i < n; i ++)
			{
				changedKey = changedKey === false ? setResponse.changes[i] : changedKey + '.' + setResponse.changes[i];
				if(mChangeListeners[changedKey])
				{
					changeEvent.key = changedKey;
					changeEvent.value = get(changedKey);
					callChangeListeners(changedKey, changeEvent);
				}
			}
		}
	}

	function setValue(obj, key, value, changes)
	{
		key = (typeof key === "string") ? key.split(".") : key;
		if(changes === undefined)
		{
			changes = [];
		}

	    var currentKey = key.shift();
	    var valueChanged = false;
	    changes.push(currentKey);

	    if (key.length === 0)
	    {
	    	valueChanged = obj[currentKey] !== value;
	        obj[currentKey] = value;
	        return {
	        	value: value,
	        	changes: valueChanged ? changes : false
	        };
	    }
	    else if (!obj.hasOwnProperty(currentKey))
	    {
	        obj[currentKey] = {};
	    }

	    return(setValue(obj[currentKey], key, value, changes));
	}


	
	/*
	|
	|
	|	Get an item from an array 
	|
	|   @key - string - name of the array we wish to get our item from
	|   @id - string || int - id of the item we wish to retrieve
	|	
	|
	*/
	var getItem = function(key, id)
	{
		if(!mManagedArrays[key])
		{
			mManagedArrays[key] = managedArray(key);
		}

		return mManagedArrays[key].getItem(id);
	};



	/*
	|
	|
	|	Add item to an array stored at the specified key
	|
	|   @key - string - name of the array we wish to add to
	|   @newItem - anything - what ever we are adding to the array
	|   @newItemIndex - int - position where we want to add the new item to the array
	|	
	|
	*/
	var insertItem = function(key, newItem, newItemIndex)
	{
		if(!mManagedArrays[key])
		{
			mManagedArrays[key] = managedArray(key);
		}

		return mManagedArrays[key].insertItem(newItem, newItemIndex);
	};



	var removeItem = function(key, id)
	{
		if(!mManagedArrays[key])
		{
			mManagedArrays[key] = managedArray(key);
		}

		return mManagedArrays[key].removeItem(id);
	};



	




	/*
	|
	|
	|	Add a change listener to fire when the specified key has changed
	|
	|   @key - string - name of stored value to fire on when a change occurs 'foo.bar'
	|   @callback - function - function to call 
	|	
	|
	*/
	var onChange = function(key, callback)
	{
		var id = mId;
		mId ++;

		if(mChangeListeners[key] === undefined)
		{
			mChangeListeners[key] = [];
		}

		var length = mChangeListeners[key].push(
		{
			id: id,
			calls: 0,
			callback: callback
		});

		return function(){
			for(var i = 0, n = mChangeListeners[key].length; i < n; i ++)
			{
				if(mChangeListeners[key][i].id === id)
				{
					mChangeListeners[key].splice(i,1);
					i --;
					n --;
				}
			}
		};
	};



	/*
	|
	|
	|	Call all the change listeners stored against a key
	|
	|   @key - string - name of stored value callbacks are stored which need to be called
	|	
	|
	*/
	function callChangeListeners(key, event)
	{
		for(var i = 0, n = mChangeListeners[key].length; i < n; i ++)
		{
			if(mChangeListeners[key][i])
			{
				mChangeListeners[key][i].callback(event);
				mChangeListeners[key][i].calls ++;
			}
		}
	};




	/*
	|
	|
	|	Our factory function return object
	|	
	|
	*/
	return {
		get: get,
		set: set,

		getItem: getItem,
		insertItem: insertItem,
		removeItem: removeItem,

		values: mValues,
		onChange: onChange
	};
};