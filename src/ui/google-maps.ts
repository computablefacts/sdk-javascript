import {CfInterface} from '../cf.interface';

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
 *     address="<your_address_1>,<your_address_2>"></google-map>
 * </body>
 * <script src="https://unpkg.com/@computablefacts/sdk-javascript/dist/bundle/index.js"></script>
 * <script>
 *   cf.webComponents.registerGoogleMaps()
 * </script>
 * </html>
 * ```
 */
class GoogleMaps extends HTMLElement {

    constructor() {
        super();
    }

    public connectedCallback(): void {

        const width = this.hasAttribute('width') ? this.getAttribute('width') : '100%';
        const height = this.hasAttribute('height') ? this.getAttribute('height') : '160px';

        const shadowRoot: ShadowRoot = this.attachShadow({mode: 'open'});
        const template: HTMLDivElement = document.createElement('div')!;
        template.setAttribute('class', 'wrapper');
        template.setAttribute('style', `width:${width}; height:${height};`)

        const node = template.cloneNode(true)!;
        shadowRoot.appendChild(node);

        this.renderMap(shadowRoot);
    }

    protected async renderMap(shadowRoot: ShadowRoot): Promise<void> {

        if (!this.hasAttribute('api-key')) {
            throw new Error('L`attribut `api-key` est obligatoire pour faire fonctionner ce composant.');
        }
        if (!this.hasAttribute('address')) {
            throw new Error('L`attribut `address` est obligatoire pour faire fonctionner ce composant.');
        }

        // Load component attributes
        const apiKey = this.getAttribute('api-key')!;
        const address = this.getAttribute('address')!;
        const mapType = this.hasAttribute('type') ? this.getAttribute('type') : 'plan';
        const zoomControl = this.hasAttribute('zoom-control') ? this.getAttribute('zoom-control') === 'true' : true;
        const gestureHandling = this.hasAttribute('gesture-handling') ? this.getAttribute('gesture-handling') === 'true' : true;
        const card = shadowRoot.querySelector('.wrapper');

        // Get the URL to the Google Maps library
        const cf = (window as any).cf as CfInterface;
        const url = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=&v=weekly`;

        // Geocode an address (i.e. get the latitude and longitude) and it on the map
        const drawMap = function () {
            if (!cf.google.maps.isLoaded) {
                setTimeout(drawMap, 150);
            } else {

                const maps: any[] = [];
                address.split(',').forEach(a => {

                    // @ts-ignore
                    // error TS2304: Cannot find name 'google'
                    new google.maps.Geocoder().geocode({
                        'address': a
                    }, function (results: any[], status: string) {
                        // @ts-ignore
                        // error TS2304: Cannot find name 'google'
                        if (status == google.maps.GeocoderStatus.OK) {
                            if (maps.length === 0) {
                                // @ts-ignore
                                // error TS2304: Cannot find name 'google'
                                const map = new google.maps.Map(card, {
                                    // @ts-ignore
                                    // error TS2304: Cannot find name 'google'
                                    mapTypeId: mapType === 'satellite' ? google.maps.MapTypeId.SATELLITE : google.maps.MapTypeId.PLAN,
                                    center: results[0].geometry.location,
                                    zoom: 17,
                                    gestureHandling: gestureHandling ? 'auto' : 'none',
                                    zoomControl: zoomControl,
                                });
                                maps.push(map);
                            }
                            // @ts-ignore
                            // error TS2304: Cannot find name 'google'
                            new google.maps.Marker({
                                position: results[0].geometry.location,
                                map: maps[0],
                                title: `${a}`,
                            });
                        }
                    });
                });
            }
        };

        if (typeof cf.google.maps.scriptUrl === 'string') {
            drawMap();
        } else {

            cf.google.maps.scriptUrl = url;
            cf.google.maps.isLoaded = false;

            const script = document.createElement('script');
            script.setAttribute('src', url);
            script.onload = function () {
                cf.google.maps.isLoaded = true;
                drawMap();
            };
            document.body.appendChild(script);
        }
    }
}

export {GoogleMaps}