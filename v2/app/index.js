
(function(){

	var app = flour.app({
		base_url: 'http://localhost/flourjs/v2/',
		element: document.getElementById('app'),
		routes: {
			'home': { view: 'home' },
			'page/:page': { view: 'page' }
		}
	});


	var sharedState = flour.state({
		name: 'Gerwin',
		email: 'gvanroyen@gmail.com'
	});
	

	var listView = flour.view.get('list');
	document.getElementById('list-view').append(listView.el);
	window.listView = listView;


	var formView = flour.view.get('form');
	document.getElementById('form-view').append(formView.el);
	window.formView = formView;


	formView.on('submit', function(data)
	{
		console.log('form_view_submit', data);
	});

}());
