/**
 * The list of items to display in the popup.
 */
type ListOfItems = {
    uuid: number;
    elements: HTMLElement[];
}

/**
 * Wrapper around an autocomplete.
 *
 * This component is not meant to be instantiated but to be subclassed.
 */
class Autocomplete extends HTMLElement {

    protected SELECT_VALUE = 'Select value...';
    protected THERE_ARE_NO_RESULTS_FOR_YOUR_SEARCH = 'There are no results for your search.';
    protected POPUP_WIDTH = '100%';
    protected POPUP_HEIGHT = 'auto';
    protected uuid = 0;

    protected static extractTermBeforeCaret(text: string, caret: number): string {

        const prevComma = text.lastIndexOf(',', caret - 1);
        const prevWhitespace = text.lastIndexOf(' ', caret - 1);
        const begin = prevComma < 0 && prevWhitespace < 0 ? 0 : Math.max(prevComma, prevWhitespace);
        const length = caret - begin;

        return text.substr(begin, length).trim();
    }

    private static moveSelection(wrapper: HTMLElement, curItem: HTMLElement | null, nextItem: HTMLElement | null): void {
        if (curItem) {
            curItem.classList.remove('list-item_hover');
        }
        if (nextItem) {

            const top = nextItem.offsetTop;
            const bottom = nextItem.offsetTop + nextItem.offsetHeight;

            const scrollTop = wrapper.scrollTop;
            const scrollBottom = wrapper.scrollTop + wrapper.offsetHeight;

            const isVisible = (top >= scrollTop && bottom <= scrollBottom);

            if (!isVisible && bottom > scrollBottom) {
                wrapper.scrollTop = bottom - wrapper.offsetHeight;
            }
            if (!isVisible && top < scrollTop) {
                wrapper.scrollTop = top;
            }
            nextItem.classList.add('list-item_hover');
        }
    }

    private static selectedItem(shadowRoot: ShadowRoot): HTMLElement | null {
        return shadowRoot.querySelector('.list-item_hover');
    }

    private static previousItem(shadowRoot: ShadowRoot): Element | null {
        const selection = Autocomplete.selectedItem(shadowRoot);
        return selection ? selection.previousElementSibling : null;
    }

    private static nextItem(shadowRoot: ShadowRoot): Element | null {
        const selection = Autocomplete.selectedItem(shadowRoot);
        return selection ? selection.nextElementSibling : null;
    }

    private static firstItem(shadowRoot: ShadowRoot): HTMLElement | null {
        return shadowRoot.querySelector('.list-item:first-child');
    }

    private static lastItem(shadowRoot: ShadowRoot): HTMLElement | null {
        return shadowRoot.querySelector('.list-item:last-child');
    }

    private static position(haystack: string[], needle: string): number {
        for (let i = 0; i < haystack.length; i++) {
            if (needle.trim().toLowerCase().includes(haystack[i].trim().toLowerCase())) {
                return i;
            }
        }
        return -1;
    }

    private static insertSelectedItem(text: string, caret: number, item: string, selections: string[]): string {

        // console.log('text : ' + text);
        // console.log('caret : ' + caret);
        // console.log('selections : ' + selections);

        const prevComma = text.lastIndexOf(',', caret - 1);
        const nextComma = text.indexOf(',', caret);

        // console.log('prev comma : ' + prevComma)
        // console.log('next comma : ' + nextComma)

        const beginGroup = prevComma < 0 ? 0 : prevComma + 1;
        const endGroup = nextComma < 0 ? text.length : nextComma;

        // console.log('begin group : ' + beginGroup)
        // console.log('end group : ' + endGroup)
        // console.log('group : ' + text.substr(beginGroup, endGroup - beginGroup))

        const prevTokens = text.substr(beginGroup, caret - beginGroup);
        const nextTokens = text.substr(caret, endGroup - caret);

        // console.log('words before caret : ' + prevTokens)
        // console.log('words after caret : ' + nextTokens)

        const prevSelectionPosition = Autocomplete.position(selections, prevTokens);
        const nextSelectionPosition = Autocomplete.position(selections, nextTokens);

        // console.log('selection before caret : ' + (prevSelectionPosition < 0 ? 'n/a' : selections[prevSelectionPosition]))
        // console.log('selection after caret : ' + (nextSelectionPosition < 0 ? 'n/a' : selections[nextSelectionPosition]))

        let prefix = text.substr(0, beginGroup).trim();
        let suffix = text.substr(endGroup, text.length - endGroup).trim();

        if (prefix.endsWith(',')) {
            prefix = prefix.substr(0, prefix.length - 1).trim();
        }
        if (suffix.startsWith(',')) {
            suffix = suffix.substr(1, suffix.length - 1).trim();
        }

        // console.log('prefix : ' + prefix)
        // console.log('suffix : ' + suffix)

        if (prevSelectionPosition >= 0) {
            prefix = (prefix.length <= 0 ? '' : prefix + ', ') + selections[prevSelectionPosition];
        }
        if (nextSelectionPosition >= 0) {
            suffix = selections[nextSelectionPosition] + (suffix.length <= 0 ? '' : ', ' + suffix);
        }

        // console.log('adjusted prefix : ' + prefix)
        // console.log('adjusted suffix : ' + suffix)

        return (prefix.length <= 0 ? '' : prefix + ', ') + item.replace(',', '') + (suffix.length <= 0 ? '' : ', ' + suffix);
    }

