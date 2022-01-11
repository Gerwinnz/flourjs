
flour.view.add('block-list', function()
{
	var view = this;
	var itemId = 3;
	var updatesCount = 0;

	view.template = 'list';



	/*
	|
	|	Init
	|
	*/
	view.init = function(params)
	{
		view.state.onChange('items', function(event)
		{
			view.state.set('items_count', event.value.length);
		});

		view.state.set('new_item_name', '');
		view.state.set('items', []);
	};



	view.handleAddItemClick = function()
	{
		var name = view.state.get('new_item_name');

		if(name === '')
		{
			view.refs.name_field.focus();
			return;
		}

		view.state.insertItem('items', {
			id: itemId,
			name: name,
			count: 0,
			tags: []
		});

		view.state.set('new_item_name', '');
		itemId ++;
	};


	view.handleNameFieldKeypress = function(event, el)
	{
		if(event.key === 'Enter')
		{
			view.handleAddItemClick();
		}
	};

	view.handleNameFieldFocus = function()
	{
		console.log('FOCUSED!!!');
	}



	view.handleSetItemsClick = function(event, el)
	{
		updatesCount ++;

		var items = [
			{
				id: 0,
				name: 'Frodo Baggins',
				count: updatesCount,
				tags: [
					{
						id: 0,
						name: 'Ring'
					},
					{
						id: 1,
						name: 'Complaining'
					}
				]
			},
			{
				id: 1,
				name: 'Sam Wise',
				count: updatesCount,
				tags: [
					{
						id: 1,
						name: 'Potatoes'
					}
				]
			},
			{
				id: 2,
				name: 'Gandalf',
				count: updatesCount,
				tags: [
					{
						id: 1,
						name: 'Magic'
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



	view.handleAddItemTagClick = function(event, el)
	{
		var id = el.getAttribute('data-id');
		var item = view.state.getItem('items', id);
		
		var newTagName = item.value.new_tag_name;
		var tags = item.value.tags;
		var lastTag = tags.length > 0 ? tags[tags.length - 1] : null;
		var tagId = lastTag ? lastTag.id + 1 : 0;

		tags.push({
			id: tagId,
			name: newTagName
		});

		item.update({
			'tags': tags,
			'new_tag_name': ''
		});
	};



	view.handleListItemRemoveClick = function(event, el)
	{
		var id = el.getAttribute('data-id');
		var item = view.state.getItem('items', id);

		item.remove();
	};



	view.handleMoveItemUpClick = function(event, el)
	{
		var id = el.getAttribute('data-id');
		var item = view.state.getItem('items', id);

		item.move(item.index - 1);
	};



	view.handleMoveItemDownClick = function(event, el)
	{
		var id = el.getAttribute('data-id');
		var item = view.state.getItem('items', id);

		item.move(item.index + 1);
	};

});