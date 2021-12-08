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
	routes = {};



	constructor(params)
	{				
		this.element = params.element || document.createElement('div');
		this.routes = params.routes || {};

		this.matchRoute();
	}



	matchRoute()
	{
		console.log('matching request for ' + document.URL);
	}

}