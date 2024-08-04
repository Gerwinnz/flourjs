
window.__vehicles = flour.state();
window.__vehicles.set('cars', 
[
	{
		id: 1,
		name: 'WRX'	
	},
	{
		id: 2,
		name: 'Mazda 9'	
	},
	{
		id: 3,
		name: 'Lancer'	
	}
]);

window.__vehicles.set('utes', 
[
	{
		id: 1,
		name: 'Triton'	
	},
	{
		id: 2,
		name: 'D-Max'	
	},
	{
		id: 3,
		name: 'Hilux'	
	}
]);


flour.view.add('two_lists', function()
{
	const view = this;

	view.templateHTML = 
	`
		<div>
			<h2>Welcome to our listings</h2>
			<div>
				<vehicles-list type="cars"></vehicles-list>
				<vehicles-list type="utes"></vehicles-list>
			</div>
		</div>
	`;
});




flour.view.add('vehicles_list', function()
{
	const view = this;

	view.init = function(params)
	{
		view.state.set('type', params.type);

		view.listen(__vehicles, params.type, (event) => {
			view.state.set('items', event.value);
		}, { immediate: true });
	};

	view.templateHTML = 
	`
		<div>
			<h4>List of <span f-text="type"></span></h4>

			<div>
				{{#list items}}
					<div>
						<span f-text="name"></span>
					</div>
				{{/list}}
			</div>
		</div>
	`;
});

flour.customElement.add('vehicles-list', {
	view: 'vehicles_list',
	attributes: ['type']
});