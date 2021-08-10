import {cf} from './cf';

export interface CfCustomWindow extends Window {
    cf: typeof cf;
}