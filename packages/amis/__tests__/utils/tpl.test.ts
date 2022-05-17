import {
    filter
} from '../../src/utils/tpl';

import '../../src/utils/tpl-builtin';
import '../../src/utils/tpl-lodash';
test('filter', () => {
    expect(filter('xxx_a=${a}&b=${b}', {
        a: 1,
        b: 2
    })).toEqual('xxx_a=1&b=2');

    expect(filter('xxx_a=<%= data.a%>&b=<%= data.b%>', {
        a: 1,
        b: 2
    })).toEqual('xxx_a=1&b=2');
})