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

  get data() {
    return this.data_;
  }

  set data(values) {
    this.data_ = values;
    this._render();
  }

  /**
   * If the current widget creates more widgets, register them using this method.
   *
   * @param {Widget} widget the widget to register.
   * @name _register
   * @function
   * @protected
   */
  _register(widget) {
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
   * @name _destroy
   * @function
   * @protected
   */
  _destroy() {

    if (this.widgets_) {

      // Remove registered widgets
      for (let i = 0; i < this.widgets_.length; i++) {
        this.widgets_[i]._destroy();
      }
      this.widgets_ = [];
    }

    // Empty the container
    while (this.container_.firstChild) {
      this.container_.removeChild(this.container_.firstChild);
    }
  }

  /**
   * Renders the widget.
   *
   * @name _render
   * @function
   * @protected
   */
  _render() {
    this._destroy();
    const element = this._newElement();
    if (element) {
      this.container_.appendChild(element);
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