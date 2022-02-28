var flour = flour || {};


/*
|
|
|	Flour HTTP name space
|
|	options: default fetch/http options used on all created http resources but can be overridden
|
|
*/
flour.http = 
{
	options: 
	{
		responseType: 'json'
	}
};



flour.http.prePostDataHandler = function(data, options)
{
	var contentType = options.headers && options.headers['Content-Type'] !== undefined ? options.headers['Content-Type'] : false;


	// Stringify application json
	if(contentType === 'application/json')
	{
		return JSON.stringify(data);
	}

	
	// Default to form data
	var myFormData = new FormData()
	for(var key in data)
	{
		myFormData.append(key, data[key]);
	}

	return myFormData;
};



flour.http.responseHandler = function(data, options)
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
	// Normalise options with base options
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
	options.responseType = options.responseType !== undefined ? options.responseType.toLowerCase() : undefined;

	
	// Define the callable response function
	return function(data, extra)
	{
		var parsedURL = flour.http.parseURL(url, data);
		extra = extra === undefined ? {} : extra;

		console.log('options', options);

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
				options.body = flour.http.prePostDataHandler(data, options);
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


			// If using callbacks :: TODO - Move these into the response handler so can be customised??
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