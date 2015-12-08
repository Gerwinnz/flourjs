
var flour = flour || {};

/*
|
|
|	Contains our flour console object
|
|
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
	'      <div class="flour-log-pane" data-tab="console">Console</div>' + 
	'      <div class="flour-log-pane" data-tab="views">Views</div>' + 
	'      <div class="flour-log-pane" data-tab="store">Store</div>' + 
	'    </div>' + 
	'  </div>' + 
	'</div>'
);




/*
|
|
|	Log view
|
|
*/
flour.addView('log', function()
{

	var view = this;

	// view params
	view.template = 'flour_log';
	view.events = {
		'click .flour-log-tab': 'setTabEvent'
	};

	// private
	var currentTab = 'console';
	var $tabs = false;
	var $panes = false;


	// init
	view.init = function()
	{
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
	}



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

});





flour.log = flour.getView('log');
$(function(){ $('body').append(flour.log.el); });


