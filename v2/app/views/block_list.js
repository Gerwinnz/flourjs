
flour.view.add('block_list', function()
{
	var view = this;
	var itemId = 3;
	var updatesCount = 0;



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



	/*
	|
	|	Template
	|
	*/
	view.templateHTML = `
		<p>There are <span f-text="items_count"></span> items.</p>
		
		<div style="padding: 8px 0;">
			{{#list items}}
				<div style="position: relative; padding: 16px; background-color: #fff; margin:  8px 0; border-radius: 8px;">
					<div style="display: flex; align-items: center;">
						<div style="flex: 1; font-size: 18px;"><span f-text="name"></span></div>
						<div style="flex: 1;">
							Count: <span f-text="count"></span>
							<button class="secondary" f-on="click handleListItemIncrementCountClick" data-id={{id}}>+</button>
						</div>
						<div>
							<button class="secondary" f-on="click handleMoveItemUpClick" data-id={{id}}>
								<i class="fas fa-chevron-up"></i>
							</button>
							<button class="secondary" f-on="click handleMoveItemDownClick" data-id={{id}}>
								<i class="fas fa-chevron-down"></i>
							</button>
							<button class="secondary" f-on="click handleListItemRemoveClick" data-id={{id}}>
								<i class="fas fa-trash"></i>
							</button>
						</div>
					</div>

					<div style="padding: 4px; margin-top: 4px; background-color: #f5f5f5; border-radius: 4px;">
						<div>
							<div style="border-radius: 4px; background-color: #fff;">
								{{#list tags}}
									<div style="padding: 8px 4px; font-size: 14px;">
										<div>{{name}}</div>
									</div>
								{{/list}}
							</div>
						</div>

						<div style="display: flex; margin-top: 4px;">
							<input type="text" placeholder="New item name..." f-value="new_tag_name" style="padding: 0 4px; flex: 1; border: none; margin-right: 4px;" />
							<button class="secondary" f-on="click handleAddItemTagClick" data-id="{{id}}">Add</button>
						</div>
					</div>
				</div>
			{{/list}}
		</div>

		<div class="flex-row">
			<input type="text" f-value="new_item_name" f-on="keydown handleNameFieldKeypress,focus handleNameFieldFocus" f-ref="name_field" />
			<button class="button" f-on="click handleAddItemClick">Add item</button>
			<button class="button" f-on="click handleSetItemsClick">Set items</button>
			<div style="flex: 1;"></div>
			<button class="button" f-on="click render">Re-render</button>
		</div>
	`;

});