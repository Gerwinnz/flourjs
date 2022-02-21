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
	// parse block tags {{#block}}{{/block}}
	//
	for(var blockType in flour.block.defined)
	{
		(function(){
			var regEx = new RegExp('{{#' + blockType + ' ([^}]*)}}', 'g');
			var result;

			while((result = regEx.exec(html)) !== null)
			{
				var key = result[1];
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

				var elementId = flour.template.elementUniqueId;
				flour.template.elementUniqueId ++;

				html = html.replace(replaceString, '<option id="flour-' + elementId + '"></option>');
				blocks.push({
					elementId: elementId,
					type: blockType,
					key: key,
					html: innerHTML
				});
			}
		}());
	}



	//
	// parse standard output tag {{tag_output}}
	//
	html = html.replace(/{{\s?(\w*)\s?}}/g, (tag, stateName) => {
		return state.get(stateName);
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
				if(flour.util.isFunction(cleanup))
				{
					cleanupCallbacks.push(cleanup);
				}

				elements[i].removeAttribute(bindingName);
			}
		}
	}



	//
	// Find custom elements/components and update attributes mapped to a state value
	//
	var stateVariablePattern = /\{([\w.]+)}/;
	var customElements = templateFragment.content.querySelectorAll(flour.customElement.defined.join(','));

	for(var i = 0, n = customElements.length; i < n; i ++)
	{
		(function(customElement){
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

							var cleanup = state.onChange(key, function(event)
							{
								customElement.setAttribute(attributeName, event.value);
							});

							cleanupCallbacks.push(cleanup);
						}
					}
				}(attributes[i]));
			}

		}(customElements[i]));
	}



	//
	// go through our found blocks and call them
	//
	for(var i = 0, n = blocks.length; i < n; i ++)
	{
		(function(block){
			var el = templateFragment.content.querySelector('#flour-' + block.elementId);
			var referenceNode = document.createTextNode('');
			var blockContents = [];

			el.after(referenceNode);
			el.remove();

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

			//block.el = el;
			
			var cleanup = flour.block.defined[block.type](block, state, view);
			if(flour.util.isFunction(cleanup))
			{
				cleanupCallbacks.push(cleanup);
			}
		}(blocks[i]));
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