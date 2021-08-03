import {afterEach, beforeEach, describe, it} from 'mocha';
import fetch from 'node-fetch';

import {client} from "./api-client";

function jsonOk(body) {
  let mockResponse = new fetch.Response(JSON.stringify(body), {
    status: 200,
    headers: {
      'Content-type': 'application/json'
    }
  });

  return Promise.resolve(mockResponse);
}

function mockFetch(body) {
  global.window.fetch = () => {
    return jsonOk(body)
  }
}


describe('api-client', () => {

  let windowRef;

  beforeEach(() => {
    const windowRef = global.window;
    global.window = {
      fetch: fetch
    };
  });

  afterEach(() => {
    global.window = windowRef;
  });


  it('patrick', () => {

    mockFetch({patrick: 3})

    client('endpoint').then(
      data => {
        console.log('here are the books', data)
      },
      error => {
        console.error('oh no, an error happened', error)
      },
    )
  });

});