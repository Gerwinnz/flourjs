
flour.view.add('wall_builder', function()
{
	var view = this;

	

	//
	// Init
	//
	view.init = function()
	{
		view.state.set('batton_distance', 420);
	};


	// Output
	view.templateHTML = 
	`
		<h1>Wall builder</h1>
		<div class="form__line">
			<label>Batton distance</label>
			<input type="number" f-value="batton_distance" />
		</div>

		<div>
			<h2>Walls</h2>
			<hall-wall width="2150" batton_distance="{batton_distance}"></hall-wall>
			<hall-wall width="2545" batton_distance="{batton_distance}"></hall-wall>
			<hall-wall width="3190" batton_distance="{batton_distance}"></hall-wall>
		</div>
	`;

});


flour.view.add('wall', function()
{
	var view = this;
	var scale = 5;

	view.attributeChanged = function(attribute, value)
	{
		if(attribute === 'width')
		{
			view.state.set('width', value);
			view.state.set('width_css', value ? ((value / scale) + 'px') : 1000);
		}		

		if(attribute === 'batton_distance')
		{
			var width = view.state.get('width') || 100;
			var battonCount = Math.ceil(width / value);
			var leftOver = width % value / 2;

			var leftFirstCSS = leftOver / scale;
			var leftCSS = value / scale;

			var battons = [];
			for(var i = 0; i < battonCount; i ++)
			{
				battons.push({
					id: i,
					left: (i === 0 ? leftOver : value),
					margin_left: (i === 0 ? leftFirstCSS : leftCSS) + 'px'
				});
			}

			view.state.set('battons', battons);
		}
	};


	view.templateHTML = 
	`
		<style>
			.wall-details{
				font-size: 12px;
			}

			.wall{
				height: 160px;
				border-radius: 4px;
				background-color: #fff;
				border: solid 1px #bbb;
				margin-bottom: 20px;
				margin-left:  60px;
			}

			.batton-mark{
				width: 0px;
				height: 160px;
				float: left;
				position: relative;
			}

			.batton{
				position: absolute;
				top: 0;
				left: -2px;
				width: 4px;
				height: 160px;
				background-color: #eee;
				border-left: solid 1px #bbb;
				border-right: solid 1px #bbb;
			}

			.space-info{
				position: absolute;
				top: 10px;
				right: 10px;
				text-align: right;
				font-size:  11px;
			}
		</style>

		<div class="wall-details"><span f-text="width"></span>mm</div>
		<div class="wall" f-style="width width_css">
			{{#list battons}}
				<div class="batton-mark" f-style="marginLeft margin_left">
					<div class="batton"></div>
					<div class="space-info"><span f-text="left"></span>mm</div>
				</div>
			{{/list}}
		</div>
	`;
})


flour.customElement.add('hall-wall', {
	view: 'wall',
	shadow: true,
	props: ['batton_distance', 'width']
});