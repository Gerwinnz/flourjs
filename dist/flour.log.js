

/*
|
|
| Main console view
|
|
*/
flour.addView('flour_log', function()
{

  var view = this;

  // view params
  view.template = 'flour_log';
  view.events = {
    'click .flour-log-tab': 'setTabEvent',
    'click .flour-log-toggle': 'toggleConsole'
  };

  // privates
  var isOpen = false;
  var currentTab = 'console';
  var $tabs = false;
  var $panes = false;

  // children views
  view.consoleView = false;
  view.viewsView = false;
  view.storeView = false;


  //
  // init
  //
  view.init = function()
  {
    view.el.removeClass('flour-view');
    view.el.addClass('flour-log');

    view.consoleView = view.getView('flour_log_console', {});
    view.storeView = view.getView('flour_log_store', {});
    view.viewsView = view.getView('flour_log_views', {});

    view.viewsView.on('updateViewCount', function(viewCount)
    {
      view.set('view_count', viewCount, false);
    });

    view.storeView.on('updateStoreCount', function(storeCount)
    {
      view.set('store_count', storeCount, false);
    });

    view.set('store_count', 0, false);
    view.set('view_count', 0, false);

    isOpen = localStorage.getItem('flour_console_open') === undefined ? 0 : parseInt(localStorage.getItem('flour_console_open'));
    currentTab = localStorage.getItem('flour_console_tab') === undefined ? 'console' : localStorage.getItem('flour_console_tab');
    
    if(isOpen)
    {
      view.el.addClass('open');
    }

    view.render();
  };

  view.postRender = function()
  {
    $tabs = view.find('.flour-log-tab');
    $panes = view.find('.flour-log-pane');
    view.setTab(currentTab);
  };



  //
  // set current tab on click
  //
  view.setTabEvent = function(event, el)
  {
    view.setTab(el.data('tab'));
  };



  //
  // set tab
  //
  view.setTab = function(tabName)
  {
    currentTab = tabName;
    $tabs.removeClass('flour-log-tab-active');
    $panes.removeClass('flour-log-pane-active');

    $.each($tabs, function(index, tab)
    {
      var $tab = $(tab);
      if($tab.data('tab') === currentTab)
      {
        $tab.addClass('flour-log-tab-active');
      }
    });

    $.each($panes, function(index, pane)
    {
      var $pane = $(pane);
      if($pane.data('tab') === currentTab)
      {
        $pane.addClass('flour-log-pane-active');
      }
    });

    localStorage.setItem('flour_console_tab', tabName);
  };



  //
  // open close console
  //
  view.toggleConsole = function()
  {
    if(view.el.hasClass('open'))
    {
      localStorage.setItem('flour_console_open', 0); 
      view.el.addClass('close');
      view.el.one('animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd', function()
      {
        view.el.off('animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd');
        view.el.removeClass('open');
        view.el.removeClass('close');
      });
    }
    else
    {
      localStorage.setItem('flour_console_open', 1);
      view.el.addClass('open');
    }
  };


  //
  // log
  //
  view.log = function(data, type)
  {
    view.consoleView.log(data, type);
  };

});


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
flour.addTemplate('flour_log', '<div class=\"flour-log-toggle\"></div> <div class=\"flour-log-console\">  <div class=\"flour-log-tabs\">    <div class=\"flour-log-tab flour-log-tab-active\" data-tab=\"console\">Console</div>     <div class=\"flour-log-tab\" data-tab=\"views\">Views <span class=\"flour-log-tab-stat\" flour-text=\"view_count\"></span></div>     <div class=\"flour-log-tab\" data-tab=\"store\">Store <span class=\"flour-log-tab-stat\" flour-text=\"store_count\"></span></div>   </div>   <div class=\"flour-log-panes\">    <div class=\"flour-log-pane\" data-tab=\"console\" flour-view=\"consoleView\"></div>     <div class=\"flour-log-pane\" data-tab=\"views\" flour-view=\"viewsView\"></div>     <div class=\"flour-log-pane\" data-tab=\"store\" flour-view=\"storeView\"></div>   </div> </div>');
flour.addTemplate('flour_log_console', '<div>   <div flour-view=\"consoleList\">  </div> </div>');
flour.addTemplate('flour_log_console_item', '<div class=\"flour-log-console-item-inner\">   {{#if is_object }}     <pre>{{ data }}</pre>  {{else}}    {{ data }}   {{/if}}</div>');
flour.addTemplate('flour_log_store', '<div>   <div flour-view=\"storeList\"></div> </div>');
flour.addTemplate('flour_log_store_item', '<div class=\"flour-log-store-item-inner\">   <div class=\"flour-log-store-item-key\">{{ key }}</div>   {{#if is_object }}     <pre>{{ data }}</pre>  {{else}}    {{ data }}   {{/if}}</div>');
flour.addTemplate('flour_log_views', '<div>   <div flour-view=\"viewList\"></div> </div>');
flour.addTemplate('flour_log_views_item', '<div class=\"flour-log-view-item-inner\">   <div class=\"flour-log-view-item-name\">{{ name }}</div>   <div class=\"flour-log-view-item-stat\">Id: {{ id }}</div>  <div class=\"flour-log-view-item-stat\">Template: {{ template }}</div>  <div class=\"flour-log-view-item-stat\">Helpers: {{ helpers }}</div></div>');




