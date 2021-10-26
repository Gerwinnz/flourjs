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
		(function(){

			var regEx = new RegExp('{{#' + blockType + ' (\\w*)}}', 'g');
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

				html = html.replace(replaceString, '<div id="flour-' + elementId + '"></div>');
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
				if(flour.util.isFunction(cleanup))
				{
					cleanupCallbacks.push(cleanup);
				}
			}
		}
	}



	//
	// go through our found blocks and call them
	//
	for(var i = 0, n = blocks.length; i < n; i ++)
	{
		(function(block){

			var el = templateFragment.content.querySelector('#flour-' + block.elementId);
			el.removeAttribute('id');

			block.el = el;
			block.pos = flour.template.getElementIndex(block.el);
			
			var cleanup = flour.block.defined[block.type](block, state, view);
			if(flour.util.isFunction(cleanup))
			{
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