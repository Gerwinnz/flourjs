

flour.view.add('card', function()
{
	var view = this;
	

	view.init = function(params)
	{
		params = params || {};
		view.state.set('name', params.name);
		view.state.set('id', this.id);
	};


	view.attributeChanged = function(name, value)
	{
		view.state.set(name, value);
	};

	view.slotChanged = function(slot)
	{
		
	};

	view.handleNameClick = function()
	{
		view.state.set('name', view.state.get('name') + ' - clicked!!');
	};


	view.templateHTML = 
	`
		<style>
			.card{
				background-color: #fff;
				padding: 16px;
				margin: 16px 0;
				border-radius: 8px;
				box-shadow: 0 4px 8px rgba(0,0,0,.05);
			}

			.card__extra{
				margin-top:  8px;
				font-size:  12px;
			}
		</style>

		<div class="card">
			{{#if name}}
				<div>
					<span f-text="name" on-click="handleNameClick"></span>
				</div>
			{{/if}}
			<div class="card__extra">
				<slot name="extra">No extra details</slot>
			</div>
		</div>
	`;

});



flour.customElement.add('card-box', {
	view: 'card',
	shadow: true,
	props: ['name']
});