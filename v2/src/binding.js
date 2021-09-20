var flour = flour || {};




/*
|
|
|
|
|
*/
flour.binding = 
{
	defined: {}
};




/*
|
|
|
|
|
*/
flour.binding.add = function(bindingName, options)
{
	if(!flour.binding.defined[bindingName])
	{
		flour.binding.defined[bindingName] = options;
	}	
};




/*
|
|
|
|
|
*/
flour.binding.bindView = function(view)
{

};