
(function(){

	var app = flour.app({
		base_url: 'http://localhost/flourjs/v2',
		element: document.getElementById('app'),
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
	

	// var listView = flour.view.get('list');
	// document.getElementById('list-view').append(listView.el);
	// window.listView = listView;


	// var formView = flour.view.get('form');
	// document.getElementById('form-view').append(formView.el);
	// window.formView = formView;


	// formView.on('submit', function(data)
	// {
	// 	console.log('form_view_submit', data);
	// });

}());
