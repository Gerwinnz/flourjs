
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
		view.state.addItem('items', {
			id: itemId,
			name: view.state.get('new_item_name'),
			count: 0
		});

		view.state.set('new_item_name', '');
		itemId ++;
	};



	view.handleListItemIncrementCountClick = function(event, el)
	{
		var id = el.getAttribute('data-id');
		var item = view.state.getItem('items', id);
		
		console.log(item);
		//view.state.updateItem('items', id, 'count', item.count ++);
	};

});