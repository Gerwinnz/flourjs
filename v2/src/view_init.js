

/*
|
|	Mechanism for loading views in a configurable way simply by putting an attribute on a 
| 	block of HTML where the internal HTML will become the view template.
|
*/
document.addEventListener('DOMContentLoaded', function()
{
	var elements = document.body.querySelectorAll('[f-init]');

	elements.forEach(function(element)
	{
		var viewName = element.getAttribute('f-init');
		var viewParams = {};
		var templateHTML = element.innerHTML;
		var dataset = element.dataset;

		for(var key in dataset)
		{
			viewParams[key] = dataset[key];
		}
		
		element.innerHTML = '';

		if(!flour.view.defined[viewName])
		{
			return;
		}

		var viewInstance = flour.view.get(viewName, viewParams, {templateHTML: templateHTML});
		element.append(viewInstance.el);
	});
});