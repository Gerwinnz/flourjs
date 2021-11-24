
class HelloWorld extends HTMLElement {
	
	connectedCallback() {
		this.textContent = 'Hello world';
	}

}


customElements.define('hello-world', HelloWorld);