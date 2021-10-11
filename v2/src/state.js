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
	var mId = 0;




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
		return getValue(mValues, key);
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
	var set = function(key, value)
	{
		var changeType = 'change';
		var changedKey = false;
		var setResponse = setValue(mValues, key, value);

		if(setResponse.changes)
		{
			for(var i = 0, n = setResponse.changes.length; i < n; i ++)
			{
				changedKey = changedKey === false ? setResponse.changes[i] : changedKey + '.' + setResponse.changes[i];
				if(mChangeListeners[changedKey])
				{
					callChangeListeners(changedKey, changeType);
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



	var addItem = function(listKey, newItem, newItemIndex)
	{
		var targetArray = get(listKey);

		if(!flour.util.isArray(targetArray))
		{
			flour.util.throw('List must be an array');
		}
	};



	var updateItem = function(listKey, id, key, value)
	{

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
	function callChangeListeners(key, eventType)
	{
		var value = get(key);
		var event = {
			value: value,
			type: eventType
		};

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

		addItem: addItem,
		updateItem: updateItem,

		values: mValues,
		onChange: onChange
	};
};