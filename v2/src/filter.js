var flour = flour || {};




/*
|
|
|
|
|
*/
flour.filter = 
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
flour.filter.add = function(filterName, filterFunction)
{
	if(!flour.filter.defined[filterName])
	{
		flour.filter.defined[filterName] = filterFunction;
	}	
};