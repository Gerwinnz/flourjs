var flour = flour || {};




/*
|
|
|
|
|
*/
flour.app = function(params)
{
	var instance = new flour_app(params);
	return instance;
};



class flour_app
{
	mElement = false;
	mRouter = false;
	//state = false;

	mViews = [];
	mCacheViewsCount = 5;
	mCurrentViewIndex = 0;
	mCurrentRoute = {};




	constructor(params)
	{
		this.mElement = params.element || document.createElement('div');
		this.mRouter = flour.router(params.routes, params.base_url);
		//this.state = flour.state();

		window.appRouter = this.router;

		flour.subscribe('history:state_change', (data) => 
		{
			this.matchRoute(data);
		});

		window.addEventListener('popstate', () => 
		{
			flour.publish('history:state_change', {
		      popstate: true
		    });
		});

		this.matchRoute({url: document.URL});
		this.attachLinkClicks();
	}



	matchRoute(data)
	{
		var route = this.mRouter.match(data);
		var extra = undefined;

		console.log('route', route);
		
		if(route.view === undefined)
		{ 
			return; 
		}
		
		if(flour.view.defined[route.view] === undefined)
		{ 
			flour.util.throw('View "' + route.view + '" has not been defined.'); 
			return; 
		}

		var isDifferentView = route.view !== this.mCurrentRoute.view;
		var isDifferentRoute = route.requestURL !== this.mCurrentRoute.requestURL;
		var isDifferentParams = JSON.stringify(route.params) !== JSON.stringify(this.mCurrentRoute.params);

		if(isDifferentView || isDifferentRoute || isDifferentParams)
		{
			var nextView;
        	var currentView = this.mViews[this.mCurrentViewIndex];
			this.mElement.innerHTML = 'Is different - render "' + route.view + '"!';


			//
			//	If same view with handler call it and stop there unless it explicitly returns false
			//			
			if(!isDifferentView && flour.util.isFunction(currentView.routeUpdate))
			{
				var handled = currentView.routeUpdate(route);
				currentRoute = route.route;

				if(handled !== false){
					return;
				}
			}


			//
			//	Call willHide on current view so 
			//
			if(currentView && flour.util.isFunction(currentView.willHide))
			{
				extra = currentView.willHide(route);
			}


			//
			//	Check for back direction, if so re-use the cached view
			//
			if(route.direction === 'back')
			{

			}
			else
			{

			}
		}
	}



	attachLinkClicks()
	{

	}

}