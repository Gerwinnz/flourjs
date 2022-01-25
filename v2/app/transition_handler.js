
export function transitionHandler(e, callback)
{
	// First load no current view
	if(!e.currentView)
	{
		e.hostElement.append(e.nextView.el);
		callback();
		return;
	}

	// Default forward transitions
	var animationIn = 'view__in-forward';
	var animationOut = 'view__out-forward';
	var nextViewEl = e.nextView.el;
	var currentViewEl = e.currentView.el;

	if(e.route.direction === 'back')
	{
		animationIn = 'view__in-back';
		animationOut = 'view__out-back';
	}

	// Add transition classes
	nextViewEl.classList.add('view--animating', animationIn);
	currentViewEl.classList.add('view--animating', animationOut);

	// Add next view
	e.hostElement.append(e.nextView.el);

	// On animation end, remove classes and call the callback
	nextViewEl.addEventListener('animationend', function()
	{
		nextViewEl.classList.remove('view--animating', animationIn);
		currentViewEl.classList.remove('view--animating', animationOut);
		
		callback();
	}, {once: true});
};