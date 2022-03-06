
flour.view.add('wall_builder', function()
{
	var view = this;

	

	//
	// Init
	//
	view.init = function()
	{
		view.state.set('batton_spacing', 400);
		view.state.set('batton_width', 400);
	};


	// Output
	view.templateHTML = 
	`
		<h3>Battons</h3>
		<div class="form__line">
			<label>Batton spacing</label>
			<input type="number" f-value="batton_spacing" />
		</div>
		<div class="form__line">
			<label>Batton width</label>
			<input type="number" f-value="batton_width" />
		</div>

		<div>
			<h2>Walls</h2>
			<hall-wall width="2150" batton_spacing="{batton_spacing}"></hall-wall>
			<hall-wall width="2545" batton_spacing="{batton_spacing}"></hall-wall>
			<hall-wall width="3190" batton_spacing="{batton_spacing}"></hall-wall>
		</div>
	`;

});


flour.view.add('wall', function()
{
	var view = this;
	var scale = 5;

	var setCssValue = function(event)
	{
		view.state.set(event.key + '_css', (event.value / 5) + 'px');

		if(event.key === 'rail_height' || event.key === 'wainscote_height')
		{
			var battonHeight = view.state.get('wainscote_height') - view.state.get('rail_height');
			view.state.set('batton_height', battonHeight);
		}
	};

	var setBattons = function(event)
	{
		view.state.set(event.key, event.value);

		var battons = [];
		var battonSpacing = view.state.get('batton_spacing');
		var width = view.state.get('width') || 100;
		var battonCount = Math.ceil(width / battonSpacing);
		var leftOver = width % battonSpacing / 2;

		var leftFirstCSS = leftOver / scale;
		var leftCSS = battonSpacing / scale;

		for(var i = 0; i < battonCount; i ++)
		{
			battons.push({
				id: i,
				left: (i === 0 ? leftOver : battonSpacing),
				width: view.state.get('batton_width_css'),
				margin_left: (i === 0 ? leftFirstCSS : leftCSS) + 'px'
			});
		}

		view.state.set('battons', battons);
	}

	view.init = function()
	{
		view.state.onChange('wainscote_height', setCssValue);
		view.state.onChange('batton_height', setCssValue);
		view.state.onChange('batton_width', setCssValue);
		view.state.onChange('rail_height', setCssValue);
		view.state.onChange('wall_height', setCssValue);
		view.state.onChange('width', setCssValue);

		view.state.set('wainscote_height', 800);
		view.state.set('batton_spacing', 400);
		view.state.set('batton_width', 40);
		view.state.set('rail_height', 115);
		view.state.set('wall_height', 2400);

		view.state.onChange('batton_spacing', setBattons);
		view.state.onChange('batton_width', setBattons);
	}

	view.attributeChanged = function(attribute, value)
	{
		view.state.set(attribute, value);
	};


	view.templateHTML = 
	`
		<style>
			.wall-details{
				font-size: 12px;
			}

			.wall{
				position: relative;
				background-color: #ddd;
				margin-left:  60px;
				margin-bottom: 20px;
			}

			.wainscote{
				position: absolute;
				bottom: 0;
				background-color: #fff;
				border: solid 1px #bbb;
				box-sizing: border-box;
			}

			.rail{
				height: 15px;
				background-color: #fff;
				box-sizing: border-box;
			}

			.rail--top{
				border-bottom: solid 1px #bbb;
			}

			.rail--bottom{
				border-top: solid 1px #bbb;
			}


			.battons{
				
			}

			.batton-mark{
				width: 0px;
				height: 100%;
				float: left;
				position: relative;
			}

			.batton{
				position: absolute;
				top: 0;
				bottom: 0;
				left: 0;
				width: 4px;
				background-color: #eee;
				border-left: solid 1px #bbb;
				border-right: solid 1px #bbb;
				box-sizing: border-box;
				transform: translate3d(-50%, 0, 0);
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
		<div class="wall" f-style="width width_css, height wall_height_css">
			<div class="wainscote" f-style="width width_css">
				<div class="rail rail--top"></div>
				<div class="battons" f-style="height batton_height_css">
					{{#list battons}}
						<div class="batton-mark" f-style="marginLeft margin_left">
							<div class="batton" f-style="width width"></div>
							<div class="space-info"><span f-text="left"></span>mm</div>
						</div>
					{{/list}}
				</div>
				<div class="rail rail--bottom"></div>
			</div>
		</div>
	`;
})


flour.customElement.add('hall-wall', {
	view: 'wall',
	shadow: true,
	props: ['batton_spacing', 'width']
});