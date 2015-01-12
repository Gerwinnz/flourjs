
var flour = flour || {};


/*
|
| Store our templates in this object
|
*/
flour.templates = {};


/*
|
| Add and compile a template
|
*/
flour.addTemplate = function(name, template)
{
  flour.templates[name] = Handlebars.compile(template);
};


/*
|
| Return a template
|
*/
flour.getTemplate = function(name)
{
  if(name !== undefined)
  {
    if(flour.templates[name] !== undefined)
    {
      return flour.templates[name];
    }
  }

  return false;
}