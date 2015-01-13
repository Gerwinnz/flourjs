
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


  if(flour.templates['flour:missing_template'] === undefined)
  {
    flour.addTemplate('flour:missing_template', '<div>Missing template.</div>');
  }

  return flour.templates['flour:missing_template'];
}
