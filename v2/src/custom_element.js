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
			//	Basic setup
			//
			constructor() 
			{
				super();
			}

			static get observedAttributes() 
			{
			  	return details.attributes;
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

				if(this.#viewInstance && this.#viewInstance.attributeChanged)
				{
					this.#viewInstance.attributeChanged(property, newValue, oldValue);
				}
			}



			//
			//	Create view
			//
			connectedCallback() 
			{
				var params = {};


				// Extract attributes from the html to pass to the view
				if(details && details.attributes)
				{
					for(const attributeName of details.attributes)
					{
						if(this.hasAttribute(attributeName))
						{
							params[attributeName] = this.getAttribute(attributeName);
						}
					}
				}


				// Create our view instance
				if(!this.#viewInstance)
				{
					this.#viewInstance = flour.view.get(details.view, params, {hostEl: this});	
				}
				

				// For events specified, listen to them on the view and dispatch them from our element 
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


				//
				// Create setters and getters for each property, call propertyChanged on our 
				// view instance if the value has changed
				//
				if(details && details.properties)
				{
					details.properties.forEach((propertyName) => 
					{
						Object.defineProperty(this, propertyName, 
						{
							set: function(value)
							{
								var oldValue = this['m_' + propertyName];
								this['m_' + propertyName] = value;

								if(this.#viewInstance.propertyChanged && oldValue !== value)
								{
									this.#viewInstance.propertyChanged(propertyName, this['m_' + propertyName]);	
								}
							},
							get: function()
							{
								return this['m_' + propertyName];
							}
						});
					});
				}


				// Append our view - shadow dom or regular
				if(details.shadow === true)
				{
					if(!this.shadowRoot)
					{
						this.attachShadow({mode: 'open'});
					}

					this.shadowRoot.append(this.#viewInstance.el);

					var view = this.#viewInstance;
					var slots = view.el.querySelectorAll('slot');

					for(let slot of slots)
					{
						slot.addEventListener('slotchange', function()
						{
							if(view.slotChanged)
							{
								view.slotChanged(slot);
							}
						});
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
					this.#viewInstance.remove();
				}
			}
		}
	);
};