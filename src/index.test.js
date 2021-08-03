import {expect} from 'chai';
import * as index from './index';

describe('index', () => {
  it('should have dummy equals to 45', () => {
    console.log(index)
    expect(index.default).to.equal(45);
  });
});