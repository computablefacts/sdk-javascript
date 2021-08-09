import {afterEach, beforeEach, describe, it} from 'mocha';
import {expect} from 'chai';

import {api} from '../src/api';

type MockWindow = {
  location: {
    search: string
  },
  document: {
    referrer: string
  }
}

describe('api', () => {

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
    api.init()
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


  it('should export api public methods', () => {
    expect(api).to.have.keys([
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
      expect(api.getToken()).to.be.equal('')
    });

  });

  describe('setToken', () => {

    it('should store the token', () => {
      api.setToken('my_dummy_token')
      expect(api.getToken()).to.be.equal('my_dummy_token')
    });

    it('should set autodetect to false', () => {
      setQueryString('dummy=xxx&token=my_query_string_token')
      setReferrer('https://my_cf_ui.web.site/onDemand')

      api.init()
      expect(api.hasAutodetect()).to.be.true

      api.setToken('my_dummy_token')
      expect(api.hasAutodetect()).to.be.false
    });

  });

  describe('hasToken', () => {

    it('should be false if token is empty', () => {
      api.setToken('')
      expect(api.hasToken()).to.be.false
    });

  });

  describe('getBaseUrl', () => {

    it('should be empty string by default', () => {
      expect(api.getBaseUrl()).to.be.equal('')
    });

  });

  describe('setBaseUrl', () => {

    it('should store the base URL', () => {
      api.setBaseUrl('http://my_dummy_url/')
      expect(api.getBaseUrl()).to.be.equal('http://my_dummy_url/')
    });

    it('should set autodetect to false', () => {
      setQueryString('dummy=xxx&token=my_query_string_token')
      setReferrer('https://my_cf_ui.web.site/onDemand')

      api.init()
      expect(api.hasAutodetect()).to.be.true

      api.setBaseUrl('http://my_dummy_url/')
      expect(api.hasAutodetect()).to.be.false
    });

  });

  describe('hasBaseUrl', () => {

    it('should be false if base URL is empty', () => {
      api.setBaseUrl('')
      expect(api.hasBaseUrl()).to.be.false
    });

  });

  describe('init', () => {

    it('should store the token', () => {
      api.init('my_dummy_token')
      expect(api.getToken()).to.be.equal('my_dummy_token')
    });

    it('should store the base URL', () => {
      api.init(undefined, 'http://my_dummy_url2/')
      expect(api.getBaseUrl()).to.be.equal('http://my_dummy_url2/')
    });

    it('should find the token on query string (token=)', () => {
      setQueryString('dummy=xxx&token=my_query_string_token')

      api.init()
      expect(api.getToken()).to.be.equal('my_query_string_token')
    });

    it('should find the base URL on referrer', () => {
      setReferrer('https://my_cf_ui.web.site/onDemand')

      api.init()
      expect(api.getBaseUrl()).to.be.equal('https://my_cf_ui.web.site')
    });

  });

  describe('hasAutodetect', () => {

    it('should be false if no token nor base URL is found', () => {
      api.init()
      expect(api.hasAutodetect()).to.be.false
    });

    it('should be false if only token is found', () => {
      setQueryString('dummy=xxx&token=my_query_string_token')

      api.init()
      expect(api.hasAutodetect()).to.be.false
    });

    it('should be false if only base URL is found', () => {
      setReferrer('https://my_cf_ui.web.site/onDemand')

      api.init()
      expect(api.hasAutodetect()).to.be.false
    });

    it('should be true if token AND base URL are found', () => {
      setQueryString('dummy=xxx&token=my_query_string_token')
      setReferrer('https://my_cf_ui.web.site/onDemand')

      api.init()
      expect(api.hasAutodetect()).to.be.true
    });

  });

  describe('materializeSql', () => {

    it('should be tested', () => {
      // TODO
    });

  });

  describe('whoami', () => {

    it('should be tested', () => {
      // TODO
    });

  });

});