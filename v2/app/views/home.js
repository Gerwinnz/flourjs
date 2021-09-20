
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
		view.render();
	};



	view.test = function(event, el)
	{
		console.log(event, el);
	}

});