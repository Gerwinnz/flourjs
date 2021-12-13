var flour = flour || {};




/*
|
|
|
|
|
*/
flour.app = function(params)
{
	var instance = new flour_app(params);
	return instance;
};



class flour_app
{
	element = false;
	router = false;
	//state = false;



	constructor(params)
	{
		this.element = params.element || document.createElement('div');
		this.router = flour.router(params.routes, params.base_url);
		//this.state = flour.state();

		window.appRouter = this.router;

		flour.subscribe('history:state_change', (data) => 
		{
			this.matchRoute(data);
		});

		window.addEventListener('popstate', () => 
		{
			flour.publish('history:state_change', {
		      popstate: true
		    });
		});

		this.matchRoute({url: document.URL});
		this.attachLinkClicks();
	}



	matchRoute(data)
	{
		var route = this.router.match(data);
		console.log(route);
	}



	attachLinkClicks()
	{

	}

}