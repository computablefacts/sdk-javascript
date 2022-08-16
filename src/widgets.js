'use strict'

/**
 * @module widgets
 */
export const widgets = {};

/**
 * A skeleton to ease the creation of simple widgets.
 *
 * @memberOf module:widgets
 * @type {widgets.Widget}
 */
widgets.Widget = class {

  /**
   * @param {Element} container the parent element.
   * @constructor
   */
  constructor(container) {
    this.container_ = container;
  }

  /**
   * Returns the widget parent element.
   *
   * @return {Element} the parent element.
   * @name container
   * @function
   * @public
   */
  get container() {
    return this.container_;
  }

  /**
   * Sets the widget parent element.
   *
   * @param container
   * @name container
   * @function
   * @public
   */
  set container(container) {
    this.container_ = container;
    this.render();
  }

  /**
   * If the current widget creates more widgets, register them using this method.
   * It allows the current widget to properly removes its children from the DOM.
   *
   * @param {Widget} widget the widget to register.
   * @name register
   * @function
   * @protected
   */
  register(widget) {
    if (widget) {
      if (!this.widgets_) {
        this.widgets_ = [];
      }
      this.widgets_.push(widget);
    }
  }

  /**
   * In order to avoid a memory leak, properly remove the widget from the DOM.
   *
   * @name destroy
   * @function
   * @public
   */
  destroy() {

    if (this.widgets_) {

      // Remove registered widgets
      for (let i = 0; i < this.widgets_.length; i++) {
        this.widgets_[i].destroy();
      }
      this.widgets_ = [];
    }

    // Empty the container
    while (this.container.firstChild) {
      this.container.removeChild(this.container.firstChild);
    }
  }

  /**
   * Renders the widget.
   *
   * @name render
   * @function
   * @public
   */
  render() {
    this.destroy();
    const element = this._newElement();
    if (element) {
      this.container.appendChild(element);
    }
  }

  /**
   * Initializes the widget.
   *
   * @return {Element|null}
   * @name _newElement
   * @function
   * @protected
   */
  _newElement() {
    return null;
  }
}