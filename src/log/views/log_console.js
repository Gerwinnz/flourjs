

/*
|
|
| Log
|
|
*/
flour.addView('flour_log_console', function()
{

  var view = this;

  // view params
  view.template = 'flour_log_console';
  view.events = {};

  view.consoleList = false;


  //
  // init
  //
  view.init = function()
  {
    view.consoleList = view.getList('flour_log_console_list');
    view.el.removeClass('flour-view');
    view.render();
  };


  //
  // log
  //
  view.log = function(data, type)
  {
    var params = {
      data: data,
      type: type
    };

    if(flour.isObject(data))
    {
      params.is_object = true;
      params.data = flour.filters['json_format'](data);
    }

    view.consoleList.add(params);
  };

});