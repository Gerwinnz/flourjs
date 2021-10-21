
flour.view.add('home', function(){

	var view = this;
	var itemId = 3;


	view.template = 'home';


	


	view.init = function(params)
	{
		view.state.onChange('items', function(event)
		{
			view.state.set('count', event.value.length);
		});

		view.state.set('new_item_name', '');
		view.state.set('user.name', 'Gerwin');
		view.state.set('items', []);
		
		view.render();
	};



	view.handleAddItemClick = function(event, el)
	{
		view.state.insertItem('items', {
			id: itemId,
			name: view.state.get('new_item_name'),
			count: 0,
			drinks: []
		});

		view.state.set('new_item_name', '');
		itemId ++;
	};



	view.handleSetItemsClick = function(event, el)
	{
		var items = [
			{
				id: 0,
				name: 'Gerwin',
				count: 0,
				drinks: [
					{
						id: 0,
						name: 'Earl grey'
					},
					{
						id: 1,
						name: 'Wine'
					}
				]
			},
			{
				id: 1,
				name: 'Sam',
				count: 0,
				drinks: [
					{
						id: 1,
						name: 'Wine'
					}
				]
			},
			{
				id: 2,
				name: 'Marlia',
				count: 0,
				drinks: [
					{
						id: 1,
						name: 'Wine'
					}
				]
			}
		];

		view.state.set('items', items);
	}



	view.handleListItemIncrementCountClick = function(event, el)
	{
		var id = el.getAttribute('data-id');
		var item = view.state.getItem('items', id);

		item.update('count', item.value.count + 1);
	};



	view.handleListItemRemoveClick = function(event, el)
	{
		var id = el.getAttribute('data-id');
		var item = view.state.getItem('items', id);

		item.remove();

		console.log(id, item);
		//view.state.removeItem('items', id);
	};

});