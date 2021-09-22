
flour.view.add('home', function(){

	var view = this;

	view.tag = 'div';
	view.template = 'home';
	view.events = {

	};



	view.init = function(params)
	{
		view.state.set('name', 'gerwin');
		view.state.set('user.name', 'Gerwin');
		view.state.set('count', 0);
		view.render();
	};



	view.incrementCount = function(event, el)
	{
		view.state.set('count', view.state.get('count') + 1);
	};

});