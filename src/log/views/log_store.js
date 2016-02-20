

/*
|
|
| Flour log store
|
|
*/
flour.addView('flour_log_store', function()
{

  var view = this;

  // view params
  view.template = 'flour_log_store';
  view.events = {};

  view.storeList = false;


  //
  // init
  //
  view.init = function()
  {
    view.storeList = view.getList('flour_log_store_list');
    
    view.subscribe('flour:store_update', function(items)
    {
      view.displayItems(items);
    });

    view.displayItems(flour.store.get());

    view.el.removeClass('flour-view');
    view.render();
  };


  //
  // display items
  //
  view.displayItems = function(items)
  {
    var itemsCount = 0;
    view.storeList.removeAll();
    
    for(var key in items)
    {
      var itemData = {
        key: key,
        data: items[key]
      };

      if(flour.isObject(itemData.data))
      {
        itemData.is_object = true;
        itemData.data = flour.filters['json_format'](items[key]);
      }
      
      view.storeList.add(itemData);
      itemsCount ++;
    }

    view.trigger('updateStoreCount', itemsCount);
  };

});