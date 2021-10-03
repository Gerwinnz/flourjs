
flour.view.add('home', function(){

	var view = this;

	view.template = 'home';
	view.events = {

	};



	view.init = function(params)
	{
		view.state.set('user.name', 'Gerwin');
		view.state.set('count', 0);
		view.state.set('items', [
			{
				id: 0,
				name: 'Gerwin'
			},
			{
				id: 1,
				name: 'Sam'
			},
			{
				id: 2,
				name: 'Marlia'
			}
		]);
		
		view.render();
	};



	view.handleIncrementCountClick = function(event, el)
	{
		view.state.set('count', parseInt(view.state.get('count')) + 1);
		//view.state.setItem('items', 1, 'name', 'Sam Barton');
	};



	view.handleListItemIncrementCountClick = function(event, el)
	{
		console.log('oi oi');
	};

});