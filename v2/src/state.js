var flour = flour || {};




/*
|
|
|
|
|
*/
flour.state = function(name)
{
	var values = {};
	var changeListeners = {};




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
		return getValue(values, key);
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
		var changedKey = false;
		var setResponse = setValue(values, key, value);

		if(setResponse.changes)
		{
			for(var i = 0, n = setResponse.changes.length; i < n; i ++)
			{
				changedKey = changedKey === false ? setResponse.changes[i] : changedKey + '.' + setResponse.changes[i];
				if(changeListeners[changedKey])
				{
					callChangeListeners(changedKey);
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
	|	Add a change listener to fire when the specified key has changed
	|
	|   @key - string - name of stored value to fire on when a change occurs 'foo.bar'
	|   @callback - function - function to call 
	|	
	|
	*/
	var onChange = function(key, callback)
	{
		if(changeListeners[key] === undefined)
		{
			changeListeners[key] = [];
		}

		changeListeners[key].push(callback);
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
	function callChangeListeners(key)
	{
		var value = get(key);
		for(var i = 0, n = changeListeners[key].length; i < n; i ++)
		{
			changeListeners[key][i](value);
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
		values: values,
		onChange: onChange
	};
};