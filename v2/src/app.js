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



	constructor(params)
	{
		this.element = params.element || document.createElement('div');
		this.router = flour.router(params.routes, params.base_url);

		window.appRouter = this.router;

		window.addEventListener('popstate', () => { this.matchRoute(); });
		
		this.matchRoute();
	}



	matchRoute()
	{
		var route = this.router.match({url: document.URL});
		console.log(route);
	}

}