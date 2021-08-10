/**
 * Wrapper around an autocomplete. To be truly useful, this component must be subclassed and implement `fetchData()`.
 *
 * Example:
 * ```html
 * <!DOCTYPE html>
 * <html lang="en">
 * <head>
 *   <meta charset="UTF-8">
 * </head>
 * <body>
 *   <div style="width: 50%">
 *     <autocomplete></autocomplete>
 *   </div>
 *   <div>
 *     The popup will be displayed above this text.
 *   </div>
 * </body>
 * <script src="https://unpkg.com/@computablefacts/sdk-javascript/dist/bundle/index.js"></script>
 * <script>
 *   cf.webComponents.registerAutocomplete()
 * </script>
 * </html>
 * ```
 */
class Autocomplete extends HTMLElement {

    private static moveSelection(curItem: HTMLElement | null, nextItem: HTMLElement | null): void {
        if (curItem) {
            curItem.classList.remove('cf_input-terms_list-item_hover');
        }
        if (nextItem) {
            nextItem.classList.add('cf_input-terms_list-item_hover');
        }
    }

    private static selectedItem(shadowRoot: ShadowRoot): HTMLElement | null {
        return shadowRoot.querySelector('.cf_input-terms_list-item_hover');
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
        return shadowRoot.querySelector('.cf_input-terms_list-item:first-child');
    }

    private static lastItem(shadowRoot: ShadowRoot): HTMLElement | null {
        return shadowRoot.querySelector('.cf_input-terms_list-item:last-child');
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

        return (prefix.length <= 0 ? '' : prefix + ', ') + item + (suffix.length <= 0 ? '' : ', ' + suffix);
    }

    constructor() {
        super();
    }

