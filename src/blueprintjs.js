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
   * @param {function(number, number, *): ReactElement} cellRenderer a function in charge of rendering a single cell (optional).
   * @constructor
   */
  constructor(container, cellRenderer) {
    super();
    this.container_ = container;
    this.cellRenderer_ = cellRenderer;
    this.observers_ = new observers.Subject();
    this.columns_ = [];
    this.columnTypes_ = [];
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

  get columnTypes() {
    return this.columnTypes_;
  }

  set columnTypes(values) {
    this.columnTypes_ = values;
    this._render();
  }

  get rows() {
    return this.rows_;
  }

  set rows(values) {
    this.rows_ = values;
    this._render();
  }

  get loadingOptions() {
    return this.loadingOptions_;
  }

  set loadingOptions(values) {
    this.loadingOptions_ = values;
    this._render();
  }

  /**
   * Listen to the `sort` event.
   *
   * @param {function(string, string): void} callback the callback to call when the event is triggered.
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
   * @param {function(number): void} callback the callback to call when the event is triggered.
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

  /**
   * Listen to the `selection-change` event.
   *
   * @param {function(Array<Object>): void} callback the callback to call when the event is triggered.
   * @name onSelectionChange
   * @function
   * @public
   */
  onSelectionChange(callback) {
    this.observers_.register('selection-change', (regions) => {
      // console.log('Selected regions are ', regions);
      if (callback) {

        const cells = [];

        for (let i = 0; i < regions.length; i++) {

          const rows = regions[i].rows;
          const columns = regions[i].cols;

          for (let j = rows[0]; j <= rows[1]; j++) {
            for (let k = columns[0]; k <= columns[1]; k++) {
              cells.push({row_idx: j, col_idx: k, value: this.rows[j][k]});
            }
          }
        }
        callback(cells);
      }
    });
  }

  _render() {
    ReactDOM.render(this._newTable(), this.container_);
  }

  _newCell(self, rowIdx, colIdx) {
    return self.cellRenderer_ ? self.cellRenderer_(rowIdx, colIdx,
        self.rows[rowIdx][colIdx]) : React.createElement(Blueprint.Table.Cell, {
      rowIndex: rowIdx,
      columnIndex: colIdx,
      style: {
        'text-align': self.columnTypes[colIdx] === 'number' ? 'right' : 'left'
      },
      children: React.createElement('div', {}, self.rows[rowIdx][colIdx]),
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
      numRows: this.rows.length,
      children: this.columns.map(column => this._newColumn(this, column)),
      enableColumnReordering: true,
      loadingOptions: this.loadingOptions,
      onSelection: (regions) => {
        this.observers_.notify('selection-change', regions);
      },
      onVisibleCellsChange: (rowIndex, columnIndex) => {
        if (rowIndex.rowIndexEnd + 1 >= this.rows.length) {
          this.observers_.notify('fetch-next-rows', this.rows.length);
        }
      },
      onColumnsReordered: (oldIndex, newIndex, length) => {

        this.loadingOptions = [Blueprint.Table.TableLoadingOption.CELLS];

        // First, reorder the rows header
        const oldColumnsOrder = this.columns;
        const newColumnsOrder = [];

        const oldColumnTypes = this.columnTypes;
        const newColumnTypes = [];

        for (let i = 0; i < oldColumnsOrder.length; i++) {
          if (!(oldIndex <= i && i < oldIndex + length)) {
            newColumnsOrder.push(oldColumnsOrder[i]);
            newColumnTypes.push(oldColumnTypes[i]);
          }
        }
        for (let k = oldIndex; k < oldIndex + length; k++) {
          newColumnsOrder.splice(newIndex + k - oldIndex, 0,
              oldColumnsOrder[k]);
          newColumnTypes.splice(newIndex + k - oldIndex, 0,
              oldColumnTypes[k]);
        }

        // console.log('Previous column order was [' + oldColumnsOrder.join(', ') + ']');
        // console.log('New column order is [' + newColumnsOrder.join(', ') + ']');

        // console.log('Previous column types were [' + oldColumnTypes.join(', ') + ']');
        // console.log('New column types is [' + newColumnTypes.join(', ') + ']');

        // Then, reorder the rows data
        const oldColumnsIndex = {};
        const newColumnsIndex = {};

        for (let i = 0; i < oldColumnsOrder.length; i++) {
          oldColumnsIndex[oldColumnsOrder[i]] = i;
        }
        for (let i = 0; i < newColumnsOrder.length; i++) {
          newColumnsIndex[i] = newColumnsOrder[i];
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
        this.columns = newColumnsOrder;
        this.columnTypes = newColumnTypes;
        this.rows = newRows;
        this.loadingOptions = [];
      },
    });
  }
}