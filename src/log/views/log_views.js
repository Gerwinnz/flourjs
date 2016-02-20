

/*
|
|
| Flour console, views
|
|
*/
flour.addView('flour_log_views', function()
{

  var view = this;

  // view params
  view.template = 'flour_log_views';
  view.events = {};

  // privates
  var viewCount = 0;


  //
  // init
  //
  view.init = function()
  {
    view.el.removeClass('flour-view');

    // create view list
    view.viewList = flour.getList('flour_log_views_list');

    // view
    view.subscribe('flour:view_create', function(newView)
    {
      view.increaseViewCount();
      view.addViewToList(newView);
    });

    view.subscribe('flour:view_destroy', function(id)
    {
      view.decreaseViewCount();
      view.removeViewFromList(id);
    });


    // list
    view.subscribe('flour:list_create', function(newView)
    {
      view.increaseViewCount();
      view.addViewToList(newView);
    });

    view.subscribe('flour:list_destroy', function(id)
    {
      view.decreaseViewCount();
      view.removeViewFromList(id);
    });

    view.render();
  };


  //
  // increase and decrease view count
  //
  view.increaseViewCount = function()
  {
    viewCount ++;
    view.trigger('updateViewCount', viewCount);
  };

  view.decreaseViewCount = function()
  {
    viewCount --;
    view.trigger('updateViewCount', viewCount);
  };


  //
  // add view/list
  //
  view.addViewToList = function(newView)
  {
    var viewReference = newView.view ? newView.view : newView.list;
    var data = {
      id: viewReference.id,
      name: newView.name,

      template: viewReference.template,
      helpers: (viewReference.helpers ? viewReference.helpers.join(',') : 'none')
    };

    view.viewList.add(data);
  };


  //
  // add view/list
  //
  view.removeViewFromList = function(id)
  {
    view.viewList.remove(id);
  };

});