    public connectedCallback(): void {

        const placeholder = this.hasAttribute('placeholder') ? this.getAttribute('placeholder') : 'Select value...';

        const currentDocument: Document = document.currentScript!.ownerDocument;
        const shadowRoot: ShadowRoot = this.attachShadow({mode: 'open'});
        shadowRoot.innerHTML = `
            <style>
                .cf_input-terms_wrapper {
                    position: relative;
                }
                .cf_input-terms_field {
                    background: #fff;
                    height: 40px;
                    margin: 0;
                    padding: 0 0 0 1em;
                    width: calc(100% - 1em);
                    border: 1px solid #dfe1e5;
                    outline: none;
                }
                .cf_input-terms_popup {
                    position: absolute;
                    z-index: 3;
                    width: 100%;
                    background: #fff;
                    box-shadow: 0 4px 6px rgb(32 33 36 / 28%);
                    display: none;
                    margin: 0;
                    padding: 0;
                    border: 0;
                    overflow: hidden;
                }
                .cf_input-terms_list {
                    list-style-type: none;
                    margin: 0;
                    padding: 0;
                }
                .cf_input-terms_list-item {
                    padding: 0.5em 0 0.5em 1em;
                }
                .cf_input-terms_list-item:hover {
                    
                } 
                .cf_input-terms_list-item_hover {
                    background: #eee;
                }
            </style>
	    `;

        const template = currentDocument.createElement('div');
        template.setAttribute('class', 'cf_input-terms_wrapper');
        template.insertAdjacentHTML('afterbegin', `
            <input class="cf_input-terms_field" type="text" placeholder="${placeholder}"/>
            <div class="cf_input-terms_popup">
                <ul class="cf_input-terms_list"></ul>
            </div>
        `);

        const node = template.cloneNode(true);
        shadowRoot.appendChild(node);

        const field: HTMLInputElement = shadowRoot.querySelector('.cf_input-terms_field')!;
        const popup: HTMLDivElement = shadowRoot.querySelector('.cf_input-terms_popup')!;
        const list: HTMLUListElement = shadowRoot.querySelector('.cf_input-terms_list')!;

        let text = ''; // the text presently in the input
        let caret = 0; // the start position of the caret
        let caretPrev = 0; // the previous start position of the caret
        let caret2 = 0; // the end position of the caret
        let caretPrev2 = 0; // the previous end position of the caret
        const selections: string[] = []; // the user-selected items

        field.onkeyup = event => {

            event.stopImmediatePropagation();
            event.preventDefault();

            // Extract the input text
            text = field.value;

            // Save the current and previous caret position in order to be able to override
            // the default behavior on ARROW_UP and ARROW_DOWN
            caretPrev = caret;
            caret = field.selectionStart!;
            caretPrev2 = caret2;
            caret2 = field.selectionEnd!;

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
                    field.selectionStart = caretPrev;
                    field.selectionEnd = caretPrev2;
                    caret = caretPrev;
                    caret2 = caretPrev2;

                    // Move selection to the next list item (if any)
                    // Otherwise, select the first list item
                    const curItem = Autocomplete.selectedItem(shadowRoot);
                    const nextItem = Autocomplete.nextItem(shadowRoot);
                    const firstItem = Autocomplete.firstItem(shadowRoot);
                    Autocomplete.moveSelection(curItem, (nextItem ? nextItem : firstItem) as HTMLElement | null);
                }
            } else if (event.key === 'ArrowUp') {

                // Override the input default behavior iif the list is visible
                if (popup.style.display === 'block') {

                    // Reset caret position otherwise the selected item might not be inserted at the right place
                    field.selectionStart = caretPrev;
                    field.selectionEnd = caretPrev2;
                    caret = caretPrev;
                    caret2 = caretPrev2;

                    // Move selection to the previous list item (if any)
                    // Otherwise, select the last list item
                    const curItem = Autocomplete.selectedItem(shadowRoot);
                    const prevItem = Autocomplete.previousItem(shadowRoot);
                    const lastItem = Autocomplete.lastItem(shadowRoot);
                    Autocomplete.moveSelection(curItem, (prevItem ? prevItem : lastItem) as HTMLElement | null);
                }
            } else if (event.key === 'Enter') {

                // Override the input default behavior iif the list is visible
                if (popup.style.display === 'block') {

                    // If a list item has been selected, insert this item at the caret position in the input
                    const selectedItem = Autocomplete.selectedItem(shadowRoot);
                    if (selectedItem) {

                        const itemId = selectedItem.getAttribute('value');
                        const itemText = selectedItem.innerText;

                        field.value = Autocomplete.insertSelectedItem(text, caret, itemText, selections);
                        selections.push(itemText);
                    }

                    // At last, close the list
                    popup.style.display = 'none';
                }
            } else if (/^[0-9A-Za-zÀ-ÖØ-öø-ÿ-_]$/i.test(event.key)) {

                // Remove previously inserted list items
                list.innerHTML = '';

                // Build the list of items and fill the DOM
                this.fetchData(currentDocument, list, text, caret);

                // At last, render the DOM and display the list items
                popup.style.display = 'block';
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
            Autocomplete.moveSelection(curItem, event.target as HTMLElement);
        };
        list.onclick = event => {

            event.stopImmediatePropagation();
            event.preventDefault();

            // If a list item has been selected, insert this item at the caret position in the input
            const selectedItem = Autocomplete.selectedItem(shadowRoot);
            if (selectedItem) {

                const itemId = selectedItem.getAttribute('value');
                const itemText = selectedItem.innerText;

                field.value = Autocomplete.insertSelectedItem(text, caret, itemText, selections);
                selections.push(itemText);
            }

            // At last, close the list and cleanup the DOM
            list.innerHTML = '';
            popup.style.display = 'none';

            // Ensure the focus stays in the input
            field.focus();
        };
    }

    protected newListItem(currentDocument: Document, id: number, name: string): HTMLElement {
        const listItem = currentDocument.createElement('li');
        listItem.setAttribute('class', 'cf_input-terms_list-item');
        listItem.setAttribute('value', id.toString());
        listItem.innerHTML = name;
        return listItem;
    }

    protected fetchData(currentDocument: Document, list: HTMLElement, text: string, caret: number): void {

        console.log('text : ' + text);
        console.log('caret : ' + caret);

        // TODO : call function and fill list
        for (let i = 0; i < 5; i++) {
            const item = this.newListItem(currentDocument, i, 'Item ' + i);
            list.appendChild(item);
        }
    }
}

export {Autocomplete}