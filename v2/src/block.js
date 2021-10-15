var flour = flour || {};




/*
|
|
|
|
|
*/
flour.block = 
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
flour.block.add = function(blockName, options)
{
	if(!flour.block.defined[blockName])
	{
		flour.block.defined[blockName] = options;
	}	
};