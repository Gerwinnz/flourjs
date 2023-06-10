var flour = flour || {};



/*
|
|
|
|
|
*/
flour.template = {
	parsed: new Map()
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
	
	var parsed = false;
	var templateKey = html;
	var templateDetails = {
		bindings: {},
		customElements: []
	};

	if(flour.template.parsed.has(templateKey))
	{
		parsed = true;
		templateDetails = flour.template.parsed.get(templateKey);
	}



	//
	//	Create comment filter for our tree walker
	//
	function commentFilter(node)
	{
		return NodeFilter.FILTER_ACCEPT;
	}

	commentFilter.acceptNode = commentFilter;
	


	//
	// parse block tags {{#block}}{{/block}}
	//
	var regEx = new RegExp('{{#([a-z]+) ([^}}]*)}}', 'g');
	var result;

	while((result = regEx.exec(html)) !== null)
	{
		var blockType = result[1];
		var key = result[2];
		var found = result[0];

		var closeTag = '{{/' + blockType + '}}';
		var nextOpenIndex = result.index;
		var nextCloseIndex = result.index;

		do
		{
			nextOpenIndex = html.indexOf('{{#', nextOpenIndex + 1);
			nextCloseIndex = html.indexOf('{{/', nextCloseIndex + 1);
		} 
		while(nextOpenIndex !== -1 && nextCloseIndex !== -1 && nextCloseIndex > nextOpenIndex);

		var start = result.index;
		var end = nextCloseIndex + closeTag.length;
		var replaceString = html.substr(start, end - start);
		var innerHTML = replaceString.substr(found.length, replaceString.length - found.length - closeTag.length);

		var slotId = flour.util.generateId();

		html = html.replace(replaceString, '<!-- flour-slot-' + slotId + ' -->');
		blocks.push({
			slotId: slotId,
			type: blockType,
			key: key.trim(),
			html: innerHTML
		});
	}



	//
	// parse standard output tag {{tag_output}}
	//
	html = html.replace(/{{\s?(\w+[\w.]*)\s?}}/g, (tag, stateName) => {
		return state.get(stateName);
	});



	//
	// set our template HTML to our parsed output
	//
	templateFragment.innerHTML = html;



	//
	// attach bindings
	//
	var bindings = parsed ? templateDetails.bindings : flour.binding.defined;

	for(var bindingName in bindings)
	{
		var elements = templateFragment.content.querySelectorAll('[' + bindingName + ']');
		if(elements.length > 0)
		{
			for(var i = 0, n = elements.length; i < n; i ++)
			{
				var cleanup = flour.binding.defined[bindingName].attach(elements[i], state, view);
				if(flour.util.isFunction(cleanup))
				{
					cleanupCallbacks.push(cleanup);
				}

				elements[i].removeAttribute(bindingName);
			}

			templateDetails.bindings[bindingName] = true;
		}
	}



	//
	// Find custom elements/components and update attributes mapped to a state value
	//
	var customElementsSelector = parsed ? templateDetails.customElements.join(',') : flour.customElement.defined.join(',');

	if(customElementsSelector)
	{
		var stateVariablePattern = /\{([\w.]+)}/;
		var customElements = templateFragment.content.querySelectorAll(customElementsSelector);
		
		for(var i = 0, n = customElements.length; i < n; i ++)
		{
			(function(customElement){

				if(parsed === false)
				{
					templateDetails.customElements.push(customElement.tagName);
				}

				var attributes = customElement.attributes;
				for(var i = 0, n = attributes.length; i < n; i ++)
				{
					(function(attribute){
						var attributeName = attribute.nodeName;
						var attributeValue = customElement.getAttribute(attributeName);
						var match = false;

						if(!flour.binding.defined[attributeName])
						{
							if(match = attributeValue.match(stateVariablePattern))
							{
								var key = match[1];
								var value = state.get(key);
								customElement.setAttribute(attributeName, value);

								var listener = state.onChange(key, function(event)
								{
									customElement.setAttribute(attributeName, event.value);
								});

								cleanupCallbacks.push(listener.remove);
							}
						}
					}(attributes[i]));
				}

			}(customElements[i]));
		}
	}
	




	//
	// go through our found blocks and call them
	//
	for(var i = 0, n = blocks.length; i < n; i ++)
	{
		(function(block){
			var referenceNode = false;
			var blockContents = [];

			var treeWalker = document.createTreeWalker(
				templateFragment.content,
				NodeFilter.SHOW_COMMENT,
				commentFilter,
				false
			);

			while(treeWalker.nextNode()) 
			{
				if(treeWalker.currentNode.nodeValue === ' flour-slot-' + block.slotId + ' ')
				{
					referenceNode = treeWalker.currentNode;
				}
			}

			block.display = function(contents)
			{
				if(contents)
				{
					for(var i = 0, n = contents.childNodes.length; i < n; i ++)
					{
						blockContents.push(contents.childNodes[i]);
					}

					referenceNode.after(contents);
				}
				else
				{
					if(blockContents)
					{
						for(var i = 0, n = blockContents.length; i < n; i ++)
						{
							blockContents[i].parentNode.removeChild(blockContents[i]);
						}

						blockContents.length = 0;
					}
				}
			};

			
			var cleanup = flour.block.defined[block.type](block, state, view);
			if(flour.util.isFunction(cleanup))
			{
				cleanupCallbacks.push(cleanup);
			}
		}(blocks[i]));
	}


	//
	// if not parsed, set parsed
	//
	if(parsed === false)
	{
		flour.template.parsed.set(templateKey, templateDetails);
	}


	//
	// return the fragment plus cleanup
	//
	return {
		fragment: templateFragment.content,
		cleanup: function()
		{
			for(var i = 0, n = cleanupCallbacks.length; i < n; i ++)
			{
				cleanupCallbacks[i]();
			}
		}
	};
};