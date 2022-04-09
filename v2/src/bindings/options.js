
/*
|
|	Sets the select elements inner html to contain options matching the state value
|
|	State value should be an array formatted as:
|   [
|		{
|			value: 'foo',
|			label: 'Foo'
|		}
|	]
|
*/
flour.binding.add('f-options', 
{

	attach: function(element, state, view)
	{
		var mKey = element.getAttribute('f-options');
		var mValue = element.getAttribute('f-value');

		var listener = state.onChange(mKey, function(event)
		{
			setOptions(event.value);
		});

		var setOptions = function(options)
		{
			var html = '';
			for(var i = 0, n = options.length; i < n; i ++)
			{
				html += '<option value="' + options[i].value + '">' + options[i].label + '</option>';
			}

			element.innerHTML = html;

			if(mValue){
				element.value = state.get(mValue);
			}
		};

		
		// initial setup
		setOptions(listener.value || []);

		// cleanup
		return listener.remove;
	}

});