    constructor() {
        super();
    }

    public connectedCallback(): void {

        const placeholder = this.getAttributeOrDefault('placeholder', this.SELECT_VALUE);
        const popupWidth = this.getAttributeOrDefault('popup-width', this.POPUP_WIDTH);
        const popupHeight = this.getAttributeOrDefault('popup-height', this.POPUP_HEIGHT);

        const shadowRoot: ShadowRoot = this.attachShadow({mode: 'open'});
        shadowRoot.innerHTML = `
            <style>
                .wrapper {
                    position: relative;
                }
                .field {
                    background: #fff;
                    height: 40px;
                    margin: 0;
                    padding: 0 0 0 1em;
                    width: calc(100% - 1em);
                    border: 1px solid #dfe1e5;
                    outline: none;
                }
                .popup {
                    position: absolute;
                    z-index: 3;
                    width: ${popupWidth};
                    background: #fff;
                    box-shadow: 0 4px 6px rgb(32 33 36 / 28%);
                    display: none;
                    margin: 0;
                    padding: 0;
                    border: 0;
                    overflow: hidden;
                }
                .list {
                    max-height: ${popupHeight};
                    overflow-y: auto;
                    list-style-type: none;
                    margin: 0;
                    padding: 0;
                }
                .list-item {
                    padding: 0.5em 0 0.5em 1em;
                }
                .list-item:hover {
                    /* DO NOT REMOVE */
                } 
                .list-item_hover {
                    background: #eee;
                }
            </style>
	    `;

        const template = document.createElement('div');
        template.setAttribute('class', 'wrapper');
        template.insertAdjacentHTML('afterbegin', `
            <input class="field" type="text" placeholder="${placeholder}"/>
            <div class="popup">
                <ul class="list"></ul>
            </div>
        `);

        const node = template.cloneNode(true);
        shadowRoot.appendChild(node);

        const field: HTMLInputElement = shadowRoot.querySelector('.field')!;
        const popup: HTMLDivElement = shadowRoot.querySelector('.popup')!;
        const list: HTMLUListElement = shadowRoot.querySelector('.list')!;

        let text = ''; // the text presently in the input
        let caretStart = 0; // the start position of the caret
        let caretStartPrev = 0; // the previous start position of the caret
        let caretEnd = 0; // the end position of the caret
        let caretEndPrev2 = 0; // the previous end position of the caret
        const selections: string[] = []; // the user-selected items

        field.onkeyup = event => {

            event.stopImmediatePropagation();
            event.preventDefault();

            // Extract the input text
            text = field.value;

            // Save the current and previous caret position in order to be able to override
            // the default behavior on ARROW_UP and ARROW_DOWN
            caretStartPrev = caretStart;
            caretStart = field.selectionStart!;
            caretEndPrev2 = caretEnd;
            caretEnd = field.selectionEnd!;

            if (!text || text.length <= 0) {

                // If the field is empty, close the list and cleanup the DOM
                selections.length = 0;
                list.innerHTML = '';
                popup.style.display = 'none';
            } else if (event.key === 'Escape') {

                // If the user pressed the ESC key, close the list and cleanup the DOM
                selections.length = 0;
                list.innerHTML = '';
                popup.style.display = 'none';
            } else if (event.key === 'ArrowDown') {

                // Override the input default behavior iif the list is visible
                if (popup.style.display === 'block') {

                    // Reset caret position otherwise the selected item might not be inserted at the right place
                    field.selectionStart = caretStartPrev;
                    field.selectionEnd = caretEndPrev2;
                    caretStart = caretStartPrev;
                    caretEnd = caretEndPrev2;

                    // Move selection to the next list item (if any)
                    // Otherwise, select the first list item
                    const curItem = Autocomplete.selectedItem(shadowRoot);
                    const nextItem = Autocomplete.nextItem(shadowRoot);
                    const firstItem = Autocomplete.firstItem(shadowRoot);
                    Autocomplete.moveSelection(list, curItem, (nextItem ? nextItem : firstItem) as HTMLElement | null);
                }
            } else if (event.key === 'ArrowUp') {

                // Override the input default behavior iif the list is visible
                if (popup.style.display === 'block') {

                    // Reset caret position otherwise the selected item might not be inserted at the right place
                    field.selectionStart = caretStartPrev;
                    field.selectionEnd = caretEndPrev2;
                    caretStart = caretStartPrev;
                    caretEnd = caretEndPrev2;

                    // Move selection to the previous list item (if any)
                    // Otherwise, select the last list item
                    const curItem = Autocomplete.selectedItem(shadowRoot);
                    const prevItem = Autocomplete.previousItem(shadowRoot);
                    const lastItem = Autocomplete.lastItem(shadowRoot);
                    Autocomplete.moveSelection(list, curItem, (prevItem ? prevItem : lastItem) as HTMLElement | null);
                }
            } else if (event.key === 'Enter') {

                // Override the input default behavior iif the list is visible
                if (popup.style.display === 'block') {

                    // If a list item has been selected, insert this item at the caret position in the input
                    const selectedItem = Autocomplete.selectedItem(shadowRoot);
                    if (selectedItem) {

                        // Backup caret position to later move it after the inserted item
                        const caretStartTmp = caretStart;
                        const caretEndTmp = caretEnd;

                        // Insert the selected item in the input
                        const itemText = selectedItem.getAttribute('value')!;
                        field.value = Autocomplete.insertSelectedItem(text, caretStart, itemText, selections);
                        selections.push(itemText);

                        // Catch the click event and creates a custom event for the parent(s) to catch
                        const b64Fact = selectedItem.getAttribute('b64fact');
                        if (b64Fact) {
                            shadowRoot.dispatchEvent(new CustomEvent('item-selected', {
                                bubbles: true,
                                composed: true,
                                detail: {
                                    type: 'fact',
                                    value: JSON.parse(atob(b64Fact))
                                },
                            }));
                        } else {
                            shadowRoot.dispatchEvent(new CustomEvent('item-selected', {
                                bubbles: true,
                                composed: true,
                                detail: {
                                    type: 'string',
                                    value: field.value
                                },
                            }));
                        }

                        // Move caret to the end of the inserted text, otherwise it will jump to the end of the input
                        const newCaretStart = field.value.indexOf(',', caretStartTmp);
                        const newCaretEnd = field.value.indexOf(',', caretEndTmp);

                        field.selectionStart = newCaretStart < 0 ? field.value.length : newCaretStart;
                        field.selectionEnd = newCaretEnd < 0 ? field.value.length : newCaretEnd;

                        caretStart = field.selectionStart;
                        caretEnd = field.selectionEnd;
                    }

                    // At last, close the list
                    popup.style.display = 'none';
                }
            } else if (/^[0-9A-Za-zÀ-ÖØ-öø-ÿ-_]$/i.test(event.key)) {

                // Remove previously inserted list items
                list.innerHTML = '';

                // Build a list of items and fill the DOM
                const self = this;
                this.newListOfItems(++this.uuid, text, caretStart).then(response => {
                    if (response && self.uuid === response.uuid) {

                        // At last, render the DOM and display the list items
                        response.elements.forEach(e => list.appendChild(e));
                        popup.style.display = response.elements.length > 0 ? 'block' : 'none';
                    }
                });
            } else {

                // Close the list
                popup.style.display = 'none';
            }
        };
        list.onmouseover = event => {

            event.stopImmediatePropagation();
            event.preventDefault();

            // If a list item is already selected, move the item CSS class from the selected one to the hovered one
            const curItem = Autocomplete.selectedItem(shadowRoot);

            if ((event.target as HTMLElement).classList.contains('list-item')) {
                Autocomplete.moveSelection(list, curItem, event.target as HTMLElement);
            } else {

                // Find the first parent with the 'list-item' class
                const li: HTMLElement = (event.target as HTMLElement).closest('.list-item')!;
                Autocomplete.moveSelection(list, curItem, li);
            }
        };
        list.onclick = event => {

            event.stopImmediatePropagation();
            event.preventDefault();

            // If a list item has been selected, insert this item at the caret position in the input
            const selectedItem = Autocomplete.selectedItem(shadowRoot);
            if (selectedItem) {

                // Backup caret position to later move it after the inserted item
                const caretStartTmp = caretStart;
                const caretEndTmp = caretEnd;

                // Insert the selected item in the input
                const value = selectedItem.getAttribute('value')!;

                if (value !== this.THERE_ARE_NO_RESULTS_FOR_YOUR_SEARCH) {

                    field.value = Autocomplete.insertSelectedItem(text, caretStart, value, selections);
                    selections.push(value);

                    // Catch the click event and creates a custom event for the parent(s) to catch
                    const b64Fact = selectedItem.getAttribute('b64fact');
                    if (b64Fact) {
                        shadowRoot.dispatchEvent(new CustomEvent('item-selected', {
                            bubbles: true,
                            composed: true,
                            detail: {
                                type: 'fact',
                                value: JSON.parse(atob(b64Fact))
                            },
                        }));
                    } else {
                        shadowRoot.dispatchEvent(new CustomEvent('item-selected', {
                            bubbles: true,
                            composed: true,
                            detail: {
                                type: 'string',
                                value: field.value
                            },
                        }));
                    }
                }

                // Move caret to the end of the inserted text, otherwise it will jump to the end of the input
                const newCaretStart = field.value.indexOf(',', caretStartTmp);
                const newCaretEnd = field.value.indexOf(',', caretEndTmp);

                field.selectionStart = newCaretStart < 0 ? field.value.length : newCaretStart;
                field.selectionEnd = newCaretEnd < 0 ? field.value.length : newCaretEnd;

                caretStart = field.selectionStart;
                caretEnd = field.selectionEnd;
            }

            // At last, close the list and cleanup the DOM
            list.innerHTML = '';
            popup.style.display = 'none';

            // Ensure the focus stays in the input
            field.focus();
        };
    }

