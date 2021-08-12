import {Autocomplete} from './autocomplete';
import {CfInterface} from '../cf.interface';

/**
 * Wrapper around an autocomplete over concepts.
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
 *     <autocomplete-concept
 *       placeholder="Enter an address..."
 *       concept="address"
 *       properties="rue,complement_de_rue"></autocomplete-concept>
 *   </div>
 *   <div>
 *     The popup will be displayed above this text.
 *   </div>
 * </body>
 * <script src="https://unpkg.com/@computablefacts/sdk-javascript/dist/bundle/index.js"></script>
 * <script>
 *   cf.webComponents.registerAutocompleteConcept()
 * </script>
 * </html>
 * ```
 */
class AutocompleteConcept extends Autocomplete {

    protected UNKNOWN_CONCEPT = 'unk';
    protected UNKNOWN_PROPERTIES = 'unk';
    protected uuid = 0;

    constructor() {
        super();
    }

    public newListOfItems(currentDocument: Document, text: string, caret: number): Promise<HTMLElement[]> {

        const concept = this.hasAttribute('concept') ? this.getAttribute('concept') : this.UNKNOWN_CONCEPT;
        const properties = this.hasAttribute('properties') ? this.getAttribute('properties') : this.UNKNOWN_PROPERTIES;
        const term = Autocomplete.extractTermBeforeCaret(text, caret);

        if (term.length < 3) {
            return new Promise(() => []);
        }

        const self = this;
        const cf = (window as any).cf as CfInterface;

        return cf.httpClient.autocompleteConcept({
            uuid: (++this.uuid).toString(),
            concept: concept ? concept : '',
            properties: properties ? properties.split(',').filter(p => p && p.trim() !== '') : [],
            terms: [term],
        }).then(response => {

            const elements: HTMLElement[] = [];

            if (response && self.uuid === parseInt(response.id, 10)) {

                console.log(response);

                for (let i = 0; i < response.results.length; i++) {
                    const newListItem = self.newListItem(currentDocument, i.toString(), response.results[i]);
                    elements.push(newListItem);
                }
            }
            return elements;
        }).catch(error => {

            console.log(error);

            return [];
        });
    }
}

export {AutocompleteConcept}