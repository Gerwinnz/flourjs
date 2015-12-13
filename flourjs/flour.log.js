
var flour = flour || {};

/*
| ------------------------------------------------------------------------------------------------------------------------------
|
|	Main console view
|
| ------------------------------------------------------------------------------------------------------------------------------
*/
flour.addTemplate('flour_log', 
	'<div class="flour-log">' + 
	'  <div class="flour-log-toggle">Log</div>' + 
	'  <div class="flour-log-console">' +
	'		 <div class="flour-log-tabs">' +
	'      <div class="flour-log-tab flour-log-tab-active" data-tab="console">Console</div>' + 
	'      <div class="flour-log-tab" data-tab="views">Views <span class="flour-log-tab-stat" flour-text="view_count"></span></div>' + 
	'      <div class="flour-log-tab" data-tab="store">Store</div>' + 
	'    </div>' + 

	'		 <div class="flour-log-panes">' +
	'      <div class="flour-log-pane" data-tab="console" flour-view="consoleView"></div>' + 
	'      <div class="flour-log-pane" data-tab="views" flour-view="viewsView"></div>' + 
	'      <div class="flour-log-pane" data-tab="store" flour-view="storeView"></div>' + 
	'    </div>' + 
	'  </div>' + 
	'</div>'
);

flour.addView('flour_log', function()
{

	var view = this;

	// view params
	view.template = 'flour_log';
	view.events = {
		'click .flour-log-tab': 'setTabEvent'
	};

	// privates
	var currentTab = 'console';
	var $tabs = false;
	var $panes = false;

	// children views
	view.consoleView = false;
	view.viewsView = false;
	view.storeView = false;


	// init
	view.init = function()
	{
		view.el.removeClass('flour-view');
		view.consoleView = view.getView('flour_log_console', {});
		view.viewsView = view.getView('flour_log_views', {});
		view.storeView = view.getView('flour_log_store', {});

		view.set('view_count', 2);
		view.render();
	};

	view.postRender = function()
	{
		$tabs = view.find('.flour-log-tab');
		$panes = view.find('.flour-log-pane');
		view.setTab(currentTab);
	};



	//
	// set current tab on click
	//
	view.setTabEvent = function(event, el)
	{
		view.setTab(el.data('tab'));
	};



	//
	// set tab
	//
	view.setTab = function(tabName)
	{
		currentTab = tabName;
		$tabs.removeClass('flour-log-tab-active');
		$panes.removeClass('flour-log-pane-active');

		$.each($tabs, function(index, tab)
		{
			var $tab = $(tab);
			if($tab.data('tab') === currentTab)
			{
				$tab.addClass('flour-log-tab-active');
			}
		});

		$.each($panes, function(index, pane)
		{
			var $pane = $(pane);
			if($pane.data('tab') === currentTab)
			{
				$pane.addClass('flour-log-pane-active');
			}
		});
	};


	//
	//	log
	//
	view.log = function(data, type)
	{
		view.consoleView.log(data, type);
	};

});



















/*
| ------------------------------------------------------------------------------------------------------------------------------
|
|	Log
|
|	------------------------------------------------------------------------------------------------------------------------------
*/
flour.addTemplate('flour_log_console', 
	'<div>' + 
	'  <div flour-view="consoleList">' +
	'  </div>' + 
	'</div>'
);

flour.addView('flour_log_console', function()
{

	var view = this;

	// view params
	view.template = 'flour_log_console';
	view.events = {};

	view.consoleList = false;

	// init
	view.init = function()
	{
		view.consoleList = view.getList('flour_log_console_list');
		view.el.removeClass('flour-view');
		view.render();
	};

	//
	// log
	//
	view.log = function(data, type)
	{
		var params = {
			data: data,
			type: type
		};

		if(flour.isObject(data))
		{
			params.is_object = true;
			params.data = flour.filters['json_format'](data);
		}

		view.consoleList.add(params);
	};

});





















/*
| ------------------------------------------------------------------------------------------------------------------------------
|
|	Log list
|
|	------------------------------------------------------------------------------------------------------------------------------
*/

flour.addTemplate('flour_log_console_item', 
	'<div class="flour-log-console-item-inner">' + 
	'  {{#if is_object }}' + 
	'    <pre>{{ data }}</pre>' +
	'  {{else}}' +
	'    {{ data }}' + 
	'  {{/if}}' +
	'</div>'
);

flour.addList('flour_log_console_list', function()
{

	var list = this;

	// list params
	list.template = 'flour_log_console_item';
	list.itemElClass = 'flour-log-console-item';

	// init
	list.init = function()
	{
		list.el.removeClass('flour-list');
	};

});















/*
| ------------------------------------------------------------------------------------------------------------------------------
|
|	Views
|
| ------------------------------------------------------------------------------------------------------------------------------
*/
flour.addTemplate('flour_log_views', 
	'<div>' + 
	'  <div>' +
	'		 VIEWS!' + 
	'  </div>' + 
	'</div>'
);

flour.addView('flour_log_views', function()
{

	var view = this;

	// view params
	view.template = 'flour_log_views';
	view.events = {};

	// init
	view.init = function()
	{
		view.el.removeClass('flour-view');
		view.render();
	};

});

















/*
| ------------------------------------------------------------------------------------------------------------------------------
|
|	Store
|
| ------------------------------------------------------------------------------------------------------------------------------
*/
flour.addTemplate('flour_log_store', 
	'<div>' + 
	'  <div>' +
	'		 STORE!' + 
	'  </div>' + 
	'</div>'
);

flour.addView('flour_log_store', function()
{

	var view = this;

	// view params
	view.template = 'flour_log_store';
	view.events = {};

	// init
	view.init = function()
	{
		view.el.removeClass('flour-view');
		view.render();
	};

});




















flour.logView = flour.getView('flour_log');
flour.log = function(data, type)
{
	flour.logView.log(data, type);
};

$(function(){ 
	$('body').append(flour.logView.el); 

	setTimeout(function(){
		flour.log('Welcome, to flour console.');
	}, 2000);
});








