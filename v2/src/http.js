var flour = flour || {};


/*
|
|
|	Default http options
|
|
*/
flour.http = 
{
	options: 
	{
		
	}
};



flour.http.preFetchDataHandler = function(data)
{
	return data;
};



flour.http.postFetchResponseHandler = function(data)
{
	return data;
};


flour.http.parseURL = function(url, data)
{
	if(data !== undefined)
    {
		for(var key in data)
		{
			if(url.indexOf(':' + key) !== -1)
			{
				var replaceString = ':' + key;
				url = url.replace(replaceString, data[key]);
				delete(data[key]);
			}
		}
    }

    return url;
};


/*
|
|	Creates and returns a callable function which performs a fetch and returns the response promise for a simple
|	and clean api. This way the user only needs to use one .then()
|
*/
flour.http.get = function(url, optionOverrides)
{
	return flour.http.add(url, 'GET', optionOverrides);
}

flour.http.put = function(url, optionOverrides)
{
	return flour.http.add(url, 'PUT', optionOverrides);
}

flour.http.post = function(url, optionOverrides)
{
	return flour.http.add(url, 'POST', optionOverrides);
}

flour.http.delete = function(url, optionOverrides)
{
	return flour.http.add(url, 'DELETE', optionOverrides);
}

flour.http.add = function(url, method, optionOverrides)
{
	var options = JSON.parse(JSON.stringify(flour.http.options));
	if(flour.util.isObject(optionOverrides))
	{
		for(var key in optionOverrides)
		{
			options[key] = optionOverrides[key];
		}
	}

	method = method === undefined ? 'GET' : method.toUpperCase();
	options.method = method;

		
	return function(data, extra)
	{
		var parsedURL = flour.http.parseURL(url, data);

		if(data !== undefined)
		{
			options.body = flour.http.preFetchDataHandler(data);
		}

		return response = fetch(parsedURL, options).then(function(response)
		{
			if(options.responseType === 'array_buffer')
			{
				return response.arrayBuffer();
			}
			else if(options.responseType === 'blob')
			{
				return response.blob();
			}
			else if(options.responseType === 'form_data')
			{
				return response.formData();
			}
			else if(options.responseType === 'json')
			{
				return response.json();
			}

			return response.text();
		});
	}
};