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
	for(var blockType in flour.block.defined)
	{
		html = html.replace(/{{#list (\w*)}}((.|\n)*){{\/list}}/g, (tag, key, html) => {
			var elementId = flour.template.elementUniqueId;
			flour.template.elementUniqueId ++;

			blocks.push({
				elementId: elementId,
				type: blockType,
				key: key,
				html: html
			});

			return '<div id="flour-' + elementId + '"></div>';
		});
	}



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
				var cleanup = flour.binding.defined[bindingName].attach(elements[i], state, view);
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

			var el = templateFragment.content.querySelector('#flour-' + block.elementId);
			el.removeAttribute('id');

			block.el = el; 
			block.pos = flour.template.getElementIndex(block.el);
			
			flour.block.defined[block.type](el, state, view);

			if(block.type === 'list')
			{
				var items = state.get(block.key);

				block.items = {};

				var cleanup = state.onChange(block.key, function(event)
				{
					if(event.type === 'add')
					{
						var itemState = flour.state(event.item);
						var itemTemplate = flour.template.parse(block.html, itemState, view);

						block.items[event.item.id] = {
							el: itemTemplate.fragment.firstElementChild,
							state: itemState
						};

						block.el.appendChild(itemTemplate.fragment);
					}

					if(event.type === 'remove')
					{
						if(block.items[event.item.id])
						{
							block.items[event.item.id].el.remove();
							block.items[event.item.id] = null;
						}
					}
				});

				items.forEach((item) => 
				{
					var itemState = flour.state(item);
					var itemTemplate = flour.template.parse(blocks[i].html, itemState, view);

					block.items[item.id] = {
						el: itemTemplate.fragment.firstElementChild,
						state: itemState
					};

					block.el.appendChild(itemTemplate.fragment);
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