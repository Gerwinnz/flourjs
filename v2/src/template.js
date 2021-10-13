var flour = flour || {};




/*
|
|
|
|
|
*/
flour.template = {
	elementUniqueId: 0,

	getElementIndex: function(el)
	{
		var siblings = el.parentNode.children;
		for(var i = 0, n = siblings.length; i < n; i ++){
			if(siblings[i] === el){
				return i;
			}
		}
	}
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



	//
	// go through our blocks and fetch their destination element
	//
	for(var i = 0, n = blocks.length; i < n; i ++)
	{
		(function(block){

			block.el = templateFragment.content.querySelector('#flour-' + block.elementUniqueId);
			block.el.removeAttribute('id');
			block.pos = flour.template.getElementIndex(block.el);
			
			if(block.type === 'list')
			{
				var items = state.get(block.stateKey);

				var cleanup = state.onChange(block.stateKey, function(event)
				{
					if(event.type === 'add')
					{
						var itemState = flour.state(event.item);
						block.el.appendChild(flour.template.parse(block.html, itemState, view).fragment);
					}
				});

				items.forEach((item) => 
				{
					var itemState = flour.state(item);
					block.el.appendChild(flour.template.parse(blocks[i].html, itemState, view).fragment);
				});

				cleanupCallbacks.push(cleanup);
			}

		}(blocks[i]));
	}



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