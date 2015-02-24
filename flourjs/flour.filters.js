
var flour = flour || {};



//
//  Formats a json string
//
flour.addFilter('json_format', function(json, params)
{
  var spaces = params === undefined ? 2 : parseInt(params);

  return JSON.stringify(json, undefined, spaces)
});