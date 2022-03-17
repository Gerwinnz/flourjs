
flour.view.add('block_list_perf', function()
{
	var view = this;
	var itemId = 0;
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

		view.state.set('items', []);
	};


	view.handleAddItemsClick = function(event, element)
	{
		var count = parseInt(element.getAttribute('data-count'));
		var items = view.state.get('items');
		const t0 = performance.now();

		for (let i = 0; i < count; i ++)
		{
			itemId ++;
			items.push({
				id: itemId,
				name: itemId + '_item'
			});
		}

		view.state.set('items', items);
		
		const t1 = performance.now();
		view.state.set('task_time', t1 - t0);
		view.state.set('task', 'Adding ' + count + ' items');

	};

	view.handleUpdateItemClick = function(event, element)
	{
		const t0 = performance.now();
		
		var item = view.state.getItem('items', 2);
		item.update('name', 'Hello there!');

		const t1 = performance.now();
		view.state.set('task_time', t1 - t0);
		view.state.set('task', 'Updating name on item 2');
	}



	/*
	|
	|	Template
	|
	*/
	view.templateHTML = `
		<div>
			<p>There are <span f-text="items_count"></span> items.</p>
			
			{{#if task_time}}
				<p><span f-text="task"></span> took <span f-text="task_time"></span> milliseconds.</p>
			{{/if}}

			<div class="form__line">
				<button f-on="click handleAddItemsClick" data-count="250">Add 250 items</button>
				<button f-on="click handleAddItemsClick" data-count="500">Add 500 items</button>
				<button f-on="click handleAddItemsClick" data-count="1000">Add 1000 items</button>
			</div>

			<div class="form__line">
				<button f-on="click handleUpdateItemClick">Update item 2</button>
			</div>
		</div>
		
		<div style="padding: 8px 0;">
			{{#list items}}
				<div style="padding: 8px; background-color: #fff; margin:  8px 0; border-radius: 8px;">
					{{id}}: <span f-text="name"></span>
				</div>
			{{/list}}
		</div>
	`;

});