import {describe, it} from 'mocha';
import {expect} from 'chai';

import * as index from '../src/index';

describe('index', () => {

    //console.log('index=', index)

    it('should export cf object', () => {

        // index has a 'default' key too...
        expect(index).to.include.keys([
            'cf',
        ])
    });

});