

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