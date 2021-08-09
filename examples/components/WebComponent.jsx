/**
 * web component 的示例
 */

class RandomNumber extends HTMLElement {
  connectedCallback() {
    const prefix = this.getAttribute('prefix') || '';
    const shadow = this.attachShadow({mode: 'open'});
    const text = document.createElement('span');
    text.textContent = `${prefix}: ${Math.floor(Math.random() * 1000)}`;
    shadow.appendChild(text);
    setInterval(function () {
      const count = `${prefix}: ${Math.floor(Math.random() * 1000)}`;
      text.textContent = count;
    }, 2000);
  }
}

class WebContainer extends HTMLElement {
  connectedCallback() {
    const shadow = this.attachShadow();
    shadow.innerHTML = 'web-container';
  }
}

customElements.define('random-number', RandomNumber);
customElements.define('web-container', WebContainer);
