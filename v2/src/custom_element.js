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
			constructor() 
			{
				super();
				var params = {};
				var viewInstance = false;

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

				viewInstance = flour.view.get(details.view, params);
				this.view = viewInstance;

				if(details && details.events)
				{
					details.events.forEach((eventName) => 
					{
						viewInstance.on(eventName, (eventData) =>
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

				if(this.view.attributeChanged)
				{
					this.view.attributeChanged(property, newValue, oldValue);
				}
			}


			//
			//	Append our view el
			//
			connectedCallback() 
			{
				if(details.shadow === true)
				{
					this.attachShadow({mode: 'open'}).append(this.view.el);

					var view = this.view;
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
					this.append(this.view.el);
				}
			}


			//
			//	Call our destroy
			//
			disconnectedCallback()
			{
				if(this.view)
				{
					this.view.destroy();
				}
			}
		}
	);
};