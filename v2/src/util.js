var flour = flour || {};




flour.util = {
	id: 0,
};



/*
|
|
|
*/
flour.util.generateId = function()
{
	flour.util.id ++;
	return flour.util.id;
};



/*
|
|	Throws a flour console error
|
*/
flour.util.throw = function(error)
{
	console.error.apply(this, arguments);
};

flour.util.warn = function(error)
{
	console.warn.apply(this, arguments);
};




/* 
|
|	Event delegation method
|
*/
flour.util.delegateEvent = function(el, eventType, selector, handler, useCapture)
{
    if(typeof useCapture === 'undefined') 
    {
        useCapture = false;
    }

    el.addEventListener(eventType, function(event) 
    {
    	event.preventDefault();

        var t = event.target;
        while (t && t !== this) 
        {
            if (t.matches(selector)) 
            {
                handler(t, event);
                break;
            }

            t = t.parentNode;
        }
    }, useCapture);
};



/*
|
|	Defer
|
*/
flour.util.defer = function(callback)
{
	setTimeout(function()
	{
		callback();
	}, 0);
};





/*
|
|	Returns true if passed param is an object, else false
|
*/
flour.util.isObject = function(obj)
{
	return (typeof obj == "object") && (obj !== null);
};



/*
|
|	Returns true if passed param is an array, else false
|
*/
flour.util.isArray = function(arr)
{
	return Array.isArray(arr);
};




/*
|
|	Returns true if passed param is an object, else false
|
*/
flour.util.isFunction = function(func) 
{
 	return typeof func === 'function';
};



/*
|
|	Returns true is passed param is a string, else false
|
*/
flour.util.isString = function(str)
{
	return (typeof str == 'string' || str instanceof String);
};



