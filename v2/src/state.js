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
	var changed = [];

	var set = function(key, value)
	{
		var changedKey = false;
		changed.length = 0;	
		setValue(values, key, value);

		// TODO: set value should return true or false if there was a change and then we determine if we need to fire callbacks?
		// TODO: should we have to get the values to call the callbacks? can this be more efficient?

		for(var i = 0, n = changed.length; i < n; i ++)
		{
			changedKey = changedKey === false ? changed[i] : changedKey + '.' + changed[i];
			if(changeListeners[changedKey])
			{
				console.log('call back for: ' + changedKey);
				changeListeners[changedKey](get(changedKey));
			}
		}
	}

	function setValue(obj, key, value)
	{
	    key = (typeof key === "string") ? key.split(".") : key;
	    var currentKey = key.shift();
	    changed.push(currentKey);

	    if (key.length === 0)
	    {
	        obj[currentKey] = value;
	        return;
	    }
	    else if (!obj.hasOwnProperty(currentKey))
	    {
	        obj[currentKey] = {};
	    }

	    setValue(obj[currentKey], key, value);
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
		changeListeners[key] = callback;
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