import { transitionHandler } from './transition_handler';

(function(){

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

			'/form': { view: 'form' },
			'/http': { view: 'test' },

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

}());
