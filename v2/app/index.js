
(function(){


	//
	var transitionHandler = function(e, callback)
	{
		e.hostElement.append(e.nextView.el);
		callback();
	};


	//
	var app = flour.app({
		view: 'app',
		base_url: 'http://localhost/flourjs/v2',
		element: document.getElementById('app'),
		transitionHandler: transitionHandler,
		routes: {
			'/binders': { view: 'form' },
			'/binders/:binder': { view: 'binders' },
			
			'/blocks': { view: 'list' },
			'/blocks/:block': { view: 'blocks' },

			'/components': { view: 'components' },
			'/components/:component': { view: 'components' },

			'/': { view: 'home'}
		}
	});
	

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
