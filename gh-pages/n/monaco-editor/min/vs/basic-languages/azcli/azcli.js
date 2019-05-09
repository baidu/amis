(function(define, require) {
/*!-----------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * monaco-languages version: 1.6.0(858705e74270e53559a241fdee187e7a6ae53b23)
 * Released under the MIT license
 * https://github.com/Microsoft/monaco-languages/blob/master/LICENSE.md
 *-----------------------------------------------------------------------------*/
define("vs/basic-languages/azcli/azcli",["require","exports"],function(e,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.conf={comments:{lineComment:"#"}},t.language={defaultToken:"keyword",ignoreCase:!0,tokenPostfix:".azcli",str:/[^#\s]/,tokenizer:{root:[{include:"@comment"},[/\s-+@str*\s*/,{cases:{"@eos":{token:"key.identifier",next:"@popall"},"@default":{token:"key.identifier",next:"@type"}}}],[/^-+@str*\s*/,{cases:{"@eos":{token:"key.identifier",next:"@popall"},"@default":{token:"key.identifier",next:"@type"}}}]],type:[{include:"@comment"},[/-+@str*\s*/,{cases:{"@eos":{token:"key.identifier",next:"@popall"},"@default":"key.identifier"}}],[/@str+\s*/,{cases:{"@eos":{token:"string",next:"@popall"},"@default":"string"}}]],comment:[[/#.*$/,{cases:{"@eos":{token:"comment",next:"@popall"}}}]]}}});
})(this.monacaAmd && this.monacaAmd.define || this.define, this.monacaAmd && this.monacaAmd.require);