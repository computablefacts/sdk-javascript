'use strict'

import {observers} from "./observers";
import {helpers} from "./helpers";

/**
 * @module blueprintjs
 */
export const blueprintjs = {};

/**
 * Base class that deals with injecting the common styles and scripts.
 *
 * @memberOf module:blueprintjs
 * @type {blueprintjs.Blueprintjs}
 */
blueprintjs.Blueprintjs = class {

  /**
   * @constructor
   */
  constructor() {
  }

  /**
   * Injects Blueprintjs base styles to the DOM.
   *
   * @param {Element} el the element where the styles will be injected.
   * @return {Promise<void>}
   * @name injectStyles
   * @function
   * @public
   */
  static injectStyles(el) {
    return blueprintjs.baseStylesInjected ? Promise.resolve()
        : helpers.injectStyles(el, blueprintjs.Blueprintjs._styles()).then(
            () => blueprintjs.baseStylesInjected = true);
  }

  /**
   * Injects Blueprintjs base scripts to the DOM.
   *
   * @param {Element} el the element where the scripts will be injected.
   * @return {Promise<void>}
   * @name injectScripts
   * @function
   * @public
   */
  static injectScripts(el) {
    return blueprintjs.baseScriptsInjected ? Promise.resolve()
        : helpers.injectScripts(el, blueprintjs.Blueprintjs._scripts()).then(
            () => blueprintjs.baseScriptsInjected = true);
  }

  static _styles() {
    return [
      'https://unpkg.com/normalize.css@^8.0.1',
      'https://unpkg.com/@blueprintjs/icons@^4.0.0/lib/css/blueprint-icons.css',
      'https://unpkg.com/@blueprintjs/core@^4.0.0/lib/css/blueprint.css',
    ];
  }

  static _scripts() {
    return [
      'https://unpkg.com/classnames@^2.2',
      'https://unpkg.com/dom4@^2.1',
      'https://unpkg.com/tslib@~2.3.1',
      'https://unpkg.com/react@^16.14.0/umd/react.production.min.js',
      'https://unpkg.com/react-dom@^16.14.0/umd/react-dom.production.min.js',
      'https://unpkg.com/react-transition-group@^4.4.1/dist/react-transition-group.min.js',
      'https://unpkg.com/@popperjs/core@^2.5.4/dist/umd/popper.js',
      'https://unpkg.com/react-popper@^2.2.4/dist/index.umd.min.js',
      'https://unpkg.com/@blueprintjs/icons@^4.0.0',
      'https://unpkg.com/@blueprintjs/core@^4.0.0',
    ];
  }
}

/**
 * A skeleton to ease the creation of a minimal Blueprintjs table.
 *
 * @memberOf module:blueprintjs
 * @extends {blueprintjs.Blueprintjs}
 * @type {blueprintjs.MinimalTable}
 */
