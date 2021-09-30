var flour = flour || {};




/*
|
|
|
|
|
*/
flour.template = {
	elementUniqueId: 0
};



/*
|
|
|
|
|
*/
flour.template.parse = function(html, state, view)
{
	var templateFragment = document.createElement('template');
	var blocks = [];
	var cleanupCallbacks = [];
	

	//
	// parse block tags
	//
	html = html.replace(/{{#list (\w*)}}((.|\n)*){{\/list}}/g, (tag, list, itemHTML) => {
		
		flour.template.elementUniqueId ++;

		var elementUniqueId = flour.template.elementUniqueId;
		blocks.push({
			type: 'list',
			elementUniqueId: elementUniqueId,
			stateKey: list,
			html: itemHTML,
			items: []
		});

		return '<div id="flour-' + elementUniqueId + '"></div>';
	});


	//
	// parse standard output tag
	//
	html = html.replace(/{{\s?(\S*)\s?}}/g, (tag, tagInside) => {
		return state.get(tagInside);
	});


	//
	// set our template HTML to our parsed output
	//
	templateFragment.innerHTML = html;


	//
	// go through our blocks and fetch their destination element
	//
	for(var i = 0, n = blocks.length; i < n; i ++)
	{
		var range = document.createRange();

		blocks[i].el = templateFragment.content.querySelector('#flour-' + blocks[i].elementUniqueId);
		//blocks[i].fragment = document.createDocumentFragment();
		
		if(blocks[i].type === 'list')
		{
			var items = state.get(blocks[i].stateKey);
			items.forEach((item) => 
			{
				var itemState = flour.state(item);
				blocks[i].el.appendChild(flour.template.parse(blocks[i].html, itemState, view).fragment);
			});

			// blocks[i].el.innerHTML = 'DIV';
			// blocks[i].el.parentNode.replaceChild(blocks[i].fragment, blocks[i].el);			
		}
	}


	//
	// attach bindings
	//
	for(var bindingName in flour.binding.defined)
	{
		var elements = templateFragment.content.querySelectorAll('[' + bindingName + ']');
		if(elements.length > 0)
		{
			for(var i = 0, n = elements.length; i < n; i ++)
			{
				var cleanup = flour.binding.defined[bindingName].attach(elements[i], elements[i].getAttribute(bindingName), view);
				if(typeof cleanup === 'function')
				{
					cleanupCallbacks.push(cleanup);
				}
			}
		}
	}

	console.log('binding cleanups', cleanupCallbacks);



	// return the fragment
	return {
		fragment: templateFragment.content,
		cleanup: function(){
			for(var i = 0, n = cleanupCallbacks.length; i < n; i ++)
			{
				cleanupCallbacks[i]();
			}
		}
	};
};