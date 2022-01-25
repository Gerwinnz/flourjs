

flour.binding.add('f-options', 
{

	attach: function(element, state, view)
	{
		var mKey = element.getAttribute('f-options');
		var mValue = element.getAttribute('f-value');
		var mOptions = state.get(mKey) || [];

		var cleanup = state.onChange(mKey, function(event)
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
		setOptions(mOptions);


		// cleanup
		return cleanup;
	}

});

