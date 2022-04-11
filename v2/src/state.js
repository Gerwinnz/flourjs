var flour = flour || {};

flour.stateId = 0;


/*
|
|
|
|
|
*/
flour.state = function(defaultValues)
{
	var mValues = defaultValues ? JSON.parse(JSON.stringify(defaultValues)) : {};
	var mKeyChangeListeners = {};
	var mAllChangeListeners = [];
	var mManagedArrays = {};

	var mChangeTypes = {
		'update': 'update',
		'insertItem': 'insertItem',
		'insertItems': 'insertItems',
		'removeItem': 'removeItem',
		'updateItem': 'updateItem',
		'moveItem': 'moveItem'
	};




	/*
	|
	|
	|	Managed array - factory that returns a handleful of methods for updating arrays in our state
	|
	|   @key - string - the key of the array we wish to manage in our state
	|   @itemKey - string - the unique identifier we use to identify items inside of each array - defaults to 'id'
	|
	|
	*/
	var managedArray = function(key, itemKey)
	{
		itemKey = itemKey ? itemKey : 'id';

		var mItems = get(key);
		var mLookup = false;


		if(!flour.util.isArray(mItems))
		{
			flour.util.throw('Generating managed array failed as state value at "' + key + '" is not an array.');
			return;
		}



		/*
		|
		|	Update our lookup anytime an item is added, removed or moved
		|
		*/
		onChange(key, function(event)
		{
			mItems = event.value;
			
			if(event.type === mChangeTypes.insertItem)
			{
				updateLookup();
			}

			if(event.type === mChangeTypes.insertItems)
			{
				updateLookup();
			}

			if(event.type === mChangeTypes.removeItem)
			{
				updateLookup();
			}

			if(event.type === mChangeTypes.moveItem)
			{
				updateLookup();
			}
		});
		


		/*
		|
		|	Update lookup function
		|
		*/
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

			mLookup = newLookup;
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
			var itemIndex = mLookup[itemId];
			if(itemIndex === undefined)
			{
				return false;
			}
			var value = mItems[itemIndex];

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
				}
			};
		};



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
		var insertItem = function(newItem, newItemIndex)
		{
			var position = 0;
			var targetArray = get(key);
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


		var insertItems = function(newItems, newItemsIndex)
		{
			var addedItems = [];
			var position = 0;
			var targetArray = get(key);


			if(!flour.util.isArray(targetArray))
			{
				flour.util.throw('Adding items failed as state value at "' + key + '" is not an array.');
				return;
			}

			
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
					index: (position + i),
					item: newItems[i]
				});
			}

			// create event details
			var eventDetails = {
				type: mChangeTypes.insertItems,
				items: addedItems
			};

			set(key, targetArray, eventDetails);
		};



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
		var moveItem = function(itemId, newIndex)
		{
			var targetArray = get(key);
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
				type: mChangeTypes.moveItem,
				item: item,
				index: newIndex,
				oldIndex: index
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
		var updateItem = function(itemId, keys, values)
		{
			var targetArray = get(key);
			if(!flour.util.isArray(targetArray))
			{
				flour.util.throw('Updating item failed as state value at "' + key + '" is not an array.');
				return;
			}

			console.log('update item');

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
				console.log('managed_array::update_item', updatedKeys, updatedKeyValues);

				var eventDetails = {
					type: mChangeTypes.updateItem,
					item: item,
					index: index,
					keys: updatedKeys,
					values: updatedKeyValues
				};

				set(key, targetArray, eventDetails);
			}
		}

		var updateItemValue = function(item, itemKey, itemValue)
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

			var insertCluster = [];
			var insertClusterIndex = false;


			// create new items mLookup and check for items to add or update
			for(var i = 0, n = newItems.length; i < n; i ++)
			{
				newItemsLookup[newItems[i].id] = i;

				if(mLookup[newItems[i].id] === undefined)
				{
					itemsToAdd.push({
						index: i,
						value: newItems[i]
					});
				}
				else
				{
					if(JSON.stringify(newItems[i]) !== JSON.stringify(mItems[mLookup[newItems[i].id]]))
					{
						itemsToUpdate.push({
							index: i,
							value: newItems[i]
						});
					}
				}
			}


			// find items to remove first
			for(var i = 0, n = mItems.length; i < n; i ++)
			{
				if(newItemsLookup[mItems[i].id] === undefined)
				{
					itemsToRemove.push(mItems[i].id);
				}
			}

			for(var i = 0, n = itemsToRemove.length; i < n; i ++)
			{
				removeItem(itemsToRemove[i]);
			}


			// add new items in clusters where indexes are in sequence
			for(var i = 0, n = itemsToAdd.length; i < n; i ++)
			{
				if(insertClusterIndex === false)
				{
					insertClusterIndex = itemsToAdd[i].index;
				}

				insertCluster.push(itemsToAdd[i].value);

				if(itemsToAdd[i + 1] === undefined || itemsToAdd[i + 1].index !== itemsToAdd[i].index + 1)
				{
					insertItems(insertCluster, insertClusterIndex);
					insertCluster.length = 0;
					insertClusterIndex = false;
				}
			}


			// update and move items
			for(var i = 0, n = itemsToUpdate.length; i < n; i ++)
			{
				if(mLookup[itemsToUpdate[i].value[itemKey]] !== itemsToUpdate[i].index)
				{
					moveItem(itemsToUpdate[i].value[itemKey], itemsToUpdate[i].index);
				}

				updateItem(itemsToUpdate[i].value[itemKey], itemsToUpdate[i].value)
			}
		};


		updateLookup();


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
		// console.log('state::get', key);

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
	|   @value - any - the value to be stored in the key's location
	|	@changeEvent - object - the event data that will be passed to onChange callbacks for this key
	|	
	|
	*/
	var set = function(key, value, changeEvent)
	{
		var changedKey = false;
		var changeEvent = changeEvent ? changeEvent : {type: mChangeTypes.update};
		

		// handle updating a managed array
		if(changeEvent.type === mChangeTypes.update && flour.util.isArray(value))
		{
			if(flour.util.isArray(get(key)))
	    	{
	    		if(!mManagedArrays[key])
				{
					mManagedArrays[key] = managedArray(key);
				}

	    		mManagedArrays[key].updateItems(value);
	    		return;
	    	}
		}


		var setResponse = setValue(mValues, key, value);
		if(setResponse.changeList.length)
		{
			//console.log('state::set::' + changeEvent.type, key, value);

			for(var i = 0, n = setResponse.changeList.length; i < n; i ++)
			{
				changedKey = setResponse.changeList[i];

				if(mKeyChangeListeners[changedKey])
				{
					changeEvent.key = changedKey;
					changeEvent.value = get(changedKey);
					callKeyChangeListeners(changedKey, changeEvent);
				}

				if(mAllChangeListeners.length > 0)
				{
					changeEvent.key = changedKey;
					changeEvent.value = get(changedKey);
					callAllChangeListeners(changeEvent);
				}
			}
		}
	}

	function setValue(obj, key, value, changeList)
	{
		key = (typeof key === "string") ? key.split(".") : key;
		changeList = changeList === undefined ? [] : changeList;

	    var currentKey = key.shift();
	    var valueChanged = false;
	    
	    var changedKey = changeList.length > 0 ? changeList[changeList.length - 1] + '.' + currentKey : currentKey;
		changeList.push(changedKey);

	    if(key.length === 0)
	    {
	    	if(flour.util.isObject(value))
	    	{
	    		valueChanged = JSON.stringify(obj[currentKey]) !== JSON.stringify(value);
	    		changeList = changeList.concat(getChangeListFromObject(changedKey, value));
	    	}
	    	else
	    	{
	    		valueChanged = obj[currentKey] !== value;
	    	}

	        obj[currentKey] = value;
	        return {
	        	value: value,
	        	changeList: valueChanged ? changeList : false
	        };
	    }
	    else if (!obj.hasOwnProperty(currentKey))
	    {
	        obj[currentKey] = {};
	    }

	    return(setValue(obj[currentKey], key, value, changeList));
	}

	function getChangeListFromObject(rootKey, object)
	{
		var changeList = [];
		for(var objectKey in object)
		{
			if(mKeyChangeListeners[rootKey + '.' + objectKey] !== undefined)
			{
				changeList.push(rootKey + '.' + objectKey);
			}
			
			if(flour.util.isObject(object[objectKey]))
			{
				changeList = changeList.concat(getChangeListFromObject(rootKey + '.' + objectKey, object[objectKey], changeList));
			}
		}

		return changeList;
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
	|   @newItem - any - what ever we are adding to the array
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



	var insertItems = function(key, newItems, newItemsIndex)
	{
		if(!mManagedArrays[key])
		{
			mManagedArrays[key] = managedArray(key);
		}

		return mManagedArrays[key].insertItems(newItems, newItemsIndex);
	};



	/*
	|
	|
	|	Remove item to from an array with a specified id
	|
	|   @key - string - name of the array we wish to remove the item from
	|   @id - any - unique identifier of the item we wish to remove
	|	
	|
	*/
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
		var id = flour.util.generateId();


		// Add listener for all changes
		if(flour.util.isFunction(key))
		{
			mAllChangeListeners.push(
			{
				id: id,
				calls: 0,
				callback: key
			});

			return function()
			{
				for(var i = 0, n = mAllChangeListeners.length; i < n; i ++)
				{
					if(mAllChangeListeners[i].id === id)
					{
						mAllChangeListeners.splice(i,1);
						i --;
						n --;
					}
				}
			};
		}


		// Add listener for a specific change to a key value - supports comma delimmited keys
		var keys = key.split(',');
		var cleanups = [];
		var value = undefined;
		var values = {};

		for(var i = 0, n = keys.length; i < n; i ++)
		{
			cleanups.push((function(key)
			{
				var keyValue = undefined;
				key = key.trim();
				keyValue = get(key);

				if(i === 0)
				{
					value = keyValue;
				}

				values[key] = keyValue;

				if(mKeyChangeListeners[key] === undefined)
				{
					mKeyChangeListeners[key] = [];
				}

				var length = mKeyChangeListeners[key].push(
				{
					id: id,
					calls: 0,
					callback: callback
				});

				return function()
				{
					for(var i = 0, n = mKeyChangeListeners[key].length; i < n; i ++)
					{
						if(mKeyChangeListeners[key][i].id === id)
						{
							mKeyChangeListeners[key].splice(i,1);
							i --;
							n --;
						}
					}
				};

			}(keys[i])));
		}

		// return cleanup
		return {
			value: value,
			values: values,
			remove: function()
			{
				for(var i = 0, n = cleanups.length; i < n; i ++)
				{
					cleanups[i]();
				}
			}
		}
	};



	/*
	|
	|
	|
	*/
	var onExpressionChange = function(expression, callback)
	{
		var evalFunction = false;
		var expressionFunction = false;
		var expressionVariables = [];
		var expressionVariablesJoined = '';
		var regEx = new RegExp(/[a-zA-Z\._]{1,}/, 'g');
		var variableName;

		// remove strings
		var strippedExpression = expression.replace(/(["'])(?:(?=(\\?))\2.)*?\1/g, '');
		
		// find variable names
		while((variableName = regEx.exec(strippedExpression)) !== null)
		{
			expressionVariables.push(variableName[0]);
		}

		// create our expression function
		expressionVariablesJoined = expressionVariables.join(',');
		expressionFunction = new Function(expressionVariablesJoined, 'return ' + expression + ';');

		//
		var getExpressionResult = function()
		{
			var params = [];
			for(var i = 0, n = expressionVariables.length; i < n; i ++)
			{
				params.push(get(expressionVariables[i]));
			}

			return (expressionFunction.apply(this, params));
		}

		// sub to our state
		var listener = onChange(expressionVariablesJoined, function(event)
		{
			callback(getExpressionResult());
		});

		return {
			remove: listener.remove, 
			value: getExpressionResult()
		};
	}



	/*
	|
	|
	|	Call all the change listeners stored against a key
	|
	|   @key - string - name of stored value callbacks are stored which need to be called
	|	
	|
	*/
	function callKeyChangeListeners(key, event)
	{
		for(var i = 0, n = mKeyChangeListeners[key].length; i < n; i ++)
		{
			if(mKeyChangeListeners[key][i])
			{
				mKeyChangeListeners[key][i].callback(event);
				mKeyChangeListeners[key][i].calls ++;
			}
		}
	};

	function callAllChangeListeners(event)
	{
		for(var i = 0, n = mAllChangeListeners.length; i < n; i ++)
		{
			if(mAllChangeListeners[i])
			{
				mAllChangeListeners[i].callback(event);
				mAllChangeListeners[i].calls ++;
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
	flour.stateId ++;

	return {
		id: flour.stateId,
		get: get,
		set: set,

		getList: {},

		getItem: getItem,
		insertItem: insertItem,
		insertItems: insertItems,
		removeItem: removeItem,

		values: mValues,
		onChange: onChange,
		onExpressionChange: onExpressionChange
	};
};