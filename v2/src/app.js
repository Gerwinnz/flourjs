var flour = flour || {};



flour.app = function(params)
{
	var instance = new flour_app(params);
	return instance;
};



class flour_app
{

	constructor(params)
	{
		this.el = document.createDocumentFragment();
				
		if(params.element)
		{
			params.element.appendChild(this.el);
		}
	}

}