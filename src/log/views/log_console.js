

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
  view.events = {
    'click .flour-log-clear-console': 'clearLogs',
    'click .flour-log-expand': 'expandLog'
  };

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
  // Create log
  //
  view.createLog = function(data, extra, type)
  {
    var params = {
      data: data,
      type: type,
      extra: extra,
      count: false
    };

    if(flour.isObject(data) || flour.isArray(data))
    {
      params.is_object = true;
      params.data = flour.filters['json_format'](data);
    }

    if(params.extra !== undefined && (flour.isObject(extra) || flour.isArray(extra)))
    {
      params.extra_is_object = true;
      params.extra = flour.filters['json_format'](extra);
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



  //
  //  Clear logs
  //
  view.clearLogs = function(event, el)
  {
    mLastData = undefined;
    view.consoleList.removeAll();
  };



  //
  //
  //
  view.expandLog = function(event, el)
  {
    var logId = el.data('id');
    var item = view.consoleList.getItem(logId);

    item.el.toggleClass('flour-log-expanded');
  };

});