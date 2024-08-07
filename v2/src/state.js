var flour = flour || {};

flour.state_expressions = new Map();


/*
|
|
|
|
|
*/
flour.state = function(defaultValues, options)
{
	var mStateInstanceId = flour.util.generateId();
	var mValues = defaultValues ? structuredClone(defaultValues) : {};
	var mKeyChangeListeners = {};
	var mAllChangeListeners = [];
	var mManagedArrays = {};
	

	var mChangeTypes = {
		'update': 'update',
		'updatedItems': 'updatedItems'
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
	function get(key)
	{
		//console.log('state::get', key);
		var value = getValue(mValues, key);

		if(flour.util.isArray(value) || flour.util.isObject(value))
		{
			value = structuredClone(value);
		}

		return value;
	}

	function getValue(obj, key)
	{
	    key = (typeof key === "string") ? key.split(".") : key;

	    if(!obj)
	    {
	    	return undefined
	    }

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
	function set(key, value, changeEvent)
	{
		var changedKey = false;
		var changeEvent = changeEvent ? changeEvent : {type: mChangeTypes.update};


		// handle updating a managed array
		if(changeEvent.type === mChangeTypes.update && flour.util.isArray(value))
		{
			if(flour.util.isArray(get(key)))
	    	{
	    		// If not managed, try to create it
	    		if(mManagedArrays[key] === undefined || mManagedArrays[key] === false)
				{
					mManagedArrays[key] = flour.manageArray(instance, key);
				}

				// If created and is valid, call it
				if(mManagedArrays[key])
				{
					mManagedArrays[key].updateItems(value);
	    			return;
				}
	    	}
		}


		var setResponse = setValue(mValues, key, value);
		if(setResponse.changeList.length)
		{
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
	function getItem(key, id)
	{
		if(!mManagedArrays[key])
		{
			mManagedArrays[key] = flour.manageArray(instance, key);
		}

		return mManagedArrays[key].getItem(id);
	}



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
	function insertItem(key, newItem, newItemIndex)
	{
		if(!mManagedArrays[key])
		{
			mManagedArrays[key] = flour.manageArray(instance, key);
		}

		return mManagedArrays[key].insertItem(newItem, newItemIndex);
	}



	function insertItems(key, newItems, newItemsIndex)
	{
		if(!mManagedArrays[key])
		{
			mManagedArrays[key] = flour.manageArray(instance, key);
		}

		return mManagedArrays[key].insertItems(newItems, newItemsIndex);
	}



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
	function removeItem(key, id)
	{
		if(!mManagedArrays[key])
		{
			mManagedArrays[key] = flour.manageArray(instance, key);
		}

		return mManagedArrays[key].removeItem(id);
	}



	




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
	function onChange(key, callback, options)
	{
		var id = flour.util.generateId();
		options = options || {};


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
				var listenerDetails = {
					id: id,
					calls: 0,
					callback: callback
				};

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


				// Sometimes such as for internal use, we may want to make sure a callback
				// is always called first, in this case we move the listener to the front
				// of the array
				if(options.priority === true)
				{
					mKeyChangeListeners[key].unshift(listenerDetails);
				}
				else
				{
					mKeyChangeListeners[key].push(listenerDetails);
				}

				if(options.immediate === true)
				{
					callback({type: 'update', key: key, value: keyValue});
				}


				// Return a cleanup
				return function()
				{
					for(var i = 0, n = mKeyChangeListeners[key].length; i < n; i ++)
					{
						if(mKeyChangeListeners[key][i].id === id)
						{
							mKeyChangeListeners[key].splice(i, 1);
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
	}



	/*
	|
	|
	|
	*/
	function onExpressionChange(expression, callback)
	{
		var expressionFunction = false;
		var expressionVariables = [];
		var expressionVariablesJoined = '';

		var regEx;
		var variableName;

		if(flour.state_expressions.has(expression))
		{
			const expressionDetails = flour.state_expressions.get(expression);
			
			expressionFunction = expressionDetails.function;
			expressionVariables = expressionDetails.variables;
			expressionVariablesJoined = expressionDetails.variables_joined;
		}
		else
		{
			regEx = new RegExp(/[a-zA-Z\._]{1,}/, 'g');
			
			// remove strings
			var strippedExpression = expression.replace(/(["'])(?:(?=(\\?))\2.)*?\1/g, '');
			
			// find variable names
			while((variableName = regEx.exec(strippedExpression)) !== null)
			{
				expressionVariables.push(variableName[0].split('.')[0]);
			}

			// create our expression function
			expressionVariablesJoined = expressionVariables.join(',');
			expressionFunction = new Function(expressionVariablesJoined, 'return ' + expression + ';');

			flour.state_expressions.set(expression, 
			{
				function: expressionFunction,
				variables: expressionVariables,
				variables_joined: expressionVariablesJoined
			});
		}
		

		//
		function getExpressionResult()
		{
			var params = [];
			for(const variableName of expressionVariables)
			{
				params.push(get(variableName));
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
		for(const listener of mKeyChangeListeners[key])
		{
			if(listener)
			{
				listener.callback(structuredClone(event));
				listener.calls ++;
			}
		}
	}

	function callAllChangeListeners(event)
	{
		for(const listener of mAllChangeListeners)
		{
			if(listener)
			{
				listener.callback(structuredClone(event));
				listener.calls ++;
			}
		}
	}







	/*
	|
	|
	|	Our factory function return object
	|	
	|
	*/
	var instance = {
		id: mStateInstanceId,
		get: get,
		set: set,

		getItem: getItem,
		insertItem: insertItem,
		insertItems: insertItems,
		removeItem: removeItem,

		values: mValues,
		onChange: onChange,
		onExpressionChange: onExpressionChange
	};

	return instance;
};