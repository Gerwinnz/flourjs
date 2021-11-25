
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
	  this.innerHTML = '<p>Hello ' + this.name + '</p>';
	}

	connectedCallback() {
		this.innerHTML = '<p>Hello ' + this.name + '</p>';
	}

}


customElements.define('hello-world', HelloWorld);