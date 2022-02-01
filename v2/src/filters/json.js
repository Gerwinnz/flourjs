
/*
|
|	Simple json stringify filter
|
*/
flour.filter.add('json', function(data)
{
	return JSON.stringify(data, undefined, 2);
});

