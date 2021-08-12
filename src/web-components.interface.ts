interface WebComponentsInterface {

    /**
     * Register the `<google-maps>` Web Component.
     *
     * @return `true` if the registration succeeded, `false` otherwise.
     * @see [[`GoogleMaps`]]
     */
    registerGoogleMaps(): boolean,

    /**
     * Register the `<autocomplete-concept>` Web Component.
     *
     * @return `true` if the registration succeeded, `false` otherwise.
     * @see [[`AutocompleteConcept`]]
     */
    registerAutocompleteConcept(): boolean,
}

export {WebComponentsInterface}
