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
				this.view = flour.view.get(details.view);
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
					this.view.attributeChanged(property, newValue);
				}
			}

			connectedCallback() 
			{
				this.attachShadow({mode: 'open'}).append(this.view.el);
			}
		}
	);
};