
export function transitionHandler(e, callback)
{
	console.log(e);

	// First load no current view
	if(!e.currentView)
	{
		e.hostElement.append(e.nextView.el);
		callback();
		return;
	}

	//
	var animationIn = 'view__in-forward';
	var animationOut = 'view__out-forward';
	var nextViewEl = e.nextView.el;
	var currentViewEl = e.currentView.el;

	if(e.route.direction === 'back')
	{
		animationIn = 'view__in-back';
		animationOut = 'view__out-back';
	}

	nextViewEl.classList.add('view--animating', animationIn);
	currentViewEl.classList.add('view--animating', animationOut);

	e.hostElement.append(e.nextView.el);

	nextViewEl.addEventListener('animationend', function()
	{
		nextViewEl.classList.remove('view--animating', animationIn);
		currentViewEl.classList.remove('view--animating', animationOut);
		callback();
	}, {once: true});
};