/*
|
|  Return href with base url prepended
|
*/
Handlebars.registerHelper('link_to', function(context, options) 
{  
  return flour.config('base_url') + '/' + context;
});



/*
|
|  Render a specified template with passed data
|
*/
Handlebars.registerHelper('render_template', function(template, data) 
{
  return flour.getTemplate(template)({'data': data});
});