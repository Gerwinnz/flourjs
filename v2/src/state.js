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
		'add': 'add',
		'remove': 'remove',
		'update': 'update'
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
			console.log('managed array src event: "' + event.type + '"');
			
			if(event.type === 'add')
			{
				updateLookup();
			}

			if(event.type === 'remove')
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
		};



		var getItem = function(itemUniqueKey)
		{
			return items[lookup[itemUniqueKey]];
		};



		var addItem = function(newItem, newItemIndex)
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
				type: mChangeTypes.add,
				item: newItem,
				index: position
			};

			set(key, targetArray, eventDetails);
		};



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
				type: mChangeTypes.remove,
				item: item,
				index: index
			};

			set(key, targetArray, eventDetails);
		};



		var updateItem = function(itemId, itemKey, itemValue)
		{
			console.log('update item at ' + itemId + ' with ' + itemKey + ' to ' + itemValue);

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
				type: mChangeTypes.update,
				item: item,
				index: index,
				key: itemKey,
				value: itemValue
			};

			set(key, targetArray, eventDetails);
		};



		var updateItems = function()
		{

		};


		updateLookup();


		return {
			items: items,
			lookup: lookup,

			getItem: getItem,
			addItem: addItem,
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
		var changeEvent = changeEvent ? changeEvent : {type: mChangeTypes.change};
		var setResponse = setValue(mValues, key, value);

		if(setResponse.changes)
		{
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
	var addItem = function(key, newItem, newItemIndex)
	{
		if(!mManagedArrays[key])
		{
			mManagedArrays[key] = managedArray(key);
		}

		return mManagedArrays[key].addItem(newItem, newItemIndex);

		// var position = 0;
		// var targetArray = get(key);
		// if(!flour.util.isArray(targetArray))
		// {
		// 	flour.util.throw('Adding item failed as state value at "' + key + '" is not an array.');
		// 	return;
		// }


		// // insert at specified position or at end by default
		// if(newItemIndex !== undefined)
		// {
		// 	if(newItemIndex < 0)
		// 	{
		// 		targetArray.unshift(newItem);
		// 		position = 0;
		// 	}
		// 	else if(newItemIndex > (targetArray.length - 1))
		// 	{
		// 		targetArray.push(newItem);
		// 		position = targetArray.length - 1;
		// 	}
		// 	else
		// 	{	
		// 		targetArray.splice(newItemIndex, 0, newItem);
		// 		position = newItemIndex;
		// 	}
		// }
		// else
		// {
		// 	targetArray.push(newItem);
		// 	position = targetArray.length - 1;
		// }


		// // create event details
		// var eventDetails = {
		// 	type: mChangeTypes.add,
		// 	item: newItem,
		// 	position: position
		// };

		// set(key, targetArray, eventDetails);
	};



	var removeItem = function(key, id)
	{
		if(!mManagedArrays[key])
		{
			mManagedArrays[key] = managedArray(key);
		}

		return mManagedArrays[key].removeItem(id);
	};



	var updateItem = function(key, id, itemKey, itemValue)
	{
		if(!mManagedArrays[key])
		{
			mManagedArrays[key] = managedArray(key);
		}

		return mManagedArrays[key].updateItem(id, itemKey, itemValue);
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
		console.log('State event: ' + event.key + '.' + event.type);

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
		addItem: addItem,
		removeItem: removeItem,
		updateItem: updateItem,

		values: mValues,
		onChange: onChange
	};
};