
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

window.__vehicles.set('vehicles', 
[
	{
		id: 1,
		name: 'WRX',
		type: 'car'
	},
	{
		id: 2,
		name: 'Mazda 9',
		type: 'car'
	},
	{
		id: 3,
		name: 'Lancer',
		type: 'car'
	},
	{
		id: 4,
		name: 'Triton',
		type: 'ute'
	},
	{
		id: 5,
		name: 'D-Max',
		type: 'ute'
	},
	{
		id: 6,
		name: 'Hilux',
		type: 'ute'
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
				<vehicles-list type="car"></vehicles-list>
				<vehicles-list type="ute"></vehicles-list>
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
		view.listen(__vehicles, 'vehicles', showVehicles, { immediate: true });
	};

	function showVehicles()
	{
		const type = view.state.get('type');
		const vehicles = __vehicles.get('vehicles');

		view.state.set('items', vehicles.filter((item) => 
		{
			return item.type === type
		}));
	};

	view.templateHTML = 
	`
		<div>
			<h4>List of <span f-text="type"></span>s</h4>

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