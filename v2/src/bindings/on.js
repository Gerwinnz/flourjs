

flour.binding.add('f-on', 
{

	attach: function(element, state, view)
	{
		var attributeValue = element.getAttribute('f-on');
		var events = attributeValue.split(',');

		for(var i = 0, n = events.length; i < n; i ++)
		{
			(function(eventString){

				var parts = eventString.split(' ');
				var type = parts[0];
				var handler = false;
				
				if(!parts[1])
				{
					flour.util.warn('Binding "f-on" expects two params. Only one given here "' + eventString + '"');
					return;
				}

				handler = parts[1];
				
				if(view[handler])
				{
					element.addEventListener(type, function(event)
					{
						view[handler](event, element);
					});
				}

			}(events[i]));
		}
	}

});