    /**
     * Create a single `HTMLElement` of type `<li>` to replace the ones displayed in the popup. This `HTMLElement`
     * must represent a single list item.
     *
     * @param value the list item `value`.
     * @param html the list item visible name.
     * @param fact an optional fact with additional information.
     * @returns the newly created `HTMLElement`.
     */
    public newListItem(value: string, html: string, fact?: string): HTMLElement {

        const listItem = document.createElement('li');
        listItem.setAttribute('class', 'list-item');
        listItem.setAttribute('value', value);

        if (fact && fact.trim() !== '') {
            listItem.setAttribute('b64fact', btoa(fact));
        }

        listItem.innerHTML = html;
        return listItem;
    }

    /**
     * Create a list of `HTMLElement` to replace the ones displayed in the popup. This list of `HTMLElement`
     * must represent the full list.
     *
     * @param uuid a unique identifier in order to be able to apply updates in the right order.
     * @param text the text in the `<input>` field of the `Autocomplete` component.
     * @param caret the caret position in the text.
     * @returns a `Promise<ListOfItems>`.
     */
    public newListOfItems(uuid: number, text: string, caret: number): Promise<ListOfItems> {

        // console.log('text : ' + text);
        // console.log('caret : ' + caret);

        const self = this;
        return new Promise(function (resolve) {
            return resolve({
                uuid: uuid,
                elements: [
                    self.newListItem('no-results', self.THERE_ARE_NO_RESULTS_FOR_YOUR_SEARCH)
                ]
            });
        });
    }

    /**
     * Execute `getAttribute` and returns a default value if the attribute does not exist or is `null`
     * or equals to the empty string.
     *
     * @param attribute the attribute name.
     * @param defaultValue the default value to return.
     * @protected
     */
    protected getAttributeOrDefault(attribute: string, defaultValue: string): string {
        if (!this.hasAttribute(attribute)) {
            return defaultValue;
        }
        const value = this.getAttribute(attribute);
        return value && value.trim() !== '' ? value : defaultValue;
    }
}

export {Autocomplete, ListOfItems}