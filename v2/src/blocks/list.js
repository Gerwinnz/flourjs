

flour.block.add('list', function(block, state, view)
{
	var el = block.el;
	var key = block.key;
	var html = block.html;
	var items = {};
	var listItems = state.get(key);



	var cleanup = state.onChange(key, function(event)
	{
		if(event.type === 'add')
		{
			var itemState = flour.state(event.item);
			var itemTemplate = flour.template.parse(block.html, itemState, view);

			items[event.item.id] = {
				el: itemTemplate.fragment.firstElementChild,
				state: itemState
			};

			block.el.appendChild(itemTemplate.fragment);
		}

		if(event.type === 'remove')
		{
			if(items[event.item.id])
			{
				items[event.item.id].el.remove();
				items[event.item.id] = null;
			}
		}

		if(event.type === 'update')
		{
			if(items[event.item.id])
			{
				items[event.item.id].state.set(event.itemKey, event.itemValue);
			}
		}
	});



	listItems.forEach((item) => 
	{
		var itemState = flour.state(item);
		var itemTemplate = flour.template.parse(html, itemState, view);

		items[item.id] = {
			el: itemTemplate.fragment.firstElementChild,
			state: itemState
		};

		el.appendChild(itemTemplate.fragment);
	});



	return cleanup;
});

