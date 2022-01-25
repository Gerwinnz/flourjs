

/*
|
|	Generic event attaching binder that allows adding multiple events separated by commas
|
|	Attribute format:
|	[javascriptEvent] [handlerName]
| 	eg. "click myClickHandler" or "click myClickHandler,submit mySubmitHandler"
|
|
*/
flour.binding.add('f-on', 
{

	attach: function(element, state, view)
	{
		var mValue = element.getAttribute('f-on');
		var mEvents = mValue.split(',');

		for(var i = 0, n = mEvents.length; i < n; i ++)
		{
			(function(eventString){

				var parts = eventString.split(' ');
				var type = parts[0].trim();
				var handler = false;
				
				if(!parts[1])
				{
					flour.util.warn('Binding "f-on" expects two params. Only one given here "' + eventString + '"');
					return;
				}

				handler = parts[1].trim();
				
				if(view[handler])
				{
					element.addEventListener(type, function(event)
					{
						view[handler](event, element);
					});
				}

			}(mEvents[i]));
		}
	}

});

