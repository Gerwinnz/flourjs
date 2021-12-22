

flour.view.add('card', function()
{
	var view = this;
	view.templateHTML = `
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
			<div>
				<span f-text="name" on-click="handleNameClick"></span>
			</div>
			<div class="card__extra">
				<slot name="extra">No extra details</slot>
			</div>
		</div>
	`;


	/*
	|
	|	Init
	|
	*/
	view.init = function(params)
	{
		params = params || {};
		view.state.set('name', params.name);
		view.state.set('id', this.id);

		view.render();
	};



	view.attributeChanged = function(name, value)
	{
		console.log(name, value);
		view.state.set(name, value);
	};



	view.handleNameClick = function()
	{
		view.state.set('name', view.state.get('name') + ' - clicked!!');
	};

});



flour.customElement.add('card-box', {
	view: 'card',
	shadow: true,
	props: ['name']
});