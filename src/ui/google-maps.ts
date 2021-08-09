/**
 * Wrapper around Google Maps.
 *
 * Example:
 * ```html
 * <!DOCTYPE html>
 * <html lang="en">
 * <head>
 *   <meta charset="UTF-8">
 * </head>
 * <body>
 *   <google-maps
 *     api-key="<your_api_key>"
 *     width="100%"
 *     height="160px"
 *     type="plan"
 *     address="<your_address>"></google-map>
 * </body>
 * <script src="https://unpkg.com/@computablefacts/sdk-javascript/dist/bundle/index.js"></script>
 * <script>
 *   cf.ui.webComponents.registerGoogleMaps()
 * </script>
 * </html>
 * ```
 */
class GoogleMaps extends HTMLElement {

    constructor() {
        super();
        // @ts-ignore
        // error TS2339: Property 'currentDocument' does not exist on type 'GoogleMap'
        this.currentDocument = document.currentScript.ownerDocument;
        this.attachShadow({mode: 'open'});
    }

    connectedCallback() {
        const className = 'cf_google-map_' + Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
        const width = this.hasAttribute('width') ? this.getAttribute('width') : '100%';
        const height = this.hasAttribute('height') ? this.getAttribute('height') : '160px';
        // @ts-ignore
        // error TS2339: Property 'currentDocument' does not exist on type 'GoogleMap'
        const template = this.currentDocument.createElement('div');
        template.setAttribute('class', className);
        template.style.height = height;
        template.style.width = width;
        // @ts-ignore
        // error TS2531: Object is possibly 'null'
        this.shadowRoot.appendChild(template.cloneNode(true));
        this.loadMap(className);
    }

    async loadMap(className: string): Promise<void> {

        if (!this.hasAttribute('api-key')) {
            throw new Error('L`attribut `api-key` est obligatoire pour faire fonctionner ce composant.');
        }
        if (!this.hasAttribute('address')) {
            throw new Error('L`attribut `address` est obligatoire pour faire fonctionner ce composant.');
        }

        // Load component attributes
        const apiKey = this.getAttribute('api-key');
        const address = this.getAttribute('address');
        const mapType = this.hasAttribute('type') ? this.getAttribute('type') : 'plan';
        // @ts-ignore
        // error TS2531: Object is possibly 'null'
        const card = this.shadowRoot.querySelector(`.${className}`);

        // Geocode an address (i.e. get the latitude and longitude) and it on the map
        const drawMap = function () {
            // @ts-ignore
            // error TS2339: Property 'cf' does not exist on type 'Window & typeof globalThis'
            if (window.cf.google.maps.isLoaded != true) {
                setTimeout(drawMap, 150);
            } else {
                // @ts-ignore
                // error TS2304: Cannot find name 'google'
                new google.maps.Geocoder().geocode({
                    'address': address
                }, function (results: any[], status: string) {
                    // @ts-ignore
                    // error TS2304: Cannot find name 'google'
                    if (status == google.maps.GeocoderStatus.OK) {
                        // @ts-ignore
                        // error TS2304: Cannot find name 'google'
                        const map = new google.maps.Map(card, {
                            // @ts-ignore
                            // error TS2304: Cannot find name 'google'
                            mapTypeId: mapType === 'satellite' ? google.maps.MapTypeId.SATELLITE : google.maps.MapTypeId.PLAN,
                            center: results[0].geometry.location,
                            zoom: 17,
                        });
                        // @ts-ignore
                        // error TS2304: Cannot find name 'google'
                        new google.maps.Marker({
                            position: results[0].geometry.location,
                            map: map,
                            title: `${address}`,
                        });
                    }
                });
            }
        };

        // Get the URL to the Google Maps library
        const url = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=&v=weekly`;
        // @ts-ignore
        // error TS2339: Property 'cf' does not exist on type 'Window & typeof globalThis'
        window.cf = window.cf || {};
        // @ts-ignore
        // error TS2339: Property 'cf' does not exist on type 'Window & typeof globalThis'
        window.cf.google = window.cf.google || {};
        // @ts-ignore
        // error TS2339: Property 'cf' does not exist on type 'Window & typeof globalThis'
        window.cf.google.maps = window.cf.google.maps || {};

        // Load the Google Maps library (if needed) and display the map
        // @ts-ignore
        // error TS2339: Property 'cf' does not exist on type 'Window & typeof globalThis'
        if (typeof window.cf.google.maps.scriptUrl === 'string') {
            drawMap();
        } else {

            // @ts-ignore
            // error TS2339: Property 'cf' does not exist on type 'Window & typeof globalThis'
            window.cf.google.maps.scriptUrl = url;
            // @ts-ignore
            // error TS2339: Property 'cf' does not exist on type 'Window & typeof globalThis'
            window.cf.google.maps.isLoaded = false;

            const script = document.createElement('script');
            script.setAttribute('src', url);
            script.onload = function () {
                // @ts-ignore
                // error TS2339: Property 'cf' does not exist on type 'Window & typeof globalThis'
                window.cf.google.maps.isLoaded = true;
                drawMap();
            };
            document.body.appendChild(script);
        }
    }
}

export {GoogleMaps}