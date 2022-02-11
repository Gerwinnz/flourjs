var flour = flour || {};


flour.http = {};


/*
|
|
|
|
|
*/
flour.http.setOptions = function(options)
{

};




flour.http.add = async function(url, method, options)
{
	return function(data)
	{
		var options = {};
		var response = await fetch(url, {});

		return response.json();
		console.log(url, data);
	}
};