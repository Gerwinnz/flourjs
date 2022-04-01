
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

		view.state.set('add_count', 500);
		view.state.set('insert_index', 0);
		view.state.set('insert_at', 'end');
		view.state.set('method', 'set');
		view.state.set('items', []);
	};


	view.handleAddItemsClick = function(event, element)
	{
		var method = view.state.get('method');
		var addCount = parseInt(view.state.get('add_count'));
		var newItems = [];
		var insertAt = view.state.get('insert_at');
		var insertIndex = parseInt(view.state.get('insert_index'));
		const t0 = performance.now();

		updatesCount ++;


		for (let i = 0; i < addCount; i ++)
		{
			itemId ++;
			newItems.push({
				id: itemId,
				name: itemId + '_item',
				batch: updatesCount
			});
		}

		if(method === 'set')
		{
			var items = view.state.get('items');
			
			if(insertAt === 'end')
			{
				items = items.concat(newItems);
			}
			else
			{
				items.splice.apply(items, [insertIndex, 0].concat(newItems));
			}

			view.state.set('items', items);
		}


		if(method === 'insert')
		{
			var insertIndex = 0;
			
			if(insertAt === 'end')
			{
				insertIndex = undefined;
			}

			if(insertAt === 'custom')
			{
				insertIndex = parseInt(view.state.get('insert_index'));
			}

			view.state.insertItems('items', newItems, insertIndex);
		}


		const t1 = performance.now();
		view.state.set('task_time', Math.round(t1 - t0));
		view.state.set('task', 'Adding ' + addCount + ' items using ' + method + ' method');
	};

	view.handleUpdateItemClick = function(event, element)
	{
		const t0 = performance.now();
		
		var item = view.state.getItem('items', 2);
		item.update('name', 'Hello there!');

		const t1 = performance.now();
		view.state.set('task_time', Math.round(t1 - t0));
		view.state.set('task', 'Updating name on item 2');
	}



	/*
	|
	|	Template
	|
	*/
	view.templateHTML = `
		<div>
			<div style="display: flex;">
				<div class="form__line" style="flex: 1;">
					<label>Method</label>
					<div>
						<input id="method_set" type="radio" name="method" value="set" f-value="method" />
						<label for="method_set">Set</label>
					</div>
					<div>
						<input id="method_insert" type="radio" name="method" value="insert" f-value="method" />
						<label for="method_insert">Insert items</label>
					</div>
				</div>

				<div class="form__line" style="flex: 1;">
					<label>Insert at</label>
					<div>
						<input id="insert_start" type="radio" name="insert_at" value="start" f-value="insert_at" />
						<label for="insert_start">Start</label>
					</div>
					<div>
						<input id="insert_end" type="radio" name="insert_at" value="end" f-value="insert_at" />
						<label for="insert_end">End</label>
					</div>
					<div>
						<input id="insert_custom" type="radio" name="insert_at" value="custom" f-value="insert_at" />
						<label for="insert_custom">Custom</label>
					</div>
					{{#if insert_at == 'custom'}}
						<div>
							<input type="text" f-value="insert_index" />
						</div>
					{{/if}}
				</div>
			</div>

			<hr />

			<div class="form__line">
				<input type="text" f-value="add_count" /> 
				<button f-on="click handleAddItemsClick">Add</button>
			</div>
		</div>
		
		<hr />

		<p>
			<span>There are <span f-text="items_count"></span> items.</span>
			{{#if task_time}}
				<span f-text="task"></span> took <span f-text="task_time"></span> milliseconds.
			{{/if}}
		</p>

		<table style="width: 100%; margin-top: 32px;">
			<thead>
				<tr>
					<th>Id</th>
					<th>Name</th>
				</tr>
			</thead>
			<tbody>
				{{#list items}}
					<tr>
						<td style="padding: 8px; border-top: solid 1px #ddd;">{{id}}</td>
						<td style="padding: 8px; border-top: solid 1px #ddd;"><span f-text="name"></span></td>
					</tr>
				{{/list}}
			</tbody>
		</table>
	`;

});