blueprintjs.MinimalTable = class extends blueprintjs.Blueprintjs {

  /**
   * @param {Element} container the element where the table will be inserted.
   * @constructor
   */
  constructor(container) {
    super();
    this.container_ = container;
    this.observers_ = new observers.Subject();
    this.columns_ = [];
    this.rows_ = [];
    this.loadingOptions_ = [];
    this._render();
  }

  /**
   * Injects Blueprintjs table-specific styles to the DOM.
   *
   * @param {Element} el the element where the styles will be injected.
   * @return {Promise<void>}
   * @name injectStyles
   * @function
   * @public
   */
  static injectStyles(el) {
    return blueprintjs.tableStylesInjected ? Promise.resolve()
        : blueprintjs.Blueprintjs.injectStyles(el).then(
            () => helpers.injectStyle(el,
                'https://unpkg.com/@blueprintjs/table@^4.0.0/lib/css/table.css')).then(
            () => blueprintjs.tableStylesInjected = true);
  }

  /**
   * Injects Blueprintjs table-specific scripts to the DOM.
   *
   * @param {Element} el the element where the scripts will be injected.
   * @return {Promise<void>}
   * @name injectScripts
   * @function
   * @public
   */
  static injectScripts(el) {
    return blueprintjs.tableScriptsInjected ? Promise.resolve()
        : blueprintjs.Blueprintjs.injectScripts(el).then(
            () => helpers.injectScript(el,
                'https://unpkg.com/@blueprintjs/table@^4.0.0')).then(
            () => blueprintjs.tableScriptsInjected = true);
  }

  /**
   * In order to avoid a memory leak, properly remove the element from the DOM.
   *
   * @name destroy
   * @function
   * @public
   */
  destroy() {
    ReactDOM.unmountComponentAtNode(this.container_);
  }

  get columns() {
    return this.columns_;
  }

  set columns(value) {
    this.columns_ = value;
    this._render();
  }

  get rows() {
    return this.rows_;
  }

  set rows(values) {
    this.rows_ = values;
    this._render();
  }

  set loadingOptions(values) {
    this.loadingOptions_ = values;
    this._render();
  }

  /**
   * Listen to the `sort` event.
   *
   * @param {Function} callback the callback to call when the event is triggered.
   * @name onSortColumn
   * @function
   * @public
   */
  onSortColumn(callback) {
    this.observers_.register('sort', (column, order) => {
      // console.log('Sort ' + order + ' is ' + column);
      if (callback) {
        callback(column, order);
      }
    });
  }

  /**
   * Listen to the `fetch-next-rows` event.
   *
   * @param {Function} callback the callback to call when the event is triggered.
   * @name onFetchNextRows
   * @function
   * @public
   */
  onFetchNextRows(callback) {
    this.observers_.register('fetch-next-rows', (nextRow) => {
      // console.log('Next row is ' + nextRow);
      if (callback) {
        callback(nextRow);
      }
    });
  }

  _render() {
    ReactDOM.render(this._newTable(), this.container_);
  }

  _newCell(self, rowIdx, colIdx) {
    return React.createElement(Blueprint.Table.Cell, {
      rowIndex: rowIdx,
      columnIndex: colIdx,
      children: React.createElement('div', {}, self.rows_[rowIdx][colIdx]),
    });
  }

  _newColumnHeader(self, column) {
    return React.createElement(Blueprint.Table.ColumnHeaderCell, {
      name: column,
      menuRenderer: () => {

        // Menu item for sorting the column in ascending order
        const menuItemSortAsc = React.createElement(Blueprint.Core.MenuItem, {
          icon: 'sort-asc',
          text: 'Sort Asc',
          onClick: () => self.observers_.notify('sort', column, 'ASC'),
        });

        // Menu item for sorting the column in descending order
        const menuItemSortDesc = React.createElement(Blueprint.Core.MenuItem, {
          icon: 'sort-desc',
          text: 'Sort Desc',
          onClick: () => self.observers_.notify('sort', column, 'DESC'),
        });

        return React.createElement(Blueprint.Core.Menu, {
          children: [menuItemSortAsc, menuItemSortDesc]
        });
      }
    });
  }

  _newColumn(self, column) {
    return React.createElement(Blueprint.Table.Column, {
      name: column,
      cellRenderer: (rowIdx, colIdx) => self._newCell(self, rowIdx, colIdx),
      columnHeaderCellRenderer: () => self._newColumnHeader(self, column),
    });
  }

  _newTable() {
    return React.createElement(Blueprint.Table.Table2, {
      numRows: this.rows_.length,
      children: this.columns_.map(column => this._newColumn(this, column)),
      enableColumnReordering: true,
      loadingOptions: this.loadingOptions_,
      onVisibleCellsChange: (rowIndex, columnIndex) => {
        if (rowIndex.rowIndexEnd + 1 >= this.rows_.length) {
          this.observers_.notify('fetch-next-rows', this.rows_.length);
        }
      },
      onColumnsReordered: (oldIndex, newIndex, length) => {

        this.loadingOptions = [Blueprint.Table.TableLoadingOption.CELLS];

        // First, reorder the rows header
        const oldOrder = this.columns_;
        const newOrder = [];

        for (let i = 0; i < oldOrder.length; i++) {
          if (!(oldIndex <= i && i < oldIndex + length)) {
            newOrder.push(oldOrder[i]);
          }
        }
        for (let k = oldIndex; k < oldIndex + length; k++) {
          newOrder.splice(newIndex + k - oldIndex, 0, oldOrder[k]);
        }

        // console.log('Previous column order was [' + oldOrder.join(', ') + ']');
        // console.log('New column order is [' + newOrder.join(', ') + ']');

        // Then, reorder the rows data
        const oldColumnsIndex = {};
        const newColumnsIndex = {};

        for (let i = 0; i < oldOrder.length; i++) {
          oldColumnsIndex[oldOrder[i]] = i;
        }
        for (let i = 0; i < newOrder.length; i++) {
          newColumnsIndex[i] = newOrder[i];
        }

        const oldRows = this.rows;
        const newRows = [];

        for (let i = 0; i < oldRows.length; i++) {

          const newRow = [];

          for (let j = 0; j < oldRows[i].length; j++) {
            newRow.push(oldRows[i][oldColumnsIndex[newColumnsIndex[j]]]);
          }
          newRows.push(newRow);
        }

        // Next, redraw the table
        this.columns = newOrder;
        this.rows = newRows;
        this.loadingOptions = [];
      },
    });
  }
}