

flour.block.add('list', function(block, state, view)
{
	var el = block.el.parentElement;
	var key = block.key;
	var html = block.html;
	var items = {};
	var listItems = state.get(key);

	block.el.remove();


	var cleanup = state.onChange(key, function(event)
	{
		
		if(event.type === 'insertItem')
		{
			console.log('list::insert_item', event);
			var itemId = event.item.id;
			var itemState = flour.state(event.item);
			var itemTemplate = flour.template.parse(block.html, itemState, view);

			items[event.item.id] = {
				el: itemTemplate.fragment.firstElementChild,
				state: itemState
			};

			itemState.onChange(function(event)
			{
				console.log('list::item_state_changed');
				console.log(' ');
				state.getItem(key, itemId).update(event.key, event.value);
			});

			if(event.index === 0)
			{
				el.prepend(itemTemplate.fragment);
			}
			else if(event.index <= listItems.length - 1)
			{
				el.insertBefore(itemTemplate.fragment, items[listItems[event.index].id].el);
			}
			else
			{
				el.append(itemTemplate.fragment);
			}
		}

		if(event.type === 'removeItem')
		{
			console.log('list::remove_item');
			var itemId = event.item.id;
			if(items[itemId])
			{
				items[itemId].el.remove();
				items[itemId] = null;
			}
		}

		if(event.type === 'updateItem')
		{
			var itemId = event.item.id;
			if(items[itemId])
			{
				for(var i = 0, n = event.keys.length; i < n; i ++)
				{
					console.log('list::update_item', event.keys[i] + ' to ' + event.values[i]);
					items[itemId].state.set(event.keys[i], event.values[i]); // TODO store some sort of change ID and ignore the state change if it's the same?
				}
			}
		}

		listItems = event.value;

		if(event.type === 'update')
		{
			console.log('list::update');
			renderListItems();
		}
	});



	var renderListItems = function()
	{
		items = {};
		el.innerHTML = '';

		listItems.forEach((item) => 
		{
			var itemId = item.id;
			var itemState = flour.state(item);
			var itemTemplate = flour.template.parse(html, itemState, view);

			itemState.onChange(function(event)
			{
				console.log('list::item_state_changed');
				console.log(' ');
				state.getItem(key, itemId).update(event.key, event.value);
			});

			items[item.id] = {
				el: itemTemplate.fragment.firstElementChild,
				state: itemState
			};

			el.appendChild(itemTemplate.fragment);
		});
	}


	if(listItems && listItems.length > 0)
	{
		renderListItems();
	}


	return cleanup;
});

