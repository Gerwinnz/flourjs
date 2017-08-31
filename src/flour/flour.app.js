
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
  if(!(this instanceof flour.app)) 
  {
    return new flour.app(name, options);
  }

  // Self keyword
  var self = this;

  options = options || {};

  // Privates
  var views = [];
  var cacheViewsCount = options.cache_views_count === undefined ? 5 : options.cache_views_count;
  var current = 0;
  var currentViewName = undefined;
  var currentViewParams = undefined;


  // Setup some app params
  self.el = $('<div class="flour-app"></div>');
  


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
  | Checks when new view is ready and then calls our transition method
  |
  */
  self.displayView = function(nextView, lastView)
  {
    if(nextView.ready === false)
    {
      var onReady = function()
      {
        self.transitionViews(nextView, lastView);
        nextView.ready = true;
        nextView.off('ready', onReady);
      };

      nextView.on('ready', onReady);
    }
    else
    {
      self.transitionViews(nextView, lastView);
    }
  };




  /*
  |
  | Transitions our views
  |
  */
  self.transitionViews = function(nextView, lastView)
  {
    if(nextView.willShow !== undefined)
    {
      nextView.willShow();
    }

    if(options.transition)
    {
      options.transition(nextView, lastView, function(){
        self.cleanUp(nextView, lastView);
      });
    }
    else
    {
      self.el.append(nextView.el);
      self.cleanUp(nextView, lastView);
    }
  };



  /*
  |
  | Will destroy previous views
  |
  */
  self.cleanUp = function(nextView, lastView)
  {
    if(lastView)
    {
      lastView.el.detach();
    }

    if(views.length > cacheViewsCount)
    {
      var view = views.shift();
      view.destroy();
      view.el.remove();
      current --;
    }
  };

  


  /*
  |
  | Create new router and listen to route change event
  |
  */
  var router = new flour.router(options.routes, options.base_path);

  flour.subscribe('route:change', function(route)
  {
    var extra = undefined;
    
    // place the view into our app element
    if(flour.views[route.view] !== undefined)
    {
      if(route.view !== currentViewName || JSON.stringify(route.params) !== JSON.stringify(currentViewParams))
      {
        // destroy old view
        var nextView;
        var lastView = views[current];
        

        // calls will hide and gets hand over data if available
        if(lastView)
        {
          if(lastView.willHide)
          {
            extra = lastView.willHide(route.view);
          }
        }

        // check for back to re-use previous view
        if(route.direction === 'back')
        {
          lastView = views.pop();
          lastView.destroy();
          current --;

          if(views[current] !== undefined)
          {
            nextView = views[current];
          }
          else
          {
            nextView = flour.getView(route.view, route.params, extra);
            views.push(nextView);
          }
        }
        else
        {
          nextView = flour.getView(route.view, route.params, extra);
          views.push(nextView);
        }

        // update our stack and start loading
        current = views.length - 1;
        self.displayView(nextView, lastView);
        
        // update currents for checking against
        currentViewName = route.view;
        currentViewParams = route.params;
      }

      
      if(route.action && self.view[route.action] !== undefined)
      {
        self.view[route.action](route.params);
      }
    }else{
      flour.error('View "' + route.view + '" does not exist.');
    }   
  });




  /*
  |
  | On init
  |
  */
  flour.defer(function(){
    router.matchCurrentRequest();
  });

};