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

				this.view = flour.view.get(details.view, params);
			}

			static get observedAttributes() 
			{
			  	return details.props;
			}

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
		}
	);
};