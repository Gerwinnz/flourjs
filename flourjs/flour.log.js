
var flour = flour || {};


/*
| ------------------------------------------------------------------------------------------------------------------------------
|
|	Main console view
|
| ------------------------------------------------------------------------------------------------------------------------------
*/
flour.addTemplate('flour_log', 
	'<div class="flour-log-toggle"></div>' + 
	'<div class="flour-log-console">' +
	'	 <div class="flour-log-tabs">' +
	'    <div class="flour-log-tab flour-log-tab-active" data-tab="console">Console</div>' + 
	'    <div class="flour-log-tab" data-tab="views">Views <span class="flour-log-tab-stat" flour-text="view_count"></span></div>' + 
	'    <div class="flour-log-tab" data-tab="store">Store <span class="flour-log-tab-stat" flour-text="store_count"></span></div>' + 
	'  </div>' + 

	'  <div class="flour-log-panes">' +
	'    <div class="flour-log-pane" data-tab="console" flour-view="consoleView"></div>' + 
	'    <div class="flour-log-pane" data-tab="views" flour-view="viewsView"></div>' + 
	'    <div class="flour-log-pane" data-tab="store" flour-view="storeView"></div>' + 
	'  </div>' + 
	'</div>'
);

flour.addView('flour_log', function()
{

	var view = this;

	// view params
	view.template = 'flour_log';
	view.events = {
		'click .flour-log-tab': 'setTabEvent',
		'click .flour-log-toggle': 'toggleConsole'
	};

	// privates
	var currentTab = 'console';
	var $tabs = false;
	var $panes = false;

	// children views
	view.consoleView = false;
	view.viewsView = false;
	view.storeView = false;


	//
	// init
	//
	view.init = function()
	{
		view.el.removeClass('flour-view');
		view.el.addClass('flour-log');

		view.consoleView = view.getView('flour_log_console', {});
		view.storeView = view.getView('flour_log_store', {});
		view.viewsView = view.getView('flour_log_views', {});

		view.viewsView.on('updateViewCount', function(viewCount)
		{
			view.set('view_count', viewCount, false);
		});

		view.storeView.on('updateStoreCount', function(storeCount)
		{
			view.set('store_count', storeCount, false);
		});

		view.set('store_count', 0, false);
		view.set('view_count', 0, false);

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
	// open close console
	//
	view.toggleConsole = function()
	{
		view.el.toggleClass('open');
	};


	//
	// log
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


	//
	// init
	//
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


	//
	// init
	//
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
	'  <div flour-view="viewList"></div>' + 
	'</div>'
);

flour.addView('flour_log_views', function()
{

	var view = this;

	// view params
	view.template = 'flour_log_views';
	view.events = {};

	// privates
	var viewCount = 0;


	//
	// init
	//
	view.init = function()
	{
		view.el.removeClass('flour-view');

		// create view list
		view.viewList = flour.getList('flour_view_list');

		// view
		view.subscribe('flour:view_create', function(newView)
		{
			view.increaseViewCount();
			view.addViewToList(newView);
		});

		view.subscribe('flour:view_destroy', function(id)
		{
			view.decreaseViewCount();
			view.removeViewFromList(id);
		});


		// list
		view.subscribe('flour:list_create', function(newView)
		{
			view.increaseViewCount();
			view.addViewToList(newView);
		});

		view.subscribe('flour:list_destroy', function(id)
		{
			view.decreaseViewCount();
			view.removeViewFromList(id);
		});

		view.render();
	};


	//
	// increase and decrease view count
	//
	view.increaseViewCount = function()
	{
		viewCount ++;
		view.trigger('updateViewCount', viewCount);
	};

	view.decreaseViewCount = function()
	{
		viewCount --;
		view.trigger('updateViewCount', viewCount);
	};


	//
	// add view/list
	//
	view.addViewToList = function(newView)
	{
		var viewReference = newView.view ? newView.view : newView.list;
		var data = {
			id: viewReference.id,
			name: newView.name,

			template: viewReference.template,
			helpers: (viewReference.helpers ? viewReference.helpers.join(',') : 'none')
		};

		view.viewList.add(data);
	};


	//
	// add view/list
	//
	view.removeViewFromList = function(id)
	{
		view.viewList.remove(id);
	};

});













/*
| ------------------------------------------------------------------------------------------------------------------------------
|
|	View list
|
|	------------------------------------------------------------------------------------------------------------------------------
*/

flour.addTemplate('flour_view_item', 
	'<div class="flour-view-item-inner">' + 
	'  <div class="flour-view-item-name">{{ name }}</div>' + 
	'  <div class="flour-view-item-stat">Id: {{ id }}</div>' +
	'  <div class="flour-view-item-stat">Template: {{ template }}</div>' +
	'  <div class="flour-view-item-stat">Helpers: {{ helpers }}</div>' +
	'</div>'
);

flour.addList('flour_view_list', function()
{

	var list = this;

	// list params
	list.template = 'flour_view_item';
	list.itemElClass = 'flour-view-item';
	list.key = 'id';


	//
	// init
	//
	list.init = function()
	{
		list.el.removeClass('flour-list');
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
	'  <div flour-view="storeList"></div>' + 
	'</div>'
);

flour.addView('flour_log_store', function()
{

	var view = this;

	// view params
	view.template = 'flour_log_store';
	view.events = {};

	view.storeList = false;


	//
	// init
	//
	view.init = function()
	{
		view.storeList = view.getList('flour_store_list');
		
		view.subscribe('flour:store_update', function(items)
		{
			view.displayItems(items);
		});

		view.displayItems(flour.store.get());

		view.el.removeClass('flour-view');
		view.render();
	};


	//
	// display items
	//
	view.displayItems = function(items)
	{
		var itemsCount = 0;
		view.storeList.removeAll();
		
		for(var key in items)
		{
			var itemData = {
				key: key,
				data: items[key]
			};

			if(flour.isObject(itemData.data))
			{
				itemData.is_object = true;
				itemData.data = flour.filters['json_format'](items[key]);
			}
			
			view.storeList.add(itemData);
			itemsCount ++;
		}

		view.trigger('updateStoreCount', itemsCount);
	};

});














/*
| ------------------------------------------------------------------------------------------------------------------------------
|
|	Store list
|
|	------------------------------------------------------------------------------------------------------------------------------
*/

flour.addTemplate('flour_store_item', 
	'<div class="flour-store-item-inner">' + 
	'  <div class="flour-store-item-key">{{ key }}</div>' + 
	'  {{#if is_object }}' + 
	'    <pre>{{ data }}</pre>' +
	'  {{else}}' +
	'    {{ data }}' + 
	'  {{/if}}' +
	'</div>'
);

flour.addList('flour_store_list', function()
{

	var list = this;

	// list params
	list.template = 'flour_store_item';
	list.itemElClass = 'flour-store-item';
	list.key = 'key';


	//
	// init
	//
	list.init = function()
	{
		list.el.removeClass('flour-list');
	};

});












flour.logView = flour.getView('flour_log');
flour.log = function(data, type)
{
	flour.logView.log(data, type);
};



$(function(){ 
	$('body').append(flour.logView.el); 
});








