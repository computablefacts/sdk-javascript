import {describe, it} from 'mocha';
import {expect} from 'chai';

import {cf} from '../src/cf';

describe('cf', () => {

  //console.log('cf=', cf)

  it('should export api object', () => {
    expect(cf).to.have.keys([
      'api',
    ])
  });

});