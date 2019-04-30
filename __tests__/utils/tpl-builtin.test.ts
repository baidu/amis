import {
    prettyBytes,
    escapeHtml,
    formatDuration
} from '../../src/utils/tpl-builtin';

test('tpl-builtin:prettyBytes', () => {
    expect(prettyBytes(1024)).toEqual('1.02 kB');
    expect(prettyBytes(1024000)).toEqual('1.02 MB');
});


test('tpl-builtin:escapeHtml', () => {
    expect(escapeHtml('<div id="1">Hello&world</div>')).toEqual('&lt;div id=&quot;1&quot;&gt;Hello&amp;world&lt;&#x2F;div&gt;');
});

test('tpl-builtin:formatDuration', () => {
    expect(formatDuration(1)).toEqual('1秒');
    expect(formatDuration(61)).toEqual('1分1秒');
    expect(formatDuration(233233)).toEqual('3天17时47分13秒');

})