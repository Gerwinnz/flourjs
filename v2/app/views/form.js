
flour.view.add('form', function()
{
	var view = this;
	view.template = 'form';

	var helloOne = false;
	var helloTwo = false;


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

		helloOne = flour.view.get('hello_world');
		helloTwo = flour.view.get('hello_world');

		window.hello1 = helloOne;
		window.hello2 = helloTwo;
		
		console.log('hello', helloOne);
		console.log('hello', helloTwo);

		view.state.onChange('name', function(event)
		{
			helloOne.state.set('name', event.value);
			helloTwo.state.set('name', event.value);
		});

		view.state.set('name', 'Gerwin');
		view.state.set('email', 'gvanroyen@gmail.com');
		view.state.set('type', 3);

		view.render();

		view.refs.hello_one.append(helloOne.el);
		view.refs.hello_two.append(helloTwo.el);
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
		console.log(el);
	};

});