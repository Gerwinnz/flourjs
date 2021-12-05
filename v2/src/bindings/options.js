

flour.binding.add('f-options', 
{

	attach: function(element, state, view)
	{
		var key = element.getAttribute('f-options');
		var value = element.getAttribute('f-value');
		var options = state.get(key) || [];

		var remove = state.onChange(key, function(event)
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

			if(value){
				element.value = state.get(value);
			}
		};

		
		setOptions(options);


		return function(){
			remove();
		}
	}

});

