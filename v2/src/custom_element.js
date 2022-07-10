var flour = flour || {};




/*
|
|
|	Custom element details
|
|
*/
flour.customElement = 
{
	defined: []
};




flour.customElement.add = function(tagName, details)
{
	flour.customElement.defined.push(tagName);

	customElements.define(tagName, 
		class extends HTMLElement 
		{	
			//
			//	Private view instance
			//
			#viewInstance;


			//
			//	Setup
			//
			constructor() 
			{
				super();
				var params = {};


				// Put together the params to pass to the view based on the props
				// that are specified and the value is pulled from the html attribute
				if(details && details.props)
				{
					for(var i = 0, n = details.props.length; i < n; i ++)
					{
						if(this.hasAttribute(details.props[i]))
						{
							params[details.props[i]] = this.getAttribute(details.props[i]);
						}
					}
				}


				// Create our view instance
				this.#viewInstance = flour.view.get(details.view, params, {hostEl: this});


				// For events specified, listen to them on the view and dispatch them 
				// from our element 
				if(details && details.events)
				{
					details.events.forEach((eventName) => 
					{
						this.#viewInstance.on(eventName, (eventData) =>
						{
							var customEvent = new CustomEvent(eventName, eventData);
							this.dispatchEvent(customEvent);
						});
					});
				}
			}

			static get observedAttributes() 
			{
			  	return details.props;
			}


			//
			//	Attribute change
			//
			//  Forward this to the same method on the view attached if exists
			//
			attributeChangedCallback(property, oldValue, newValue) 
			{  
				if (oldValue === newValue)
				{
					return;
				}

				if(this.#viewInstance.attributeChanged)
				{
					this.#viewInstance.attributeChanged(property, newValue, oldValue);
				}
			}


			//
			//	Append our view el
			//
			connectedCallback() 
			{
				if(details.shadow === true)
				{
					this.attachShadow({mode: 'open'}).append(this.#viewInstance.el);

					var view = this.#viewInstance;
					var slots = view.el.querySelectorAll('slot');

					for(var i = 0, n = slots.length; i < n; i ++)
					{
						(function(slot){
							slot.addEventListener('slotchange', function()
							{
								if(view.slotChanged)
								{
									view.slotChanged(slot);
								}
							});
						}(slots[i]));
					}
				}
				else
				{
					this.append(this.#viewInstance.el);
				}
			}


			//
			//	Call our destroy
			//
			disconnectedCallback()
			{
				if(this.#viewInstance)
				{
					this.#viewInstance.destroy();
				}
			}
		}
	);
};