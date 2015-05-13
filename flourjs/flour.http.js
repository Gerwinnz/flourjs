
var flour = flour || {};


/*
|
| Default request handler
|
*/
flour.requestHandler = function(response, status, options)
{
  if(options[status])
  {
    options[status](response);
  }
};




/*
|
| Ajax request wrapper method
|
*/
flour.request = {
  
  get: function(url, data, options)
  {
    this.doRequest(url, data, options, 'get');
  },

  put: function(url, data, options)
  {
    this.doRequest(url, data, options, 'put');
  },

  post: function(url, data, options)
  {
    this.doRequest(url, data, options, 'post');
  },

  delete: function(url, data, options)
  {
    this.doRequest(url, data, options, 'delete');
  },

  doRequest: function(url, data, options, method) 
  {
    if(options.silent !== true)
    {
      flour.publish('http-request:start');
    }


    $.ajax({
      url: url,
      type: method,
      data: data,

      success: function(response, status)
      {
        if(options.silent !== true)
        {
          flour.publish('http-request:end');
        }

        flour.requestHandler(response, status, options);
      }
    });
  }
};




/*
|
| HTTP class, returns a simple function that accepts data and callback options
|
*/
flour.http = function(url, method, requestOptions)
{
  if(method === undefined)
  {
    method = 'get';
  }


  //
  //  Returns the url with variables in place
  //
  var parseURL = function(data, originalURL)
  {
    if(data !== undefined)
    {
      // replace any url strings with the data key
      for(var key in data)
      {
        if(originalURL.indexOf(':' + key) !== -1)
        {
          var replaceString = ':' + key;
          originalURL = originalURL.replace(replaceString, data[key]);
          delete(data[key]);
        }
      }
    }

    return originalURL;
  }


  //
  //  Callable return function
  //
  return function(data, options)
  {
    var data = flour.clone(data);
    var parsedURL = parseURL(data, url);

    // publish http
    if(options.silent !== true)
    {
      flour.publish('http-request:start');
    }

    // create our request options
    var request = {
      url: parsedURL,
      type: method,
      data: data,

      success: function(response, status)
      {
        if(options.silent !== true)
        {
          flour.publish('http-request:end');
        }

        flour.requestHandler(response, status, options);
      }
    };

    // overide with custom $.ajax options
    if(requestOptions !== undefined)
    {
      for(var option in requestOptions)
      {
        request[option] = requestOptions[option];
      }
    }

    // do the request
    $.ajax(request);

  };
};