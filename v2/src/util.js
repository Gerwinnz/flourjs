var flour = flour || {};




flour.util = {};



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
	console.log.apply(console, arguments);
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



