

flour.view.add('alert', function()
{
	var view = this;

	var levels = {
		'error': {className: 'icon--error', icon: '!'},
		'warning': {className: 'icon--warning', icon: '!'},
		'info': {className: 'icon--info', icon: 'i'}
	};
	

	view.init = function(params)
	{
		params = params || {};
		
		view.state.onChange('level', function(event)
		{
			view.state.set('icon_class', levels[event.value].className);
			view.state.set('icon_text', levels[event.value].icon);
		});

		view.state.set('level', params.level || 'info');
		view.state.set('title', params.title || '');	
	};


	view.attributeChanged = function(name, value)
	{
		view.state.set(name, value);
	};



	view.templateHTML = 
	`
		<style>
			.alert{
				background-color: #fff;
				padding: 16px;
				margin: 16px 0;
				border-radius: 8px;
				box-shadow: 0 4px 8px rgba(0,0,0,.05);
			}

			.alert__extra{
				margin-top:  16px;
				font-size:  12px;
			}

			.alert__header{
				display: flex;
				line-height: 32px;
			}

			.alert__title{
				font-size:  18px;
				font-weight: bold;
			}

			.icon{
				width: 32px;
				height: 32px;
				text-align: center;
				line-height: 32px;
				font-weight: bold;
				border-radius: 16px;
				margin-right:  8px;
			}

			.icon--info{
				background-color: #4885E0;
				color: #fff;
			}

			.icon--error{
				background-color: #D16666;
				color: #fff;
			}

			.icon--warning{
				background-color: #F1B823;
				color: 333;
			}
		</style>

		<div class="alert">
			<div class="alert__header">
				<div class="icon" f-class="icon_class" f-text="icon_text"></div>
				<span class="alert__title" f-text="title"></span>
			</div>

			<div class="alert__extra">
				<slot></slot>
			</div>
		</div>
	`;

});



flour.customElement.add('alert-box', {
	view: 'alert',
	shadow: true,
	attributes: ['level', 'title']
});