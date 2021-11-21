
flour.view.add('form', function(){

	var view = this;
	view.template = 'form';


	
	view.init = function(params)
	{
		view.state.set('types', 
		[
			{
				id: 0,
				label: 'Hobbit'
			},
			{
				id: 1,
				label: 'Man'
			},
			{
				id: 2,
				label: 'Goblin'
			},
			{
				id: 3,
				label: 'Elf'
			}
		]);

		view.state.set('name', 'Gerwin');
		view.state.set('email', 'gvanroyen@gmail.com');
		view.state.set('type', 3); // this isn't working yet

		view.render();
	};



	view.handleFormSubmit = function(event, el)
	{
		event.preventDefault();

		console.log({
			name: view.state.get('name'),
			email: view.state.get('email'),
			type: view.state.get('type')
		});
	};

});