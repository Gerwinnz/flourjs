
window.__vehicles = flour.state();

setTimeout(function()
{
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
}, 500);


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

		if(!vehicles)
		{
			return;
		}

		view.state.set('vehicles', vehicles.filter((item) => 
		{
			return item.type === type
		}));
	};

	view.templateHTML = 
	`
		<div>
			<h4>List of <span f-text="type"></span>s</h4>

			<div>
				{{#list vehicles}}
					<div>
						<vehicle-item vehicle-id="{{id}}"></vehicle-item>
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





flour.view.add('vehicle_item', function()
{
	const view = this;

	view.init = function(params)
	{
		const vehicleId = params['vehicle-id'];
		const vehicleItem = __vehicles.getItem('vehicles', vehicleId);
		view.state.set('name', vehicleItem.value.name);	
	};

	view.templateHTML = 
	`
		<div>
			<span f-text="name"></span>
		</div>
	`;
})

flour.customElement.add('vehicle-item', {
	view: 'vehicle_item',
	attributes: ['vehicle-id']
});