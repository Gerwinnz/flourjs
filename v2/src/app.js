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
	mView = false;
	mElement = false;
	mHostElement = false;
	mRouter = false;

	mViews = [];
	mCacheViewsCount = 5;
	mCurrentViewIndex = 0;
	mCurrentRoute = {};
	mTransitionHandler = false;

	mBaseURL = '';




	constructor(params)
	{
		this.mElement = params.element || document.createElement('div');
		this.mRouter = flour.router(params.routes, params.base_url);
		this.mBaseURL = params.base_url || document.location.origin;

		if(flour.util.isFunction(params.transitionHandler))
		{
			this.mTransitionHandler = params.transitionHandler;
		}
		

		if(params.view && flour.view.defined[params.view] !== undefined)
		{
			this.mView = flour.view.get(params.view);
			this.mElement.append(this.mView.el);

			if(this.mView.refs.app)
			{
				this.mHostElement = this.mView.refs.app;
			}
		}
		else
		{
			this.mHostElement = this.mElement;
		}


		flour.subscribe('history:state_change', (data) => 
		{
			this.matchRoute(data);
		});

		window.addEventListener('popstate', (event) => 
		{
			var state = event.state;
			state.popstate = true;
			flour.publish('history:state_change', state);
		});


		this.matchRoute({url: document.URL});
		this.attachLinkClicks();
	}



	/*
	|
	|
	|
	|
	|
	*/
	matchRoute(data)
	{
		var route = this.mRouter.match(data);

		if(!route)
		{
			flour.util.throw('No matching route found');
			return;
		}
		
		if(route.view === undefined)
		{ 
			flour.util.throw('Route has no view parameter.'); 
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
			var nextView = false;
        	var currentView = this.mViews[this.mCurrentViewIndex];


			//
			//	If same view with handler call it and stop there unless it explicitly returns false
			//			
			if(!isDifferentView && flour.util.isFunction(currentView.routeUpdate))
			{
				var handled = currentView.routeUpdate(route);

				if(handled !== false){
					this.mCurrentRoute = route;
					return;
				}
			}


			//
			//	Check for back direction, if so re-use the cached view
			//
			if(route.direction === 'back')
			{
				currentView = this.mViews.pop();
				currentView.destroy();
				this.mCurrentViewIndex --;

				if(this.mViews[this.mCurrentViewIndex] !== undefined)
				{
					nextView = this.mViews[this.mCurrentViewIndex];
				}
			}

			if(!nextView)
			{
				nextView = flour.view.get(route.view, route.params);
				this.mViews.push(nextView);
			}


			//
			//	Push new view on view stack
			//
			this.mCurrentViewIndex = this.mViews.length - 1;
			this.displayView(nextView, currentView, route);
		}


		//
		//	Check if route has an action and attempt to call a method on the new view of same action
		//
		if(route.action && flour.util.isFunction(nextView[route.action]))
		{
			nextView[route.action](route.params);
		}


		//
		//	Store our route for comparisons
		//
		this.mCurrentRoute = route;
	}



	/*
	|
	|
	|
	|
	|
	*/
	displayView(nextView, currentView, route)
	{
		var extra = undefined;

		if(currentView && flour.util.isFunction(currentView.willHide))
		{
			extra = currentView.willHide();
		}

		if(flour.util.isFunction(nextView.willShow))
		{
			nextView.willShow(extra);
		}

		if(nextView.ready === false)
		{
			var onReady = function()
			{
				self.transitionViews(nextView, currentView);
				nextView.ready = true;
				nextView.off('ready', onReady);
			};

			nextView.on('ready', onReady);
		}
		else
		{
			this.transitionViews(nextView, currentView, route);
		}
	}



	/*
	|
	|
	|	Default transition view basically appends our new view and cleans up the old
	|
	|
	*/
	transitionViews(nextView, currentView, route)
	{	
		if(this.mTransitionHandler)
		{
			var details = {
				hostElement: this.mHostElement,
				nextView: nextView,
				currentView: currentView,
				route: route
			};

			this.mTransitionHandler(details, () => 
			{
				this.cleanUp(currentView);
			});
		}
		else
		{
			this.mHostElement.append(nextView.el);
			this.cleanUp(currentView);
		}
	}



	/*
	|
	|
	|	Remove passed in view and destroy views past our cache count
	|
	|
	*/
	cleanUp(view)
	{
		if(view)
		{
			view.el.parentNode.removeChild(view.el);
		}

		if(this.mViews.length > this.mCacheViewsCount)
		{
			view = this.mViews.shift();
			view.destroy();
			view = false;

			this.mCurrentViewIndex = this.mViews.length - 1;
		}
	}




	attachLinkClicks()
	{
		this.mElement.onclick = (e) => 
		{				
			if(e.target.nodeName === 'A')
			{
				e.preventDefault();
				e.stopPropagation();

				var el = e.target;
				var href = el.getAttribute('href');
				var handledURL = false;
				
				if(href[0] === '/')
				{
					handledURL = this.mBaseURL + href;
				}
				else if(this.mBaseURL !== '' && href.indexOf(this.mBaseURL) === 0)
				{
					handledURL = href;
				}

				if(handledURL)
				{
					this.mRouter.push({}, null, handledURL);
				}
			}
		}
	}

}