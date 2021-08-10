import {WebComponentsInterface} from './web-components.interface';
import {GoogleMaps} from './ui/google-maps';
import {Autocomplete} from './ui/autocomplete';

const webComponents: WebComponentsInterface = (function () {

    const registerGoogleMaps = (): boolean => {
        window.customElements.define('google-maps', GoogleMaps);
        return true;
    }

    const registerAutocomplete = (): boolean => {
        window.customElements.define('input-terms', Autocomplete);
        return true;
    }

    return {
        registerGoogleMaps: registerGoogleMaps,
        registerAutocomplete: registerAutocomplete,
    }
})();

export {webComponents, GoogleMaps, Autocomplete}
