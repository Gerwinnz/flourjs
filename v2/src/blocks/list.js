

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
		var itemId = event.item.id;

		if(event.type === 'insertItem')
		{
			var itemState = flour.state(event.item);
			var itemTemplate = flour.template.parse(block.html, itemState, view);

			items[event.item.id] = {
				el: itemTemplate.fragment.firstElementChild,
				state: itemState
			};

			itemState.onChange(function(event)
			{
				console.log(event);
			});

			el.appendChild(itemTemplate.fragment);
		}

		if(event.type === 'removeItem')
		{
			if(items[itemId])
			{
				items[itemId].el.remove();
				items[itemId] = null;
			}
		}

		if(event.type === 'updateItem')
		{
			if(items[itemId])
			{
				items[itemId].state.set(event.itemKey, event.itemValue);
			}
		}

		if(event.type === 'update')
		{
			listItems = event.value;
			renderListItems();
		}
	});



	var renderListItems = function()
	{
		items = {};
		el.innerHTML = '';

		listItems.forEach((item) => 
		{
			var itemState = flour.state(item);
			var itemTemplate = flour.template.parse(html, itemState, view);

			// itemState.onChange(function(event)
			// {
			// 	console.log('item state change', event);
			// });

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

