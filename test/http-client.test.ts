import {afterEach, beforeEach, describe, it} from 'mocha';
import {expect} from 'chai';

import {httpClient} from '../src/http-client';

type MockWindow = {
    location: {
        search: string
    },
    document: {
        referrer: string
    }
}

describe('httpClient', () => {

    let windowRef: Window & typeof globalThis
    const windowMock: MockWindow = {
        location: {
            search: ''
        },
        document: {
            referrer: ''
        }
    }

    beforeEach(() => {

        windowRef = global.window
        global['window'] = windowMock as Window & typeof globalThis

        // reset window mock
        setReferrer('')
        setQueryString('')

        // reset internal values
        httpClient.init()
    });

    afterEach(() => {
        global['window'] = windowRef;
    });

    const setQueryString = (newValue: string) => {
        windowMock.location.search = newValue
    }

    const setReferrer = (newValue: string) => {
        windowMock.document.referrer = newValue
    }

    it('should export httpClient public methods', () => {
        expect(httpClient).to.have.keys([
            'getToken',
            'setToken',
            'hasToken',
            'getBaseUrl',
            'setBaseUrl',
            'hasBaseUrl',
            'init',
            'hasAutodetect',
            'materializeSql',
            'whoAmI',
        ])
    });

    describe('getToken', () => {

        it('should be empty string by default', () => {
            expect(httpClient.getToken()).to.be.equal('')
        });

    });

    describe('setToken', () => {

        it('should store the token', () => {
            httpClient.setToken('my_dummy_token')
            expect(httpClient.getToken()).to.be.equal('my_dummy_token')
        });

        it('should set autodetect to false', () => {

            setQueryString('dummy=xxx&token=my_query_string_token')
            setReferrer('https://my_cf_ui.web.site/onDemand')

            httpClient.init()
            expect(httpClient.hasAutodetect()).to.be.true

            httpClient.setToken('my_dummy_token')
            expect(httpClient.hasAutodetect()).to.be.false
        });

    });

    describe('hasToken', () => {

        it('should be false if token is empty', () => {
            httpClient.setToken('')
            expect(httpClient.hasToken()).to.be.false
        });

    });

    describe('getBaseUrl', () => {

        it('should be empty string by default', () => {
            expect(httpClient.getBaseUrl()).to.be.equal('')
        });

    });

    describe('setBaseUrl', () => {

        it('should store the base URL', () => {
            httpClient.setBaseUrl('http://my_dummy_url/')
            expect(httpClient.getBaseUrl()).to.be.equal('http://my_dummy_url/')
        });

        it('should set autodetect to false', () => {

            setQueryString('dummy=xxx&token=my_query_string_token')
            setReferrer('https://my_cf_ui.web.site/onDemand')

            httpClient.init()
            expect(httpClient.hasAutodetect()).to.be.true

            httpClient.setBaseUrl('http://my_dummy_url/')
            expect(httpClient.hasAutodetect()).to.be.false
        });

    });

    describe('hasBaseUrl', () => {

        it('should be false if base URL is empty', () => {
            httpClient.setBaseUrl('')
            expect(httpClient.hasBaseUrl()).to.be.false
        });

    });

    describe('init', () => {

        it('should store the token', () => {
            httpClient.init('my_dummy_token')
            expect(httpClient.getToken()).to.be.equal('my_dummy_token')
        });

        it('should store the base URL', () => {
            httpClient.init(undefined, 'http://my_dummy_url2/')
            expect(httpClient.getBaseUrl()).to.be.equal('http://my_dummy_url2/')
        });

        it('should find the token on query string (token=)', () => {

            setQueryString('dummy=xxx&token=my_query_string_token')

            httpClient.init()
            expect(httpClient.getToken()).to.be.equal('my_query_string_token')
        });

        it('should find the base URL on referrer', () => {

            setReferrer('https://my_cf_ui.web.site/onDemand')

            httpClient.init()
            expect(httpClient.getBaseUrl()).to.be.equal('https://my_cf_ui.web.site')
        });

    });

    describe('hasAutodetect', () => {

        it('should be false if no token nor base URL is found', () => {
            httpClient.init()
            expect(httpClient.hasAutodetect()).to.be.false
        });

        it('should be false if only token is found', () => {

            setQueryString('dummy=xxx&token=my_query_string_token')

            httpClient.init()
            expect(httpClient.hasAutodetect()).to.be.false
        });

        it('should be false if only base URL is found', () => {

            setReferrer('https://my_cf_ui.web.site/onDemand')

            httpClient.init()
            expect(httpClient.hasAutodetect()).to.be.false
        });

        it('should be true if token AND base URL are found', () => {

            setQueryString('dummy=xxx&token=my_query_string_token')
            setReferrer('https://my_cf_ui.web.site/onDemand')

            httpClient.init()
            expect(httpClient.hasAutodetect()).to.be.true
        });

    });

    describe('queryMaterializedConcepts', () => {

        it('should be tested', () => {
            // TODO
        });

    });

    describe('whoAmI', () => {

        it('should be tested', () => {
            // TODO
        });

    });

});