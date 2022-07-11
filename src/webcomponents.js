'use strict'

/**
 * @module webcomponents
 */
export const webcomponents = {};

/**
 * A skeleton to ease the creation of web components.
 *
 * @extends {HTMLElement}
 */
webcomponents.WebComponent = class extends HTMLElement {

  /**
   * @constructor
   */
  constructor() {
    super();
  }

  /**
   * Called every time the element is inserted into the DOM.
   *
   * @name connectedCallback
   * @function
   * @protected
   * @override
   */
  connectedCallback() {
    this.attachShadow({mode: 'open'});
    this.beforeRender();
    this.render();
    this.afterRender();
  }

  /**
   * Called every time the element is removed from the DOM.
   *
   * @name disconnectedCallback
   * @function
   * @protected
   * @override
   */
  disconnectedCallback() {
  }

  /**
   * Returns the component Javascript.
   *
   * @return {string} the Javascript.
   * @name js
   * @function
   * @protected
   */
  js() {
    return ``;
  }

  /**
   * Returns the component CSS.
   *
   * @return {string} the CSS.
   * @name css
   * @function
   * @protected
   */
  css() {
    return ``;
  }

  /**
   * Returns the component HTML template.
   *
   * @return {string} the HTML.
   * @name template
   * @function
   * @protected
   */
  template() {
    return ``;
  }

  /**
   * Executed before rendering the DOM.
   *
   * @name beforeRender
   * @function
   * @protected
   */
  beforeRender() {
  }

  /**
   * Render the DOM.
   *
   * @name render
   * @function
   * @protected
   */
  render() {
    this.shadowRoot.innerHTML = `
        ${this.css()}
        ${this.template()}
        ${this.js()}
    `;
  }

  /**
   * Executed after rendering the DOM.
   *
   * @name afterRender
   * @function
   * @protected
   */
  afterRender() {
  }

  /**
   * Emit a custom event.
   *
   * @param {string} type the event type.
   * @param {Object|null} data any data structure to pass along with the event.
   * @param {Node|null} elem the element to attach the event to.
   * @return {boolean} returns true if either event's cancelable attribute value is false or its preventDefault() method was not invoked, and false otherwise.
   * @name emit
   * @function
   * @protected
   */
  emit(type, data = {}, elem = document) {
    const event = new CustomEvent(type, {
      bubbles: true, cancelable: true, detail: {
        component: this, data: data
      }
    });
    return (elem ? elem : document).dispatchEvent(event);
  }

  /**
   * Returns the component attribute value or a default value if none was found.
   *
   * @param {string} attr the attribute to get.
   * @param {string|null} defaultValue the default value.
   * @return {string|null} the attribute value if any, defaultValue otherwise.
   * @name getAttributeOrDefault
   * @function
   * @protected
   */
  getAttributeOrDefault(attr, defaultValue) {
    return this.hasAttribute(attr) ? this.getAttribute(attr) : defaultValue;
  }

  /**
   * Returns the first element with a given identifier or class name.
   *
   * @param {string} idOrClassName the identifier or class name to match.
   * @return {Element|null} an HTML element.
   * @name getElement
   * @function
   * @protected
   */
  getElement(idOrClassName) {
    return this.shadowRoot.querySelector(idOrClassName);
  }

  /**
   * Get the first page element with a given identifier or class name.
   *
   * @param {string} idOrClassName the identifier or class name to match.
   * @return {Element|null} an HTML element.
   * @name getPageElement
   * @function
   * @protected
   */
  getPageElement(idOrClassName) {
    return document.querySelector(idOrClassName);
  }

  /**
   * Add a given class to a given element.
   *
   * @param {string} idOrClassName the identifier or class name to match.
   * @param {string} className the class name to add.
   * @name addCssClass
   * @function
   * @protected
   */
  addCssClass(idOrClassName, className) {
    const el = this.getElement(idOrClassName);
    if (el) {
      el.classList.add(className);
    }
  }

  /**
   * Remove a given class from a given element.
   *
   * @param {string} idOrClassName the identifier or class name to match.
   * @param {string} className the class name to remove.
   * @name removeCssClass
   * @function
   * @protected
   */
  removeCssClass(idOrClassName, className) {
    const el = this.getElement(idOrClassName);
    if (el) {
      el.classList.remove(className);
    }
  }

  /**
   * Add a class if it does not already exist on a given element, remove it otherwise.
   *
   * @param {string} idOrClassName the identifier or class name to match.
   * @param {string} className the class name to toggle.
   * @name toggleCssClass
   * @function
   * @protected
   */
  toggleCssClass(idOrClassName, className) {
    const el = this.getElement(idOrClassName);
    if (el) {
      el.classList.toggle(className);
    }
  }

  /**
   * Check if a given element has a given class.
   *
   * @param {string} idOrClassName the identifier or class name to match.
   * @param {string} className the class name to search.
   * @return true if the element contains the given class, false otherwise.
   * @name includesCssClass
   * @function
   * @protected
   */
  includesCssClass(idOrClassName, className) {
    const el = this.getElement(idOrClassName);
    if (el) {
      return el.classList.contains(className);
    }
    return false;
  }

  /**
   * Get all classes associated to a given element.
   *
   * @param {string} idOrClassName the identifier or class name to match.
   * @return {Array<string>} the class names.
   * @name getAllCssClasses
   * @function
   * @protected
   */
  getAllCssClasses(idOrClassName) {
    const el = this.getElement(idOrClassName);
    if (el) {
      return el.className.split(' ').map(clazz => clazz.trim());
    }
    return [];
  }

  /**
   * Replace all classes associated to a given element.
   *
   * @param {string} idOrClassName the identifier or class name to match.
   * @param {Array<string>|string} classes the class names.
   * @name replaceAllCssClasses
   * @function
   * @protected
   */
  replaceAllCssClasses(idOrClassName, classes) {
    const el = this.getElement(idOrClassName);
    if (el) {
      if (Array.isArray(classes)) {
        el.className = classes.join(' ');
      } else {
        el.className = classes;
      }
    }
  }

  /**
   * Get the style associated to a given element.
   *
   * @param {string} idOrClassName the identifier or class name to match.
   * @return {CSSStyleDeclaration|null} the element style.
   * @name getStyle
   * @function
   * @protected
   */
  getStyle(idOrClassName) {
    const el = this.getElement(idOrClassName);
    if (el) {
      return el.style;
    }
    return null;
  }

  /**
   * Get the actual computed style associated to a given element.
   *
   * @param {string} idOrClassName the identifier or class name to match.
   * @return {CSSStyleDeclaration|null} the element computed style.
   * @name getComputedStyle
   * @function
   * @protected
   */
  getComputedStyle(idOrClassName) {
    const el = this.getElement(idOrClassName);
    if (el) {
      return window.getComputedStyle(el);
    }
    return null;
  }

  /**
   * Set the text associated to a given element.
   *
   * @param {string} idOrClassName the identifier or class name to match.
   * @param {string} text the text to set.
   * @name setText
   * @function
   * @protected
   */
  setText(idOrClassName, text) {
    const el = this.getElement(idOrClassName);
    if (el) {
      el.textContent = text;
    }
  }

  /**
   * Set the HTML associated to a given element.
   *
   * @param {string} idOrClassName the identifier or class name to match.
   * @param {string} html the html to set.
   * @name setHtml
   * @function
   * @protected
   */
  setHtml(idOrClassName, html) {
    const el = this.getElement(idOrClassName);
    if (el) {
      el.innerHTML = html;
    }
  }

  /**
   * Append an element to a given element.
   *
   * @param {string} idOrClassName the identifier or class name to match.
   * @param {Element} element the element to append.
   * @name replaceContent
   * @function
   * @protected
   */
  replaceContent(idOrClassName, element) {
    const el = this.getElement(idOrClassName);
    if (el) {
      el.innerHTML = '';
      el.appendChild(element);
    }
  }

  /**
   * Load scripts from a list of URL.
   *
   * @param urls a list of URL.
   * @return a {Promise<*>}.
   * @name loadScripts
   * @function
   * @protected
   */
  loadScripts(urls) {

    let promise = null;

    for (let i = 0; i < urls.length; i++) {
      if (promise) {
        promise = promise.then(() => this.loadScript(urls[i]));
      } else {
        promise = this.loadScript(urls[i]);
      }
    }
    return promise;
  }

  /**
   * Load a script from a given URL.
   *
   * @param url a single URL.
   * @return a {Promise<*>}.
   * @preserve The code is extracted from https://gist.github.com/james2doyle/28a59f8692cec6f334773007b31a1523.
   * @name loadScript
   * @function
   * @protected
   */
  loadScript(url) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = url;
      script.async = true;
      script.onerror = function (err) {
        console.log('Script failed : ' + url, err);
        reject(url, script, err);
      }
      script.onload = function () {
        console.log('Script loaded : ' + url);
        resolve(url, script)
      }
      document.head.appendChild(script);
    });
  }

  /**
   * Load styles from a list of URL.
   *
   * @param urls a list of URL.
   * @return a {Promise<*>}.
   * @name loadStyles
   * @function
   * @protected
   */
  loadStyles(urls) {

    let promise = null;

    for (let i = 0; i < urls.length; i++) {
      if (promise) {
        promise = promise.then(() => this.loadStyle(urls[i]));
      } else {
        promise = this.loadStyle(urls[i]);
      }
    }
    return promise;
  }

  /**
   * Load a stylesheet from a given URL.
   *
   * @param url a single URL.
   * @return a {Promise<*>}.
   * @preserve The code is extracted from https://gist.github.com/james2doyle/28a59f8692cec6f334773007b31a1523.
   * @name loadStyle
   * @function
   * @protected
   */
  loadStyle(url) {
    return new Promise((resolve, reject) => {
      const link = document.createElement('link');
      link.href = url;
      link.rel = 'stylesheet';
      document.head.appendChild(link);
      console.log('Stylesheet loaded : ' + url);
      resolve(url, link);
    });
  }
}
