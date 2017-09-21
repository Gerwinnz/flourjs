

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

  //  Privates
  var mId = 0;
  var mLastId = false;
  var mLastData = false;


  //  Children
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
      type: type,
      count: false
    };

    if(flour.isObject(data))
    {
      params.is_object = true;
      params.data = flour.filters['json_format'](data);
    }

    if(params.data === mLastData)
    {
      var count = view.consoleList.get(mId, 'count');
      count = count === false ? 2 : (count + 1);
      view.consoleList.set(mId, 'count', count);
    }
    else
    {
      mId ++;
      params.id = mId;

      view.consoleList.add(params);
      mLastData = params.data;
    }
  };

});