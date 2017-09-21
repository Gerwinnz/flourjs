

/*
|
|
| Flour console list
|
|
*/
flour.addList('flour_log_console_list', function()
{

  var list = this;

  // list params
  list.key = 'id';
  list.template = 'flour_log_console_item';
  list.itemElClass = 'flour-log-console-item';


  //
  // init
  //
  list.init = function()
  {
    list.el.removeClass('flour-list');
  };

});