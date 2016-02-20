

/*
|
|
| Flour log views list
|
|
*/
flour.addList('flour_log_views_list', function()
{

  var list = this;

  // list params
  list.template = 'flour_log_views_item';
  list.itemElClass = 'flour-log-view-item';
  list.key = 'id';


  //
  // init
  //
  list.init = function()
  {
    list.el.removeClass('flour-list');
  };

});