
var flour = flour || {};



//
//  Formats a json string
//
flour.addFilter('json_format', function(json)
{
  return JSON.stringify(json, undefined, 2)
});