var flour = flour || {};




flour.util = {
	logSteps: 0
};



/*
|
|	Throws a flour console error
|
*/
flour.util.throw = function(error)
{
	throw 'Flour error: ' + error;
};




/*
|
|	Throws a flour console error
|
*/
flour.util.log = function()
{
	var args = Array.prototype.slice.call(arguments);
	
	if(flour.util.logSteps > 0)
	{
		var step = '- - -';
		var steps = '';
		for(var i = 0, n = flour.util.logSteps; i < n; i ++)
		{
			steps = steps + ' ' + step;
		}

		args.unshift(steps);
	}

	console.log.apply(console, args);
};

flour.util.logStepIn = function()
{
	flour.util.logSteps ++;
};

flour.util.logStepOut = function()
{
	flour.util.logSteps --;
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



