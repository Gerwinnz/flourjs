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
|	Shortcut methods for common http verbs
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


/*
|
|	Creates and returns a callable function which performs a fetch and returns the response promise for a simple
|	and clean api. This way the user only needs to use one .then()
|
*/
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
		extra = extra === undefined ? {} : extra;

		// Add data to our request
		if(data !== undefined)
		{
			if(method === 'GET')
			{
				var urlParams = [];

				if(parsedURL.indexOf('?') === -1)
				{
					parsedURL += '?';
				}

				for(var key in data)
				{
					urlParams.push(key + '=' + data[key]);
				}

				parsedURL += urlParams.join('&');
			}
			else
			{
				options.body = flour.http.preFetchDataHandler(data);
			}
		}


		// Perform fetch and return promise
		return response = fetch(parsedURL, options).then(function(response)
		{
			var returnValue = false;

			// Handle a failed fetch
			if(!response.ok)
			{
				if(flour.util.isFunction(extra.error))
				{
					extra.error(response);
				}
				else
				{
					throw response;
				}

				return;
			}


			// Format the response
			if(options.responseType === 'array_buffer')
			{
				returnValue = response.arrayBuffer();
			}
			else if(options.responseType === 'blob')
			{
				returnValue = response.blob();
			}
			else if(options.responseType === 'form_data')
			{
				returnValue = response.formData();
			}
			else if(options.responseType === 'json')
			{
				returnValue = response.json();
			}
			else
			{
				returnValue = response.text();
			}


			// If using callbacks
			if(flour.util.isFunction(extra.success))
			{
				returnValue.then(function(output)
				{
					extra.success(output);	
				});
			}

			if(flour.util.isFunction(extra.done))
			{
				returnValue.then(function(output)
				{
					extra.done(output);	
				});
			}


			// Return promise
			return returnValue;
		});
	}
};