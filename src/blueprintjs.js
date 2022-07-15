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
      'https://unpkg.com/@blueprintjs/popover2@^1.4.2/lib/css/blueprint-popover2.css',
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
      'https://unpkg.com/@blueprintjs/popover2@^1.4.2',
    ];
  }
}

/**
 * A skeleton to ease the creation of a minimal Blueprintjs table component.
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

/**
 * A skeleton to ease the creation of a minimal Blueprintjs select element.
 *
 * @memberOf module:blueprintjs
 * @extends {blueprintjs.Blueprintjs}
 * @type {blueprintjs.MinimalSelect}
 */
blueprintjs.MinimalSelect = class extends blueprintjs.Blueprintjs {

  /**
   * @param {Element} container the element where the table will be inserted.
   * @param {function(*): string} itemToText a function that maps an item to the text to be displayed (optional).
   * @param {function(*): string} itemToLabel a function that maps an item to the label to be displayed (optional).
   * @constructor
   */
  constructor(container, itemToText, itemToLabel) {
    super();
    this.container_ = container;
    this.itemToText_ = itemToText;
    this.itemToLabel_ = itemToLabel;
    this.observers_ = new observers.Subject();
    this.activeItem_ = null;
    this.selectedItem_ = null;
    this.fillContainer_ = true;
    this.disabled_ = false;
    this.filterable_ = true;
    this.items_ = [];
    this.defaultText_ = 'Sélectionnez un élément...';
    this.noResults_ = 'Il n\'y a aucun résultat pour cette recherche.';
    this._render();
  }

  /**
   * Injects Blueprintjs select-specific styles to the DOM.
   *
   * @param {Element} el the element where the styles will be injected.
   * @return {Promise<void>}
   * @name injectStyles
   * @function
   * @public
   */
  static injectStyles(el) {
    return blueprintjs.selectStylesInjected ? Promise.resolve()
        : blueprintjs.Blueprintjs.injectStyles(el).then(
            () => helpers.injectStyle(el,
                'https://unpkg.com/@blueprintjs/select@^4.0.0/lib/css/blueprint-select.css')).then(
            () => blueprintjs.selectStylesInjected = true);
  }

  /**
   * Injects Blueprintjs select-specific scripts to the DOM.
   *
   * @param {Element} el the element where the scripts will be injected.
   * @return {Promise<void>}
   * @name injectScripts
   * @function
   * @public
   */
  static injectScripts(el) {
    return blueprintjs.selectScriptsInjected ? Promise.resolve()
        : blueprintjs.Blueprintjs.injectScripts(el).then(
            () => helpers.injectScript(el,
                'https://unpkg.com/@blueprintjs/select@^4.0.0')).then(
            () => blueprintjs.selectScriptsInjected = true);
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

  get fillContainer() {
    return this.fillContainer_;
  }

  set fillContainer(value) {
    this.fillContainer_ = value;
    this._render();
  }

  get disabled() {
    return this.disabled_;
  }

  set disabled(value) {
    this.disabled_ = value;
    this._render();
  }

  get filterable() {
    return this.filterable_;
  }

  set filterable(value) {
    this.filterable_ = value;
    this._render();
  }

  get items() {
    return this.items_;
  }

  set items(values) {
    this.items_ = values;
    this._render();
  }

  get selectedItem() {
    return this.selectedItem_;
  }

  set selectedItem(value) {
    this.selectedItem_ = value;
    this._render();
  }

  get defaultText() {
    return this.defaultText_;
  }

  set defaultText(value) {
    this.defaultText_ = value;
    this._render();
  }

  get noResults() {
    return this.noResults_;
  }

  set noResults(value) {
    this.noResults_ = value;
    this._render();
  }

  /**
   * Listen to the `selection-change` event.
   *
   * @param {function(*): void} callback the callback to call when the event is triggered.
   * @name onSelectionChange
   * @function
   * @public
   */
  onSelectionChange(callback) {
    this.observers_.register('selection-change', (item) => {
      // console.log('Selected item is ', item);
      if (callback) {
        callback(item);
      }
    });
  }

  /**
   * Listen to the `filter-change` event.
   *
   * @param {function(*): void} callback the callback to call when the event is triggered.
   * @name onFilterChange
   * @function
   * @public
   */
  onFilterChange(callback) {
    this.observers_.register('filter-change', (filter) => {
      // console.log('Filter is ', filter);
      if (callback) {
        callback(filter);
      }
    });
  }

  _render() {
    ReactDOM.render(this._newSelect(), this.container_);
  }

  _newButton() {
    return React.createElement(Blueprint.Core.Button, {
      text: this.selectedItem ? this.itemToText_ ? this.itemToText_(
          this.selectedItem) : this.selectedItem : this.defaultText,
      alignText: 'left',
      rightIcon: 'double-caret-vertical',
      fill: this.fillContainer,
      disabled: this.disabled,
    });
  }

  _newSelect() {
    return React.createElement(Blueprint.Select.Select2, {
      fill: this.fillContainer,
      disabled: this.disabled,
      children: [this._newButton()],
      items: this.items,
      filterable: this.filterable,
      activeItem: this.activeItem_,
      onActiveItemChange: (item) => {
        this.activeItem_ = item;
        this._render();
      },
      onItemSelect: (item) => {
        this.selectedItem = item;
        this.observers_.notify('selection-change', item);
      },
      onQueryChange: (query) => {
        this.observers_.notify('filter-change', query);
      },
      itemRenderer: (item, props) => {
        if (!props.modifiers.matchesPredicate) {
          return null;
        }
        return React.createElement(Blueprint.Core.MenuItem, {
          key: props.index,
          selected: props.modifiers.active,
          text: this.itemToText_ ? this.itemToText_(item) : item,
          label: this.itemToLabel_ ? this.itemToLabel_(item) : '',
          onFocus: props.handleFocus,
          onClick: props.handleClick,
        });
      },
      noResults: React.createElement(Blueprint.Core.MenuItem, {
        text: this.noResults,
        disabled: true,
      }),
      popoverProps: {
        matchTargetWidth: true,
      }
    });
  }
}