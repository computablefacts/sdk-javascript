import {describe, it} from 'mocha';
import {expect} from 'chai';

import * as cf from './index';

describe('index', () => {

  //console.log('cf', cf)

  it('should export api object', () => {
    expect(cf).to.have.keys([
      'api',
    ])
  });

});