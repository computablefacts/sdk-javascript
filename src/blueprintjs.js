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
   * @param {Element} container the parent element.
   * @constructor
   */
  constructor(container) {
    this.container_ = container;
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
      'https://unpkg.com/@blueprintjs/icons@4.0.0/lib/css/blueprint-icons.css',
      'https://unpkg.com/@blueprintjs/core@4.6.1/lib/css/blueprint.css',
      'https://unpkg.com/@blueprintjs/popover2@1.4.3/lib/css/blueprint-popover2.css',
    ];
  }

  static _scripts() {
    return [
      'https://unpkg.com/classnames@2.3.1',
      'https://unpkg.com/dom4@2.1.6',
      'https://unpkg.com/tslib@2.3.1',
      'https://unpkg.com/react@16.14.0/umd/react.production.min.js',
      'https://unpkg.com/react-dom@16.14.0/umd/react-dom.production.min.js',
      'https://unpkg.com/react-transition-group@4.4.2/dist/react-transition-group.min.js',
      'https://unpkg.com/@popperjs/core@2.11.5/dist/umd/popper.min.js',
      'https://unpkg.com/react-popper@2.3.0/dist/index.umd.min.js',
      'https://unpkg.com/@blueprintjs/icons@4.4.0',
      'https://unpkg.com/@blueprintjs/core@4.6.1',
      'https://unpkg.com/@blueprintjs/popover2@1.4.3',
    ];
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

  /**
   * Renders the component.
   *
   * @name _render
   * @function
   * @protected
   */
  _render() {
    const element = this._newElement();
    if (element) {
      ReactDOM.render(element, this.container_);
    }
  }

  /**
   * Initializes the component.
   *
   * @return {ReactElement|null}
   * @name _newElement
   * @function
   * @protected
   */
  _newElement() {
    return null;
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
   * @param {Element} container the parent element.
   * @param {function(number, number, *): ReactElement} cellRenderer a function in charge of rendering a single cell (optional).
   * @constructor
   */
  constructor(container, cellRenderer) {
    super(container);
    this.cellRenderer_ = cellRenderer;
    this.observers_ = new observers.Subject();
    this.columns_ = [];
    this.columnWidths_ = [];
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
                'https://unpkg.com/@blueprintjs/table@4.4.0')).then(
            () => blueprintjs.tableScriptsInjected = true);
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

  get columnWidths() {
    return this.columnWidths_;
  }

  set columnWidths(values) {
    this.columnWidths_ = values;
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

          if (!regions[i].hasOwnProperty('rows')) {
            continue; // ignore the region if a whole column has been selected
          }
          if (!regions[i].hasOwnProperty('cols')) {
            continue; // ignore the region if a whole row has been selected
          }

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

  _newElement() {
    return React.createElement(Blueprint.Table.Table2, {
      numRows: this.rows.length,
      children: this.columns.map(column => this._newColumn(this, column)),
      enableColumnReordering: true,
      loadingOptions: this.loadingOptions,
      columnWidths: this.columnWidths.length <= 0 ? null : this.columnWidths,
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
   * @param {Element} container the parent element.
   * @param {function(*): string} itemToText a function that maps an item to the text to be displayed (optional).
   * @param {function(*): string} itemToLabel a function that maps an item to the label to be displayed (optional).
   * @constructor
   */
  constructor(container, itemToText, itemToLabel) {
    super(container);
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
                'https://unpkg.com/@blueprintjs/select@4.5.0/lib/css/blueprint-select.css')).then(
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
                'https://unpkg.com/@blueprintjs/select@4.5.0')).then(
            () => blueprintjs.selectScriptsInjected = true);
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

  _newElement() {
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

/**
 * A skeleton to ease the creation of a minimal Blueprintjs slider element.
 *
 * @memberOf module:blueprintjs
 * @extends {blueprintjs.Blueprintjs}
 * @type {blueprintjs.MinimalSlider}
 */
blueprintjs.MinimalSlider = class extends blueprintjs.Blueprintjs {

  /**
   * @param {Element} container the parent element.
   * @param {number} min the minimum value.
   * @param {number} max the maximum value.
   * @param {number} increment the internal increment.
   * @param {number} displayIncrement the display increment.
   * @constructor
   */
  constructor(container, min, max, increment, displayIncrement) {
    super(container);
    this.min_ = min;
    this.max_ = max;
    this.increment_ = increment;
    this.displayIncrement_ = displayIncrement;
    this.value_ = min;
    this.observers_ = new observers.Subject();
    this._render();
  }

  get value() {
    return this.value_;
  }

  set value(value) {
    this.value_ = value;
    this._render();
  }

  /**
   * Listen to the `selection-change` event.
   *
   * @param {function(number): void} callback the callback to call when the event is triggered.
   * @name onSelectionChange
   * @function
   * @public
   */
  onSelectionChange(callback) {
    this.observers_.register('selection-change', (value) => {
      // console.log('Selected value is ', item);
      if (callback) {
        callback(value);
      }
    });
  }

  _newElement() {
    return React.createElement(Blueprint.Core.Slider, {
      min: this.min_,
      max: this.max_,
      stepSize: this.increment_,
      labelStepSize: this.displayIncrement_,
      value: this.value,
      onChange: (value) => {
        this.value = value;
        this.observers_.notify('selection-change', value);
      },
    });
  }
}

/**
 * A skeleton to ease the creation of a minimal Blueprintjs drawer element.
 *
 * @memberOf module:blueprintjs
 * @extends {blueprintjs.Blueprintjs}
 * @type {blueprintjs.MinimalDrawer}
 */
blueprintjs.MinimalDrawer = class extends blueprintjs.Blueprintjs {

  /**
   * @param {Element} container the parent element.
   * @param {string} width the drawer width in pixels or percents (optional).
   * @constructor
   */
  constructor(container, width) {
    super(container);
    this.observers_ = new observers.Subject();
    this.show_ = false;
    this.width_ = width ? width : '75%';
    this._render();
  }

  get show() {
    return this.show_;
  }

  set show(value) {
    this.show_ = value;
    this._render();
  }

  /**
   * Listen to the `opening` event.
   *
   * @param {function(Element): void} callback the callback to call when the event is triggered.
   * @name onOpen
   * @function
   * @public
   */
  onOpen(callback) {
    this.observers_.register('opening', (el) => {
      if (callback) {
        callback(el);
      }
    });
  }

  /**
   * Listen to the `opened` event.
   *
   * @param {function(Element): void} callback the callback to call when the event is triggered.
   * @name onOpened
   * @function
   * @public
   */
  onOpened(callback) {
    this.observers_.register('opened', (el) => {
      if (callback) {
        callback(el);
      }
    });
  }

  /**
   * Listen to the `closing` event.
   *
   * @param {function(Element): void} callback the callback to call when the event is triggered.
   * @name onClose
   * @function
   * @public
   */
  onClose(callback) {
    this.observers_.register('closing', (el) => {
      if (callback) {
        callback(el);
      }
    });
  }

  _newElement() {
    return React.createElement(Blueprint.Core.Drawer, {
      isOpen: this.show,
      size: this.width_,
      position: Blueprint.Core.Position.RIGHT,
      onOpening: (el) => this.observers_.notify('opening', el),
      onOpened: (el) => this.observers_.notify('opened', el),
      onClose: () => this.show = false,
      onClosed: (el) => this.observers_.notify('closing', el),
    });
  }
}

/**
 * A skeleton to ease the creation of a minimal Blueprintjs tabs element.
 *
 * @memberOf module:blueprintjs
 * @extends {blueprintjs.Blueprintjs}
 * @type {blueprintjs.MinimalTabs}
 */
blueprintjs.MinimalTabs = class extends blueprintjs.Blueprintjs {

  /**
   * @param {Element} container the parent element.
   * @constructor
   */
  constructor(container) {
    super(container);
    this.observers_ = new observers.Subject();
    this.tabs_ = [];
    this._render();
  }

  /**
   * Add a single tab to the nav bar.
   *
   * @param {string} name the tab name.
   * @param {Element} panel the tab content.
   * @name addTab
   * @function
   * @public
   */
  addTab(name, panel) {
    this.tabs_.push({
      name: name,
      panel: panel,
      disabled: false,
      is_selected: false,
      ref: React.createRef(),
    });
    this._render();
  }

  /**
   * Remove a single tab from the nav bar.
   *
   * @param {string} name the tab name.
   * @name removeTab
   * @function
   * @public
   */
  removeTab(name) {
    this.tabs_ = this.tabs_.filter(tab => tab.name !== name);
    this._render();
  }

  /**
   * Select the tab to display.
   *
   * @param {string} name the tab name.
   * @name selectTab
   * @function
   * @public
   */
  selectTab(name) {
    let selectedTab = null;
    this.tabs_.forEach(tab => {
      if (tab.name !== name) {
        tab.is_selected = false;
      } else {
        tab.is_selected = true;
        selectedTab = tab;
      }
    });
    if (selectedTab) {
      selectedTab.ref.current.appendChild(selectedTab.panel);
    }
    this._render();
  }

  /**
   * Listen to the `selection-change` event.
   *
   * @param {function(): void} callback the callback to call when the event is triggered.
   * @name onSelectionChange
   * @function
   * @public
   */
  onSelectionChange(callback) {
    this.observers_.register('selection-change', (oldTabId, newTabId) => {
      // console.log('Selected tab is ' + newTabId);
      if (callback) {
        callback(oldTabId, newTabId);
      }
    });
  }

  _newTab(tab) {
    return React.createElement(Blueprint.Core.Tab, {
      id: tab.name,
      title: tab.name,
      panel: React.createElement('div', {
        ref: tab.ref,
      }),
      disabled: tab.disabled,
    });
  }

  _newElement() {
    const selectedTab = this.tabs_.find(tab => tab.is_selected);
    return React.createElement(Blueprint.Core.Tabs, {
      id: 'tabs',
      children: this.tabs_.map(tab => this._newTab(tab)),
      selectedTabId: selectedTab ? selectedTab.name : null,
      onChange: (newTabId, oldTabId) => {
        this.selectTab(newTabId);
        this.observers_.notify('selection-change', oldTabId, newTabId);
      },
    });
  }
}

/**
 * A skeleton to ease the creation of a minimal Blueprintjs spinner element.
 *
 * @memberOf module:blueprintjs
 * @extends {blueprintjs.Blueprintjs}
 * @type {blueprintjs.MinimalSpinner}
 */
blueprintjs.MinimalSpinner = class extends blueprintjs.Blueprintjs {

  /**
   * @param {Element} container the parent element.
   * @param {string} size the spinner size in {'small', 'standard', 'large'}
   * @constructor
   */
  constructor(container, size) {
    super(container);
    this.value_ = null;
    if (size === 'small') {
      this.size_ = Blueprint.Core.SpinnerSize.SMALL;
    } else if (size === 'large') {
      this.size_ = Blueprint.Core.SpinnerSize.LARGE;
    } else {
      this.size_ = Blueprint.Core.SpinnerSize.STANDARD;
    }
    this._render();
  }

  /**
   * Represents how far along an operation is.
   *
   * @param {number} value a value between 0 and 1 (inclusive) representing how far along an operation is.
   * @name advance
   * @function
   * @public
   */
  advance(value) {
    this.value_ = value;
    this._render();
  }

  _newElement() {
    return React.createElement(Blueprint.Core.Spinner, {
      value: this.value_,
      size: this.size_,
    });
  }
}

/**
 * A skeleton to ease the creation of a minimal Blueprintjs switch element.
 *
 * @memberOf module:blueprintjs
 * @extends {blueprintjs.Blueprintjs}
 * @type {blueprintjs.MinimalSwitch}
 */
blueprintjs.MinimalSwitch = class extends blueprintjs.Blueprintjs {

  /**
   * @param {Element} container the parent element.
   * @param {boolean} checked true iif the control should initially be checked, false otherwise (optional).
   * @param {string} label the switch label (optional).
   * @param {string} labelPosition the switch label position (in {left, right}) in respect to the element (optional).
   * @param {string} labelChecked the text to display inside the switch indicator when checked (optional).
   * @param {string} labelUnchecked the text to display inside the switch indicator when unchecked (optional).
   * @constructor
   */
  constructor(container, checked, label, labelPosition, labelChecked,
      labelUnchecked) {
    super(container);
    this.checked_ = checked;
    this.label_ = label;
    this.switchPosition_ = labelPosition === 'left'
        ? Blueprint.Core.Alignment.RIGHT : Blueprint.Core.Alignment.LEFT;
    this.labelChecked_ = labelChecked;
    this.labelUnchecked_ = labelUnchecked;
    this.observers_ = new observers.Subject();
    this.disabled_ = false;
    this._render();
  }

  get disabled() {
    return this.disabled_;
  }

  set disabled(value) {
    this.disabled_ = value;
    this._render();
  }

  get checked() {
    return this.checked_;
  }

  set checked(value) {
    this.checked_ = value;
    this._render();
  }

  /**
   * Listen to the `selection-change` event.
   *
   * @param {function(boolean): void} callback the callback to call when the event is triggered.
   * @name onSelectionChange
   * @function
   * @public
   */
  onSelectionChange(callback) {
    this.observers_.register('selection-change', (value) => {
      // console.log('Selected option is ' + (value ? 'checked' : 'unchecked'));
      if (callback) {
        callback(value ? 'checked' : 'unchecked');
      }
    });
  }

  _newElement() {
    return React.createElement(Blueprint.Core.Switch, {
      disabled: this.disabled_,
      checked: this.checked_,
      label: this.label_,
      alignIndicator: this.switchPosition_,
      innerLabel: this.labelUnchecked_,
      innerLabelChecked: this.labelChecked_,
      onChange: () => {
        this.checked = !this.checked;
        this.observers_.notify('selection-change', this.checked);
      },
    });
  }
}

/**
 * A skeleton to ease the creation of a minimal Blueprintjs toast element.
 *
 * @memberOf module:blueprintjs
 * @extends {blueprintjs.Blueprintjs}
 * @type {blueprintjs.MinimalToast}
 */
blueprintjs.MinimalToast = class extends blueprintjs.Blueprintjs {

  /**
   * @param {Element} container the parent element.
   * @param {string} message the message to display.
   * @param {string} intent the message intent in {none, primary, success, warning, danger} (optional).
   * @param {number} timeout the number of milliseconds to wait before automatically dismissing the toast (optional).
   * @constructor
   */
  constructor(container, message, intent, timeout) {
    super(container);
    this.timeout_ = timeout;
    this.message_ = message;
    if (intent === 'primary') {
      this.intent_ = Blueprint.Core.Intent.PRIMARY;
      this.icon_ = null;
    } else if (intent === 'success') {
      this.intent_ = Blueprint.Core.Intent.SUCCESS;
      this.icon_ = 'tick';
    } else if (intent === 'warning') {
      this.intent_ = Blueprint.Core.Intent.WARNING;
      this.icon_ = 'warning-sign';
    } else if (intent === 'danger') {
      this.intent_ = Blueprint.Core.Intent.DANGER;
      this.icon_ = 'warning-sign';
    } else {
      this.intent_ = Blueprint.Core.Intent.NONE;
      this.icon_ = null;
    }
    this.observers_ = new observers.Subject();
    this._render();
  }

  /**
   * Listen to the `dismiss` event.
   *
   * @param {function(void): void} callback the callback to call when the event is triggered.
   * @name onDismiss
   * @function
   * @public
   */
  onDismiss(callback) {
    this.observers_.register('dismiss', (self) => {
      // console.log('Toast dismissed!');
      if (callback) {
        callback();
      }
    });
  }

  _newElement() {
    return React.createElement(Blueprint.Core.Toast, {
      intent: this.intent_,
      icon: this.icon_,
      message: React.createElement('div', {}, this.message_),
      timeout: this.timeout_,
      onDismiss: () => this.observers_.notify('dismiss', this),
    });
  }
}

/**
 * A skeleton to ease the creation of a minimal Blueprintjs toaster element.
 *
 * @memberOf module:blueprintjs
 * @extends {blueprintjs.Blueprintjs}
 * @type {blueprintjs.MinimalToaster}
 */
blueprintjs.MinimalToaster = class extends blueprintjs.Blueprintjs {

  /**
   * @param {Element} container the parent element.
   * @constructor
   */
  constructor(container) {
    super(container);
    this.toasts_ = [];
    this._render();
  }

  /**
   * Create and display a new toast.
   *
   * @param {string} message the message to display.
   * @param {string} intent the message intent in {none, primary, success, warning, danger} (optional).
   * @param {number} timeout the number of milliseconds to wait before automatically dismissing the toast (optional).
   * @name toast
   * @function
   * @public
   */
  toast(message, intent, timeout) {
    const toast = new blueprintjs.MinimalToast(this.container_, message, intent,
        timeout);
    toast.el_ = toast._newElement();
    toast.onDismiss(() => {
      this.toasts_ = this.toasts_.filter(t => t !== toast);
      this._render();
    });
    this.toasts_.push(toast);
    this._render();
  }

  _newElement() {
    return React.createElement(Blueprint.Core.Toaster, {
      children: this.toasts_.map(toast => toast.el_),
      position: Blueprint.Core.Position.TOP,
    });
  }
}

/**
 * A skeleton to ease the creation of a minimal Blueprintjs card element.
 *
 * @memberOf module:blueprintjs
 * @extends {blueprintjs.Blueprintjs}
 * @type {blueprintjs.MinimalCard}
 */
blueprintjs.MinimalCard = class extends blueprintjs.Blueprintjs {

  /**
   * @param {Element} container the parent element.
   * @param {Element} body the card body.
   * @constructor
   */
  constructor(container, body) {
    super(container);
    this.elevation_ = 0;
    this.interactive_ = false;
    this.observers_ = new observers.Subject();
    this.body_ = React.createElement('div', {
      ref: React.createRef(),
    });
    this._render(); // this.body_ must be rendered first!
    this.body_.ref.current.appendChild(body);
    this._render();
  }

  get elevation() {
    return this.elevation_;
  }

  set elevation(value) {
    this.elevation_ = !value ? 0 : value > 4 ? 4 : value;
    this._render();
  }

  get interactive() {
    return this.interactive_;
  }

  set interactive(value) {
    this.interactive_ = value;
    this._render();
  }

  /**
   * Listen to the `click` event.
   *
   * @param {function(void): void} callback the callback to call when the event is triggered.
   * @name onClick
   * @function
   * @public
   */
  onClick(callback) {
    this.observers_.register('click', (self) => {
      // console.log('Card clicked!');
      if (callback) {
        callback();
      }
    });
  }

  _newElement() {
    return React.createElement(Blueprint.Core.Card, {
      children: [this.body_],
      elevation: this.elevation_,
      interactive: this.interactive_,
      onClick: () => this.observers_.notify('click', this),
    });
  }
}