/*
|
|
|	Insert CSS
|
|
*/
var styleTag = document.createElement("style");
styleTag.innerHTML = '/*||| Contains the css for our flour log console||*/.flour-log{  position: fixed;  bottom: 10px;  right: 10px;  z-index: 100;}.flour-log-toggle{  height: 30px;  width: 30px;  background-color: rgba(0,0,0,.75);  color: #fff;  line-height: 30px;  border-radius: 15px;  cursor: pointer;}.flour-log-console{  position: fixed;  top: 10px;  right: 10px;  bottom: 50px;  width: 400px;    background-color: rgba(0,0,0,.75);  color: #fff;  display: none;}@media(max-width: 550px){  .flour-log-console{    top: 0px;    right: 0px;    left: 0px;    width: auto;  }}.flour-log.open .flour-log-console{  display: block;  -webkit-animation-name: openConsole;  animation-name: openConsole;  -webkit-animation-duration: 200ms;  animation-duration: 200ms;  -webkit-animation-fill-mode: both;  animation-fill-mode: both;  -webkit-transform-origin: right bottom;  transform-origin: right bottom;}.flour-log.close .flour-log-console{  -webkit-animation-name: closeConsole;  animation-name: closeConsole;  -webkit-animation-duration: 200ms;  animation-duration: 200ms;  -webkit-animation-fill-mode: both;  animation-fill-mode: both;  -webkit-transform-origin: right bottom;  transform-origin: right bottom;}.flour-log-tabs{  display: -webkit-flex;  display: flex;  background-color: rgba(0,0,0,.3);}.flour-log-tab{  position: relative;  padding: 10px;  text-align: center;  cursor: pointer;  flex: 1 0 0;  color: rgba(255, 255, 255, .7);  border-bottom: solid 2px rgba(255, 255, 255, .3);}.flour-log-tab-active{  color: #fff;  border-bottom: solid 2px #fff;}.flour-log-tab:last-of-type{  border-right: 0;}.flour-log-tab-stat{  display: inline-block;  margin: 0 0 0 4px;  width: 20px;  height: 20px;  line-height: 20px;  text-align: center;  background-color: #039BE5;  border-radius: 10px;}.flour-log-pane{  display: none;  position: absolute;  top: 46px;  right: 0px;  bottom: 0px;  left: 0px;  overflow: auto;  -webkit-overflow-scrolling:touch;}.flour-log-pane-active{  display: block;}/*|| Console view styles|*/.flour-log-view-item{  position: relative;  border-bottom: solid 1px rgba(0, 0, 0, .1);}.flour-log-view-item-name{  position: absolute;  top: 10px;  right: 10px;  font-size: 10px;}.flour-log-view-item-stat{  font-size: 12px;}.flour-log-view-item-inner{  border-left: solid 2px #03A9F4;  padding: 10px;  font-size: 12px;}.flour-log-view-item pre{  margin: 0;  padding: 0;  font-size: 12px;  font-family: monospace;  overflow: hidden;}/*|| Console log styles|*/.flour-log-console-item{  border-bottom: solid 1px rgba(0, 0, 0, .1);}.flour-log-console-item-inner{  border-left: solid 2px #03A9F4;  padding: 10px;  font-size: 12px;  font-family: monospace;}.flour-log-console-item pre{  margin: 0;  padding: 0;  font-size: 12px;  font-family: monospace;  overflow: hidden;  word-wrap: break-word;}/*|| Console store styles|*/.flour-log-store-item{  position: relative;  border-bottom: solid 1px rgba(0, 0, 0, .1);}.flour-log-store-item-key{  position: absolute;  top: 10px;  right: 10px;  font-size: 10px;}.flour-log-store-item-inner{  border-left: solid 2px #03A9F4;  padding: 10px;  font-size: 12px;}.flour-log-store-item pre{  margin: 0;  padding: 0;  font-size: 12px;  font-family: monospace;  overflow: hidden;}/*|| Open console|*/@-webkit-keyframes openConsole {  0% {    opacity: 0;    transform: translate(50%, 0%);  }  100% {    opacity: 1;    transform: translate(0%, 0%);  }}@keyframes openConsole {  0% {    opacity: 0;    transform: translate(50%, 0%);  }  100% {    opacity: 1;    transform: translate(0%, 0%);  }}/*|| Close console|*/@-webkit-keyframes closeConsole {  0% {    opacity: 1;    transform: translate(0%, 0%);  }  100% {    opacity: 0;    transform: translate(50%, 0%);  }}@keyframes closeConsole {  0% {    opacity: 1;    transform: translate(0%, 0%);  }  100% {    opacity: 0;    transform: translate(50%, 0%);  }}';
document.getElementsByTagName("head")[0].appendChild(styleTag);



/*
|
|
| Create logView and append to body
|
|
*/
flour.logView = flour.getView('flour_log');


$(function(){ 
	$('body').append(flour.logView.el); 
});

