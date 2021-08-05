import {afterEach, beforeEach, describe, it} from 'mocha';
import fetch, {Response} from 'node-fetch';

import {client} from "../src/api-client";

function jsonOk(body: object) {
  let mockResponse = new Response(JSON.stringify(body), {
    status: 200,
    headers: {
      'Content-type': 'application/json'
    }
  });

  return Promise.resolve(mockResponse);
}

function mockFetch(body: object) {
  // error TS2322: Type 'x' is not assignable to type 'y'
  // @ts-ignore
  global.window.fetch = () => {
    return jsonOk(body)
  }
}


describe('api-client', () => {

  let windowRef: Window & typeof globalThis;

  beforeEach(() => {
    windowRef = global.window;

    // error TS2322: Type 'x' is not assignable to type 'y'
    // @ts-ignore
    global.window = {
      // @ts-ignore
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