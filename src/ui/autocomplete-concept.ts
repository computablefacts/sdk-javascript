import {Autocomplete, ListOfItems} from './autocomplete';
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
 *       popup-width="600px"
 *       popup-height="auto"
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

    constructor() {
        super();
    }

    public newListOfItems(uuid: number, currentDocument: Document, text: string, caret: number): Promise<ListOfItems> {

        const concept = this.hasAttribute('concept') ? this.getAttribute('concept') : this.UNKNOWN_CONCEPT;
        const properties = this.hasAttribute('properties') ? this.getAttribute('properties') : this.UNKNOWN_PROPERTIES;
        const term = Autocomplete.extractTermBeforeCaret(text, caret);

        if (concept === this.UNKNOWN_CONCEPT || properties === this.UNKNOWN_PROPERTIES || term.length < 3) {
            return new Promise(function (resolve) {
                return resolve({uuid: uuid, elements: []});
            });
        }

        const self = this;
        const cf = (window as any).cf as CfInterface;

        return cf.httpClient.autocompleteConcept({
            uuid: uuid.toString(),
            concept: concept ? concept : '',
            properties: properties ? properties.split(',').filter(p => p && p.trim() !== '') : [],
            terms: [term],
        }).then(response => {

            const elements: HTMLElement[] = [];

            if (response && self.uuid === parseInt(response.id, 10)) {

                const props = properties ? properties.split(',').filter(p => p && p.trim() !== '') : [];
                const termUpperCase = term.toUpperCase();

                for (let i = 0; i < response.results.length; i++) {

                    const item = response.results[i];
                    const footnotes: string[] = [];
                    let header = '';
                    let text = '';

                    for (let k = 0; k < props.length; k++) {

                        const key = props[k];

                        if (key in item) {

                            const value = item[key].trim();

                            if (value && value !== '') {

                                const valueUpperCase = value.toUpperCase();
                                const index = valueUpperCase.indexOf(termUpperCase);

                                if (index >= 0) {
                                    const prefix = valueUpperCase.substr(0, index);
                                    const suffix = valueUpperCase.substr(index + termUpperCase.length);
                                    header = `${prefix}<span style="background-color: #ededed">${termUpperCase}</span>${suffix}`;
                                    text = value;
                                } else {
                                    const keyLowerCase = key.toLowerCase();
                                    const valueLowerCase = value.toLowerCase();
                                    footnotes.push(`${keyLowerCase}: ${valueLowerCase}`);
                                }
                            } else {
                                const keyLowerCase = key.toLowerCase();
                                footnotes.push(`${keyLowerCase}: n/a`);
                            }
                        }
                    }

                    if (!header.startsWith('MASKED_')) {
                        const footer = footnotes.filter(n => n.indexOf('MASKED_') < 0).join(' <span style="font-weight: bold">/</span> ');
                        const listItem = `
                            <div style="color: black">
                                ${header}
                            </div>
                            <div style="color: #707070">
                                ${footer}
                            </div>
                        `;
                        const newListItem = self.newListItem(currentDocument, text, listItem);
                        elements.push(newListItem);
                    }
                }
            }
            return {uuid: uuid, elements: elements};
        }).catch(error => {
            console.log(error);
            return {uuid: uuid, elements: []};
        });
    }
}

export {AutocompleteConcept}