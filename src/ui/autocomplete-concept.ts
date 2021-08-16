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
 *       popup-max-items="15"
 *       placeholder="Enter an address..."
 *       concept="address"
 *       filter-properties="NUMERO_DE_RUE,RUE,COMPLEMENT_DE_RUE,CODE_POSTAL,VILLE"
 *       title-properties="NUMERO_DE_RUE,RUE,COMPLEMENT_DE_RUE,CODE_POSTAL,VILLE"
 *       subtitle-properties="NUMERO_DE_RUE,RUE,COMPLEMENT_DE_RUE,CODE_POSTAL,VILLE"></autocomplete-concept>
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
    protected UNKNOWN_MAX_ITEMS = '15';

    constructor() {
        super();
    }

    public newListOfItems(uuid: number, text: string, caret: number): Promise<ListOfItems> {

        const sampleSize = parseInt(this.getAttributeOrDefault('popup-max-items', this.UNKNOWN_MAX_ITEMS).trim(), 10);
        const concept = this.getAttributeOrDefault('concept', this.UNKNOWN_CONCEPT).trim();
        const filterProperties = this.getAttributeOrDefault('filter-properties', this.UNKNOWN_PROPERTIES).trim();
        const titleProperties = this.getAttributeOrDefault('title-properties', this.UNKNOWN_PROPERTIES).trim();
        const subtitleProperties = this.getAttributeOrDefault('subtitle-properties', this.UNKNOWN_PROPERTIES).trim();
        const term = Autocomplete.extractTermBeforeCaret(text, caret);

        if (concept === this.UNKNOWN_CONCEPT || filterProperties === this.UNKNOWN_PROPERTIES || term.length < 3) {
            return new Promise(function (resolve) {
                return resolve({uuid: uuid, elements: []});
            });
        }

        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const self = this;
        const cf = (window as any).cf as CfInterface;

        return cf.httpClient.autocompleteConcept({
            uuid: uuid.toString(),
            concept: concept ? concept : '',
            properties: filterProperties ? filterProperties.split(',').filter(p => p && p.trim() !== '') : [],
            terms: [term + '*'],
            sample_size: sampleSize,
        }).then(response => {

            const uuid = parseInt(response.id, 10);
            const results = response.results;
            const elements: HTMLElement[] = [];

            if (response && self.uuid === uuid) {

                const titleProps = titleProperties && titleProperties !== this.UNKNOWN_PROPERTIES ?
                    titleProperties.split(',').filter(p => p && p.trim() !== '') :
                    [];
                const subtitleProps = subtitleProperties && subtitleProperties !== this.UNKNOWN_PROPERTIES ?
                    subtitleProperties.split(',').filter(p => p && p.trim() !== '') :
                    [];
                const termUpperCase = term.toUpperCase();

                for (let i = 0; i < results.length; i++) {

                    const item = results[i];
                    const title: string[] = [];
                    const subtitle: string[] = [];

                    // Build title
                    for (let k = 0; k < titleProps.length; k++) {

                        const key = titleProps[k];

                        if (key in item) {

                            const value = item[key] ? item[key].trim() : '';

                            if (value && value !== '' && value.indexOf('MASKED_') < 0) {
                                title.push(value.toUpperCase());
                            }
                        }
                    }

                    // Build subtitle
                    for (let k = 0; k < subtitleProps.length; k++) {

                        const key = subtitleProps[k];

                        if (key in item) {

                            const value = item[key] ? item[key].trim() : '';

                            if (value && value !== '' && value.indexOf('MASKED_') < 0) {

                                const keyLowerCase = key.toLowerCase();
                                const valueLowerCase = value.toLowerCase();

                                subtitle.push(`${keyLowerCase}: ${valueLowerCase}`);
                            }
                        }
                    }

                    // Fill HTML template
                    const titleHtml = title.map(str => {

                        const index = str.indexOf(termUpperCase);

                        if (index < 0) {
                            return str;
                        }

                        const prefix = str.substr(0, index);
                        const suffix = str.substr(index + termUpperCase.length);

                        return `${prefix}<span style="background-color: #ededed">${termUpperCase}</span>${suffix}`;
                    }).join(' ');

                    const subtitleHtml = subtitle.join(' <span style="font-weight: bold">/</span> ');

                    if (titleHtml && titleHtml.trim().length > 0) {
                        const listItem = `
                            <div style="color: black">
                                ${titleHtml}
                            </div>
                            <div style="color: #707070">
                                ${subtitleHtml}
                            </div>
                        `;
                        const fact = {
                            concept: concept,
                            properties: item,
                        };
                        const newListItem = self.newListItem(title.join(' '), listItem, JSON.stringify(fact));
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