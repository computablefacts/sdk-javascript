'use strict'

import {helpers} from "./helpers";

/**
 * @module webcomponents
 */
export const webcomponents = {};

/**
 * A skeleton to ease the creation of web components.
 *
 * @memberOf module:webcomponents
 * @type {webcomponents.WebComponent}
 * @extends {HTMLElement}
 */
webcomponents.WebComponent = class extends HTMLElement {

  /**
   * @constructor
   */
  constructor() {
    super();
    this.attachShadow({mode: 'open'});
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

    const styles = this.externalStyles();
    const scripts = this.externalScripts();
    const template = this.template();

    const wrapper = document.createElement('div');
    wrapper.id = 'wcw'; // wcw = Web Component Wrapper
    this.shadowRoot.appendChild(wrapper);

    if (styles && styles.length > 0 && scripts && scripts.length > 0) {
      helpers.injectStyles(wrapper, styles).then(() => {
        helpers.injectScripts(wrapper, scripts).then(() => {
          if (template !== '') {
            wrapper.insertAdjacentHTML('beforeend', template);
          }
          this.renderedCallback();
        });
      });
    } else if ((!styles || styles.length === 0) && scripts && scripts.length
        > 0) {
      helpers.injectScripts(wrapper, scripts).then(() => {
        if (template !== '') {
          wrapper.insertAdjacentHTML('beforeend', template);
        }
        this.renderedCallback();
      });
    } else if (styles && styles.length > 0 && (!scripts || scripts.length
        === 0)) {
      helpers.injectStyles(wrapper, styles).then(() => {
        if (template !== '') {
          wrapper.insertAdjacentHTML('beforeend', template);
        }
        this.renderedCallback();
      });
    } else {
      if (template !== '') {
        wrapper.insertAdjacentHTML('beforeend', template);
      }
      this.renderedCallback();
    }
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
   * Called after the `template` has been added to the DOM.
   *
   * @name renderedCallback
   * @function
   * @protected
   * @override
   */
  renderedCallback() {
  }

  /**
   * A list of stylesheets URL.
   *
   * @return {Array<string>} an array of URL.
   * @name externalStyles
   * @function
   * @protected
   * @override
   */
  externalStyles() {
    return [];
  }

  /**
   * A list of scripts URL.
   *
   * @return {Array<string>} an array of URL.
   * @name externalScripts
   * @function
   * @protected
   * @override
   */
  externalScripts() {
    return [];
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
}
