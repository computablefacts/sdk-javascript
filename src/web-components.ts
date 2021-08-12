import {WebComponentsInterface} from './web-components.interface';
import {GoogleMaps} from './ui/google-maps';
import {AutocompleteConcept} from './ui/autocomplete-concept';

const webComponents: WebComponentsInterface = (function () {

    const registerGoogleMaps = (): boolean => {
        window.customElements.define('google-maps', GoogleMaps);
        return true;
    }

    const registerAutocompleteConcept = (): boolean => {
        window.customElements.define('autocomplete-concept', AutocompleteConcept);
        return true;
    }

    return {
        registerGoogleMaps: registerGoogleMaps,
        registerAutocompleteConcept: registerAutocompleteConcept,
    }
})();

export {webComponents, GoogleMaps, AutocompleteConcept}
