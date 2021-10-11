
flour.view.add('home', function(){

	var view = this;
	var itemId = 3;


	view.template = 'home';


	


	view.init = function(params)
	{
		view.state.set('new_item_name', '');
		view.state.set('user.name', 'Gerwin');
		view.state.set('count', 0);
		view.state.set('items', [
			{
				id: 0,
				name: 'Gerwin',
				count: 0
			},
			{
				id: 1,
				name: 'Sam',
				count: 0
			},
			{
				id: 2,
				name: 'Marlia',
				count: 0
			}
		]);
		
		view.render();
	};



	view.handleAddItemClick = function(event, el)
	{
		view.state.set('count', parseInt(view.state.get('count')) + 1);
		
		view.state.addItem('items', {
			id: itemId,
			name: view.state.get('new_item_name')
		});

		view.state.set('new_item_name', '');
		itemId ++;
	};



	view.handleListItemIncrementCountClick = function(event, el)
	{
		view.state.updateItem('items', )
	};

});