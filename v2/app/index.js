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

			'/examples': { view: 'examples' },
			'/examples/:example': { view: 'examples' },

			'/build': { view: 'build' },

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

}());
