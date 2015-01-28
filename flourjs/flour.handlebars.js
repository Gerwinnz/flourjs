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



/*
|
|  Takes the html presented and wraps it into a child view, iterates it and adds it through the dom
|
*/
Handlebars.registerHelper('list', function(context, options)
{
  // console.log(context);
  // console.log(options);

  if(context.length === 0)
  {
    return options.inverse(this);
  }

  var view = options.hash.view || false;
  var wrapType = options.hash.wrap || 'div';

  if(view.listId === undefined)
  {
    view.listId = 0;
  }
  else
  {
    view.listId ++;
  }

  var ret = '<' + wrapType + ' class="flour-list" id="flour-list-' + view.listId + '"></' + wrapType + '>';
  var items = [];
  var $el = null;

  if(view)
  {
    view.on('render', function()
    {
      if(!$el)
      {
        $el = view.find('#flour-list-' + view.listId);
      }

      for(var i = 0, n = items.length; i < n; i ++)
      {
        $el.append(items[i]);
      }
    });
  }


  //
  //  Generate items first time round
  //
  for(var i = 0, n = context.length; i < n; i ++)
  {
    if(options.data) 
    {
      data = Handlebars.createFrame(options.data || {});
      data.index = i;
    }

    var itemHTML = options.fn(context[i], {data: data});
    var $item = $(itemHTML);

    items.push($item);
  }


  return ret;
});