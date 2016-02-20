

/*
|
|
|
|
|
*/
flour.addList('flour_log_store_list', function()
{

  var list = this;

  // list params
  list.template = 'flour_log_store_item';
  list.itemElClass = 'flour-log-store-item';
  list.key = 'key';


  //
  // init
  //
  list.init = function()
  {
    list.el.removeClass('flour-list');
  };

});