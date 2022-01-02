
(function(){


	//
	var transitionHandler = function(e, callback)
	{
		// First load no current view
		if(!e.currentView)
		{
			e.hostElement.append(e.nextView.el);
			callback();
			return;
		}

		//
		var animationIn = 'view__in-forward';
		var animationOut = 'view__out-forward';

		if(e.route.direction === 'back')
		{
			animationIn = 'view__in-back';
			animationOut = 'view__out-back';
		}

		console.log('e.route.direction', e.route.direction);

		nextViewEl = e.nextView.el;
		currentViewEl = e.currentView.el;

		nextViewEl.classList.add('view--animating', animationIn);
		currentViewEl.classList.add('view--animating', animationOut);

		e.hostElement.append(e.nextView.el);

		nextViewEl.addEventListener('animationend', function()
		{
			nextViewEl.classList.remove('view--animating', animationIn);
			currentViewEl.classList.remove('view--animating', animationOut);
			callback();
		}, {once: true});
	};


	//
	var app = flour.app({
		view: 'app',
		base_url: 'http://localhost/flourjs/v2',
		element: document.getElementById('app'),
		transitionHandler: transitionHandler,
		routes: {
			'/binders': { view: 'binders' },
			'/binders/:binder': { view: 'binders' },
			
			'/blocks': { view: 'blocks' },
			'/blocks/:block': { view: 'blocks' },

			'/components': { view: 'components' },
			'/components/:component': { view: 'components' },

			'/': { view: 'home'}
		}
	});

	window.app = app;


	//
	// Possibly should be an array so the order is respected 🤔
	//
	// [
	// 		['/binders/:binder', { view: 'binders'}],
	// 		['/blocks/:block', { view: 'blocks'}],
	// 		['/components/:component', { view: 'components'}],
	// 		['/', { view: 'home'}]
	// ]


	var sharedState = flour.state({
		name: 'Gerwin',
		email: 'gvanroyen@gmail.com'
	});


}());
