
(function(){

	var app = flour.app({
		base_url: 'http://localhost/flourjs/v2/',
		element: document.getElementById('app'),
		routes: {
			'': 'home'
		}
	});

	var homeView = flour.view.get('home');
	document.getElementById('home-view').append(homeView.el);

	window.homeView = homeView;

}());
