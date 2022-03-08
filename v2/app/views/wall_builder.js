
flour.view.add('wall_builder', function()
{
	var view = this;

	

	//
	// Init
	//
	view.init = function()
	{
		view.state.set('batton_spacing', 300);
		view.state.set('batton_width', 40);
	};


	// Output
	view.templateHTML = 
	`
		<style>
			.global-options{
				display: flex;
				position: sticky;
				top: 8px;
				padding:  16px;
				background-color: #fff;
				border-radius: 8px;
				z-index: 10;
				box-shadow: 0 4px 16px rgba(0,0,0,.1);
			}

			.global-options .form__line{
				margin: 0 16px 0 0;
			}
		</style>

		<div class="global-options">
			<div class="form__line">
				<label>Batton spacing</label>
				<input type="number" min="120" f-value="batton_spacing" />
			</div>
			<div class="form__line">
				<label>Batton width</label>
				<input type="number" min="20" f-value="batton_width" />
			</div>
		</div>

		<div>
			<hall-wall width="2150" batton_spacing="{batton_spacing}" batton_width="{batton_width}" studs="130,515,904,1254,1713"></hall-wall>
			<hall-wall width="2545" batton_spacing="{batton_spacing}" batton_width="{batton_width}" studs="448,918,1366,1824,2294"></hall-wall>
			<hall-wall width="3190" batton_spacing="{batton_spacing}" batton_width="{batton_width}" studs="370,836,1294,1744,2200,2658,2813"></hall-wall>
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
		var offset = parseInt(view.state.get('offset'));
		var battonCount = Math.floor(width / battonSpacing);
		var leftOver = (width - (battonSpacing * (battonCount - 1))) / 2; //(width % battonSpacing) / 2;

		console.log('offset', offset);

		var leftFirstCSS = (leftOver + offset) / scale;
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

	var setStuds = function(event)
	{
		var rawValues = event.value.split(',');
		var studs = [];
		var width = 50 / scale;

		for(var i = 0, n = rawValues.length; i < n; i ++)
		{
			studs.push({
				id: i,
				width: width + 'px',
				margin_left: (0 - (width / 2)) + 'px',
				left: (rawValues[i] / scale) + 'px'
			});
		}

		view.state.set('stud_items', studs);
	};

	view.init = function()
	{
		view.state.onChange('wainscote_height, batton_height, batton_width, rail_height, wall_height, width', setCssValue);
		
		view.state.set('wainscote_height', 800);
		view.state.set('batton_spacing', 400);
		view.state.set('batton_width', 40);
		view.state.set('rail_height', 115);
		view.state.set('wall_height', 1200);
		view.state.set('stud_items', []);
		view.state.set('ply_width', (1200 / scale) + 'px');
		view.state.set('offset', 0);

		view.state.onChange('batton_spacing, batton_width, offset', setBattons);
		view.state.onChange('studs', setStuds);
	}

	view.attributeChanged = function(attribute, value)
	{
		view.state.set(attribute, value);
	};

	view.handleMouseMove = function(event, el)
	{
		view.state.set('mouse_x', (event.pageX - el.offsetLeft) + 'px');
	};

	view.templateHTML = 
	`
		<style>
			.wall-details{
				margin-top:  32px;
				font-size: 12px;
			}

			.wall{
				overflow: hidden;
				position: relative;
				background-color: #ddd;
				margin-top: 20px;
			}

			.wall-options{
				padding: 8px;
				border-radius: 4px;
			}

			.stud{
				position: absolute;
				top: 0;
				bottom: 0;
				background-color: #55555510;
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
				right: 8px;
				text-align: right;
				font-size:  10px;
			}

			.plywood{
				position: absolute;
				top: 0px;
				bottom: 0px;

				border-left: solid 1px #f00;
				border-right: solid 1px #f00;
			}

			.form__line{

			}

			.form__line label{
				display: block;
				font-size: 12px;
			}
		</style>

		<div class="wall-details"><span f-text="width"></span>mm</div>
		<div class="wall" f-style="width width_css, height wall_height_css" f-on="mousemove handleMouseMove">
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

			{{#list stud_items}}
				<div class="stud" f-style="left left, width width, marginLeft margin_left"></div>
			{{/list}}

			<div class="plywood" f-style="width ply_width, left mouse_x"></div>
		</div>

		<div class="wall-options">
			<div class="form__line">
				<label>Left offset</label>
				<input type="number" f-value="offset" />
			</div>
		</div>
	`;
})


flour.customElement.add('hall-wall', {
	view: 'wall',
	shadow: true,
	props: ['batton_spacing', 'batton_width', 'width', 'studs']
});