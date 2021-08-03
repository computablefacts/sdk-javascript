import {afterEach, beforeEach, describe, it} from 'mocha';
import {expect, assert} from "chai";

import {api} from "./api";


describe('api', () => {

  let _windowRef;
  let _documentRef;

  beforeEach(() => {
    _windowRef = global.window;
    global.window = {};
    _documentRef = global.document;
    global.document = {};
  });

  afterEach(() => {
    global.window = _windowRef;
    global.document = _documentRef;
  });

  const changeGlobalWindow = (newValue) => {
    global.window = newValue;
  }

  const changeGlobalDocument = (newValue) => {
    global.document = newValue;
  }


  it('should export api public methods', () => {
    expect(api).to.have.keys([
      'getToken',
      'setToken',
      'getBaseUrl',
      'setBaseUrl',
      'init',
    ])
  });

  describe('getToken', () => {

    it('should be undefined by default', () => {
      expect(api.getToken()).to.be.undefined
    });

  });

  describe('setToken', () => {

    it('should store the token', () => {
      api.setToken('my_dummy_token')
      expect(api.getToken()).to.be.equal('my_dummy_token')
    });

  });

  describe('getBaseUrl', () => {

    it('should be undefined by default', () => {
      expect(api.getBaseUrl()).to.be.undefined
    });

  });

  describe('setBaseUrl', () => {

    it('should store the base URL', () => {
      api.setBaseUrl('http://my_dummy_url/')
      expect(api.getBaseUrl()).to.be.equal('http://my_dummy_url/')
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
      changeGlobalWindow({
        location: {
          search: 'dummy=xxx&token=my_query_string_token'
        }
      })

      api.init()
      expect(api.getToken()).to.be.equal('my_query_string_token')
    });

    it('should find the base URL on referrer', () => {
      changeGlobalDocument({
        referrer: 'http://my_cf_ui.web.site/onDemand'
      })

      api.init()
      expect(api.getBaseUrl()).to.be.equal('http://my_cf_ui.web.site')
    });

  });

});