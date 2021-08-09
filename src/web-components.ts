import {GoogleMaps} from './ui/google-maps';

const webComponents = (function () {

    /**
     * Register the `<google-maps>` Web Component.
     *
     * @return `true` if the registration succeeded, `false` otherwise.
     * @see [[`GoogleMaps`]]
     */
    const registerGoogleMaps = (): boolean => {
        window.customElements.define('google-maps', GoogleMaps);
        return true;
    }

    return {
        registerGoogleMaps: registerGoogleMaps,
    }
})();

export {webComponents, GoogleMaps}
