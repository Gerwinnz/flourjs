
class HelloWorld extends HTMLElement {
	
	constructor() {
		super();
		this.name = 'world';
	}

	static get observedAttributes() {
	  return ['name'];
	}

	attributeChangedCallback(property, oldValue, newValue) {
	  if (oldValue === newValue) return;
	  this[property] = newValue;
	  this.textContent = 'Hello ' + this.name;
	}

	connectedCallback() {
		this.textContent = 'Hello ' + this.name;
	}

}


customElements.define('hello-world', HelloWorld);