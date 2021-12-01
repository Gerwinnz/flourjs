
flour.view.add('form', function()
{
	var view = this;
	view.template = 'form';


	/*
	|
	|	Init
	|
	*/
	view.init = function(params)
	{
		view.state.set('types', 
		[
			{
				value: 0,
				label: 'Hobbit'
			},
			{
				value: 1,
				label: 'Man'
			},
			{
				value: 2,
				label: 'Goblin'
			},
			{
				value: 3,
				label: 'Elf'
			},
			{
				value: 4, 
				label: 'Dwarf'
			}
		]);

		view.state.set('name', 'Gerwin');
		view.state.set('email', 'gvanroyen@gmail.com');
		view.state.set('type', 3);

		view.render();
	};



	view.handleFormSubmit = function(event, el)
	{
		event.preventDefault();
		view.trigger('submit', {
			name: view.state.get('name'),
			email: view.state.get('email'),
			type: view.state.get('type')
		});

		view.render();
	};



	view.handleResetClick = function(event, el)
	{
		view.state.set('name', 'Reset name');
	};



	view.handleHelloWorldClick = function(event, el)
	{
		
	};

});