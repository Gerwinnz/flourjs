
var flour = flour || {};



/*
|
| Instance Id, increments for each instance created
|
*/
flour.instanceId = 1;



/*
|
| flour app core : class
|
*/
flour.app = function(appName, options)
{
  // Return an instance if the new keyword wasn't used
  if (!(this instanceof flour.app)) 
  {
    return new flour.app(name, options);
  }

  // Self keyword
  var self = this;

  // Setup some app params
  self.el = $('<div class="flour-app"></div>');

  self.currentView = undefined;
  self.currentParams = undefined;
  self.view = undefined;


  /*
  |
  | Capture link clicks and use js to push the url
  |
  */
  self.el.on('click', 'a', function(event)
  {
    if(event.button === 1)
    {
      return;
    }

    if(event.metaKey)
    {
      return;
    }

    $target = $(event.currentTarget);

    if($target.hasClass('classic') || $target.hasClass('ignore'))
    {
      event.stopPropagation();
      return;
    }

    event.preventDefault();
    var url = $target.attr('href');

    if(url === undefined)
    {
      return;
    }

    // check for silent class
    var silent = false;
    if($target.hasClass('silent'))
    {
      silent = true;
    }

    // compile the data
    var data = {
      silent: silent
    };

    // push 
    flour.pushState(url, data);
  });




  /*
  |
  | Loads our new view and calls display when ready
  |
  */
  self.loadView = function()
  {
    if(self.view.ready === false)
    {
      var onReady = function()
      {
        self.displayView();
        self.view.off('ready', onReady); // stop listening for this as we only need it first time
      };

      self.view.on('ready', onReady);
    }
    else
    {
      self.displayView();
    }
  };




  /*
  |
  | Displays our new view while removing the last one
  |
  */
  self.displayView = function()
  {
    self.el.empty();

    if(self.view.willDisplay !== undefined)
    {
      self.view.willDisplay();
    }

    self.el.append(self.view.el);
  };

  


  /*
  |
  | Create new router and listen to route change event
  |
  */
  var router = new flour.router(options.routes, options.base_path);

  flour.subscribe('route:change', function(route)
  { 
    // place the view into our app element
    if(flour.views[route.view] !== undefined)
    {
      if(route.view !== self.currentView || JSON.stringify(route.params) !== JSON.stringify(self.currentParams))
      {
        if(self.currentView !== undefined)
        {
          self.view.destroy();
        }

        self.view = flour.getView(route.view, route.params);
        self.loadView();
        
        self.currentView = route.view;
        self.currentParams = route.params;
      }

      if(route.action !== undefined)
      {
        if(self.view[route.action] !== undefined)
        {
          self.view[route.action](route.params);
        }
      }
    }    
  });




  /*
  |
  | On init
  |
  */
  router.matchCurrentRequest();

};