interface WebComponentsInterface {

    /**
     * Register the `<google-maps>` Web Component.
     *
     * @return `true` if the registration succeeded, `false` otherwise.
     * @see [[`GoogleMaps`]]
     */
    registerGoogleMaps(): boolean,

    /**
     * Register the `<autocomplete>` Web Component.
     *
     * @return `true` if the registration succeeded, `false` otherwise.
     * @see [[`Autocomplete`]]
     */
    registerAutocomplete(): boolean,
}

export {WebComponentsInterface}
