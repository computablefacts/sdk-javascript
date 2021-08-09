import {describe, it} from 'mocha';
import {expect} from 'chai';

import {cf} from '../src/cf';

describe('cf', () => {

    //console.log('cf=', cf)

    it('should export httpClient object', () => {
        expect(cf).to.have.keys([
            'httpClient',
        ])
    });

});