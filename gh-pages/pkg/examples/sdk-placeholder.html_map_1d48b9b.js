require.resourceMap({
  "res": {
    "node_modules/monaco-editor/esm/vs/nls": {
      "type": "js",
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/base/common/arrays": {
      "type": "js",
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/base/common/types": {
      "type": "js",
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/base/common/objects": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/types"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/base/common/platform": {
      "type": "js",
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/common/model/wordHelper": {
      "type": "js",
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/common/config/editorOptions": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/nls",
        "node_modules/monaco-editor/esm/vs/base/common/arrays",
        "node_modules/monaco-editor/esm/vs/base/common/objects",
        "node_modules/monaco-editor/esm/vs/base/common/platform",
        "node_modules/monaco-editor/esm/vs/editor/common/model/wordHelper",
        "node_modules/monaco-editor/esm/vs/base/common/types"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/common/standalone/promise-polyfill/polyfill": {
      "type": "js",
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/base/common/errors": {
      "type": "js",
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/base/common/functional": {
      "type": "js",
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/base/common/lifecycle": {
      "type": "js",
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/base/common/iterator": {
      "type": "js",
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/base/common/linkedList": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/iterator"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/base/common/event": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/errors",
        "node_modules/monaco-editor/esm/vs/base/common/functional",
        "node_modules/monaco-editor/esm/vs/base/common/lifecycle",
        "node_modules/monaco-editor/esm/vs/base/common/linkedList"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/base/common/cancellation": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/event"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/base/common/keyCodes": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/errors"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/base/common/uri": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/platform"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/common/core/position": {
      "type": "js",
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/common/core/range": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/editor/common/core/position"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/common/core/selection": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/editor/common/core/position",
        "node_modules/monaco-editor/esm/vs/editor/common/core/range"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/common/core/token": {
      "type": "js",
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/common/standalone/standaloneEnums": {
      "type": "js",
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/common/standalone/standaloneBase": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/editor/common/standalone/promise-polyfill/polyfill",
        "node_modules/monaco-editor/esm/vs/base/common/cancellation",
        "node_modules/monaco-editor/esm/vs/base/common/event",
        "node_modules/monaco-editor/esm/vs/base/common/keyCodes",
        "node_modules/monaco-editor/esm/vs/base/common/uri",
        "node_modules/monaco-editor/esm/vs/editor/common/core/position",
        "node_modules/monaco-editor/esm/vs/editor/common/core/range",
        "node_modules/monaco-editor/esm/vs/editor/common/core/selection",
        "node_modules/monaco-editor/esm/vs/editor/common/core/token",
        "node_modules/monaco-editor/esm/vs/editor/common/standalone/standaloneEnums"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/platform/instantiation/common/instantiation": {
      "type": "js",
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/browser/services/codeEditorService": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/platform/instantiation/common/instantiation"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/base/browser/browser": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/event"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/base/browser/event": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/event"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/base/browser/keyboardEvent": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/browser/browser",
        "node_modules/monaco-editor/esm/vs/base/common/keyCodes",
        "node_modules/monaco-editor/esm/vs/base/common/platform"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/base/browser/iframe": {
      "type": "js",
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/base/browser/mouseEvent": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/browser/browser",
        "node_modules/monaco-editor/esm/vs/base/browser/iframe",
        "node_modules/monaco-editor/esm/vs/base/common/platform"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/base/common/async": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/cancellation",
        "node_modules/monaco-editor/esm/vs/base/common/errors",
        "node_modules/monaco-editor/esm/vs/base/common/lifecycle"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/base/browser/dom": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/browser/browser",
        "node_modules/monaco-editor/esm/vs/base/browser/event",
        "node_modules/monaco-editor/esm/vs/base/browser/keyboardEvent",
        "node_modules/monaco-editor/esm/vs/base/browser/mouseEvent",
        "node_modules/monaco-editor/esm/vs/base/common/async",
        "node_modules/monaco-editor/esm/vs/base/common/errors",
        "node_modules/monaco-editor/esm/vs/base/common/event",
        "node_modules/monaco-editor/esm/vs/base/common/lifecycle",
        "node_modules/monaco-editor/esm/vs/base/common/platform",
        "node_modules/monaco-editor/esm/vs/base/common/arrays"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/base/common/marshalling": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/uri"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/base/common/network": {
      "type": "js",
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/base/common/strings": {
      "type": "js",
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/base/common/process": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/platform"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/base/common/path": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/process"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/base/common/extpath": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/strings",
        "node_modules/monaco-editor/esm/vs/base/common/path"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/base/common/resources": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/extpath",
        "node_modules/monaco-editor/esm/vs/base/common/path",
        "node_modules/monaco-editor/esm/vs/base/common/uri",
        "node_modules/monaco-editor/esm/vs/base/common/strings",
        "node_modules/monaco-editor/esm/vs/base/common/network",
        "node_modules/monaco-editor/esm/vs/base/common/platform"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/platform/commands/common/commands": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/lifecycle",
        "node_modules/monaco-editor/esm/vs/base/common/types",
        "node_modules/monaco-editor/esm/vs/platform/instantiation/common/instantiation",
        "node_modules/monaco-editor/esm/vs/base/common/event",
        "node_modules/monaco-editor/esm/vs/base/common/linkedList"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/browser/services/openerService": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/browser/dom",
        "node_modules/monaco-editor/esm/vs/base/common/marshalling",
        "node_modules/monaco-editor/esm/vs/base/common/network",
        "node_modules/monaco-editor/esm/vs/base/common/resources",
        "node_modules/monaco-editor/esm/vs/editor/browser/services/codeEditorService",
        "node_modules/monaco-editor/esm/vs/platform/commands/common/commands",
        "node_modules/monaco-editor/esm/vs/base/common/strings",
        "node_modules/monaco-editor/esm/vs/base/common/linkedList"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/base/common/assert": {
      "type": "js",
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/browser/widget/diffNavigator": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/assert",
        "node_modules/monaco-editor/esm/vs/base/common/event",
        "node_modules/monaco-editor/esm/vs/base/common/lifecycle",
        "node_modules/monaco-editor/esm/vs/base/common/objects",
        "node_modules/monaco-editor/esm/vs/editor/common/core/range"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/common/config/editorZoom": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/event"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/common/config/fontInfo": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/platform",
        "node_modules/monaco-editor/esm/vs/editor/common/config/editorOptions",
        "node_modules/monaco-editor/esm/vs/editor/common/config/editorZoom"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/common/editorCommon": {
      "type": "js",
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/common/model": {
      "type": "js",
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/base/common/map": {
      "type": "js",
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/base/common/glob": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/arrays",
        "node_modules/monaco-editor/esm/vs/base/common/strings",
        "node_modules/monaco-editor/esm/vs/base/common/extpath",
        "node_modules/monaco-editor/esm/vs/base/common/path",
        "node_modules/monaco-editor/esm/vs/base/common/map",
        "node_modules/monaco-editor/esm/vs/base/common/async"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/common/modes/languageSelector": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/glob"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/common/services/modelService": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/platform/instantiation/common/instantiation"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/common/modes/languageFeatureRegistry": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/event",
        "node_modules/monaco-editor/esm/vs/base/common/lifecycle",
        "node_modules/monaco-editor/esm/vs/editor/common/modes/languageSelector",
        "node_modules/monaco-editor/esm/vs/editor/common/services/modelService"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/common/modes/tokenizationRegistry": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/event",
        "node_modules/monaco-editor/esm/vs/base/common/lifecycle",
        "node_modules/monaco-editor/esm/vs/base/common/types",
        "node_modules/monaco-editor/esm/vs/base/common/map"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/common/modes": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/types",
        "node_modules/monaco-editor/esm/vs/base/common/uri",
        "node_modules/monaco-editor/esm/vs/editor/common/core/range",
        "node_modules/monaco-editor/esm/vs/editor/common/modes/languageFeatureRegistry",
        "node_modules/monaco-editor/esm/vs/editor/common/modes/tokenizationRegistry"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/common/modes/nullMode": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/editor/common/core/token",
        "node_modules/monaco-editor/esm/vs/editor/common/modes"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/common/services/editorWorkerService": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/platform/instantiation/common/instantiation"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/common/services/resolverService": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/platform/instantiation/common/instantiation"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/base/common/worker/simpleWorker": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/errors",
        "node_modules/monaco-editor/esm/vs/base/common/lifecycle",
        "node_modules/monaco-editor/esm/vs/base/common/platform",
        "node_modules/monaco-editor/esm/vs/base/common/types"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/base/worker/defaultWorkerFactory": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/platform",
        "node_modules/monaco-editor/esm/vs/base/common/worker/simpleWorker"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/common/modes/languageConfiguration": {
      "type": "js",
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/common/modes/supports": {
      "type": "js",
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/common/modes/supports/characterPair": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/editor/common/modes/languageConfiguration"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/common/modes/supports/richEditBrackets": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/strings",
        "node_modules/monaco-editor/esm/vs/editor/common/core/range"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/common/modes/supports/electricCharacter": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/editor/common/modes/languageConfiguration",
        "node_modules/monaco-editor/esm/vs/editor/common/modes/supports",
        "node_modules/monaco-editor/esm/vs/editor/common/modes/supports/richEditBrackets"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/common/modes/supports/indentRules": {
      "type": "js",
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/common/modes/supports/onEnter": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/errors",
        "node_modules/monaco-editor/esm/vs/base/common/strings",
        "node_modules/monaco-editor/esm/vs/editor/common/modes/languageConfiguration"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/common/modes/languageConfigurationRegistry": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/errors",
        "node_modules/monaco-editor/esm/vs/base/common/event",
        "node_modules/monaco-editor/esm/vs/base/common/lifecycle",
        "node_modules/monaco-editor/esm/vs/base/common/strings",
        "node_modules/monaco-editor/esm/vs/editor/common/core/range",
        "node_modules/monaco-editor/esm/vs/editor/common/model/wordHelper",
        "node_modules/monaco-editor/esm/vs/editor/common/modes/languageConfiguration",
        "node_modules/monaco-editor/esm/vs/editor/common/modes/supports",
        "node_modules/monaco-editor/esm/vs/editor/common/modes/supports/characterPair",
        "node_modules/monaco-editor/esm/vs/editor/common/modes/supports/electricCharacter",
        "node_modules/monaco-editor/esm/vs/editor/common/modes/supports/indentRules",
        "node_modules/monaco-editor/esm/vs/editor/common/modes/supports/onEnter",
        "node_modules/monaco-editor/esm/vs/editor/common/modes/supports/richEditBrackets"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/base/common/diff/diffChange": {
      "type": "js",
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/base/common/diff/diff": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/diff/diffChange"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/common/diff/diffComputer": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/diff/diff",
        "node_modules/monaco-editor/esm/vs/base/common/strings"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/common/core/uint": {
      "type": "js",
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/common/viewModel/prefixSumComputer": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/editor/common/core/uint"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/common/model/mirrorTextModel": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/editor/common/core/position",
        "node_modules/monaco-editor/esm/vs/editor/common/viewModel/prefixSumComputer"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/common/core/characterClassifier": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/editor/common/core/uint"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/common/modes/linkComputer": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/editor/common/core/characterClassifier",
        "node_modules/monaco-editor/esm/vs/editor/common/core/uint"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/common/modes/supports/inplaceReplaceSupport": {
      "type": "js",
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/common/services/editorSimpleWorker": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/arrays",
        "node_modules/monaco-editor/esm/vs/base/common/diff/diff",
        "node_modules/monaco-editor/esm/vs/base/common/iterator",
        "node_modules/monaco-editor/esm/vs/base/common/platform",
        "node_modules/monaco-editor/esm/vs/base/common/uri",
        "node_modules/monaco-editor/esm/vs/editor/common/core/position",
        "node_modules/monaco-editor/esm/vs/editor/common/core/range",
        "node_modules/monaco-editor/esm/vs/editor/common/diff/diffComputer",
        "node_modules/monaco-editor/esm/vs/editor/common/model/mirrorTextModel",
        "node_modules/monaco-editor/esm/vs/editor/common/model/wordHelper",
        "node_modules/monaco-editor/esm/vs/editor/common/modes/linkComputer",
        "node_modules/monaco-editor/esm/vs/editor/common/modes/supports/inplaceReplaceSupport",
        "node_modules/monaco-editor/esm/vs/editor/common/standalone/standaloneBase",
        "node_modules/monaco-editor/esm/vs/base/common/types"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/common/services/resourceConfiguration": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/platform/instantiation/common/instantiation"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/platform/log/common/log": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/platform/instantiation/common/instantiation"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/base/common/stopwatch": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/platform"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/common/services/editorWorkerServiceImpl": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/async",
        "node_modules/monaco-editor/esm/vs/base/common/lifecycle",
        "node_modules/monaco-editor/esm/vs/base/common/worker/simpleWorker",
        "node_modules/monaco-editor/esm/vs/base/worker/defaultWorkerFactory",
        "node_modules/monaco-editor/esm/vs/editor/common/modes",
        "node_modules/monaco-editor/esm/vs/editor/common/modes/languageConfigurationRegistry",
        "node_modules/monaco-editor/esm/vs/editor/common/services/editorSimpleWorker",
        "node_modules/monaco-editor/esm/vs/editor/common/services/modelService",
        "node_modules/monaco-editor/esm/vs/editor/common/services/resourceConfiguration",
        "node_modules/monaco-editor/esm/vs/base/common/strings",
        "node_modules/monaco-editor/esm/vs/base/common/arrays",
        "node_modules/monaco-editor/esm/vs/platform/log/common/log",
        "node_modules/monaco-editor/esm/vs/base/common/stopwatch"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/common/services/webWorker": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/editor/common/services/editorWorkerServiceImpl"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/common/core/lineTokens": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/editor/common/modes"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/common/core/stringBuilder": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/strings"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/common/viewLayout/lineDecorations": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/strings"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/common/viewLayout/viewLineRenderer": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/strings",
        "node_modules/monaco-editor/esm/vs/editor/common/core/stringBuilder",
        "node_modules/monaco-editor/esm/vs/editor/common/viewLayout/lineDecorations"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/common/viewModel/viewModel": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/strings"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/standalone/common/monarch/monarchCommon": {
      "type": "js",
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/standalone/common/monarch/monarchLexer": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/editor/common/core/token",
        "node_modules/monaco-editor/esm/vs/editor/common/modes",
        "node_modules/monaco-editor/esm/vs/editor/common/modes/nullMode",
        "node_modules/monaco-editor/esm/vs/editor/standalone/common/monarch/monarchCommon"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/standalone/browser/colorizer": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/async",
        "node_modules/monaco-editor/esm/vs/base/common/strings",
        "node_modules/monaco-editor/esm/vs/editor/common/core/lineTokens",
        "node_modules/monaco-editor/esm/vs/editor/common/modes",
        "node_modules/monaco-editor/esm/vs/editor/common/viewLayout/viewLineRenderer",
        "node_modules/monaco-editor/esm/vs/editor/common/viewModel/viewModel",
        "node_modules/monaco-editor/esm/vs/editor/standalone/common/monarch/monarchLexer"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/base/common/severity": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/nls",
        "node_modules/monaco-editor/esm/vs/base/common/strings"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/browser/editorBrowser": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/editor/common/editorCommon"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/platform/registry/common/platform": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/types",
        "node_modules/monaco-editor/esm/vs/base/common/assert"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/platform/jsonschemas/common/jsonContributionRegistry": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/platform/registry/common/platform",
        "node_modules/monaco-editor/esm/vs/base/common/event"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/platform/configuration/common/configurationRegistry": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/nls",
        "node_modules/monaco-editor/esm/vs/base/common/event",
        "node_modules/monaco-editor/esm/vs/platform/registry/common/platform",
        "node_modules/monaco-editor/esm/vs/base/common/types",
        "node_modules/monaco-editor/esm/vs/base/common/strings",
        "node_modules/monaco-editor/esm/vs/platform/jsonschemas/common/jsonContributionRegistry"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/common/config/commonEditorConfig": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/nls",
        "node_modules/monaco-editor/esm/vs/base/common/event",
        "node_modules/monaco-editor/esm/vs/base/common/lifecycle",
        "node_modules/monaco-editor/esm/vs/base/common/objects",
        "node_modules/monaco-editor/esm/vs/base/common/platform",
        "node_modules/monaco-editor/esm/vs/editor/common/config/editorOptions",
        "node_modules/monaco-editor/esm/vs/editor/common/config/editorZoom",
        "node_modules/monaco-editor/esm/vs/editor/common/config/fontInfo",
        "node_modules/monaco-editor/esm/vs/platform/configuration/common/configurationRegistry",
        "node_modules/monaco-editor/esm/vs/platform/registry/common/platform"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/common/core/editOperation": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/editor/common/core/range"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/platform/configuration/common/configuration": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/platform/registry/common/platform",
        "node_modules/monaco-editor/esm/vs/platform/instantiation/common/instantiation",
        "node_modules/monaco-editor/esm/vs/platform/configuration/common/configurationRegistry"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/platform/configuration/common/configurationModels": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/map",
        "node_modules/monaco-editor/esm/vs/base/common/arrays",
        "node_modules/monaco-editor/esm/vs/base/common/types",
        "node_modules/monaco-editor/esm/vs/base/common/objects",
        "node_modules/monaco-editor/esm/vs/platform/configuration/common/configurationRegistry",
        "node_modules/monaco-editor/esm/vs/platform/configuration/common/configuration"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/platform/keybinding/common/abstractKeybindingService": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/nls",
        "node_modules/monaco-editor/esm/vs/base/common/async",
        "node_modules/monaco-editor/esm/vs/base/common/event",
        "node_modules/monaco-editor/esm/vs/base/common/lifecycle",
        "node_modules/monaco-editor/esm/vs/base/common/types"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/platform/contextkey/common/contextkey": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/strings",
        "node_modules/monaco-editor/esm/vs/platform/instantiation/common/instantiation"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/platform/keybinding/common/keybindingResolver": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/platform/contextkey/common/contextkey"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/platform/keybinding/common/keybindingsRegistry": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/keyCodes",
        "node_modules/monaco-editor/esm/vs/base/common/platform",
        "node_modules/monaco-editor/esm/vs/platform/commands/common/commands",
        "node_modules/monaco-editor/esm/vs/platform/registry/common/platform"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/platform/keybinding/common/resolvedKeybindingItem": {
      "type": "js",
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/base/common/keybindingLabels": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/nls"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/platform/keybinding/common/baseResolvedKeybinding": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/errors",
        "node_modules/monaco-editor/esm/vs/base/common/keybindingLabels",
        "node_modules/monaco-editor/esm/vs/base/common/keyCodes"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/platform/keybinding/common/usLayoutResolvedKeybinding": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/keyCodes",
        "node_modules/monaco-editor/esm/vs/platform/keybinding/common/baseResolvedKeybinding"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/platform/notification/common/notification": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/severity",
        "node_modules/monaco-editor/esm/vs/platform/instantiation/common/instantiation"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/platform/workspace/common/workspace": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/uri",
        "node_modules/monaco-editor/esm/vs/base/common/resources",
        "node_modules/monaco-editor/esm/vs/platform/instantiation/common/instantiation",
        "node_modules/monaco-editor/esm/vs/base/common/map"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/common/standaloneStrings": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/nls"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/standalone/browser/simpleServices": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/strings",
        "node_modules/monaco-editor/esm/vs/base/browser/dom",
        "node_modules/monaco-editor/esm/vs/base/browser/keyboardEvent",
        "node_modules/monaco-editor/esm/vs/base/common/event",
        "node_modules/monaco-editor/esm/vs/base/common/keyCodes",
        "node_modules/monaco-editor/esm/vs/base/common/lifecycle",
        "node_modules/monaco-editor/esm/vs/base/common/platform",
        "node_modules/monaco-editor/esm/vs/base/common/severity",
        "node_modules/monaco-editor/esm/vs/base/common/uri",
        "node_modules/monaco-editor/esm/vs/editor/browser/editorBrowser",
        "node_modules/monaco-editor/esm/vs/editor/common/config/commonEditorConfig",
        "node_modules/monaco-editor/esm/vs/editor/common/core/editOperation",
        "node_modules/monaco-editor/esm/vs/editor/common/core/position",
        "node_modules/monaco-editor/esm/vs/editor/common/core/range",
        "node_modules/monaco-editor/esm/vs/editor/common/modes",
        "node_modules/monaco-editor/esm/vs/platform/commands/common/commands",
        "node_modules/monaco-editor/esm/vs/platform/configuration/common/configuration",
        "node_modules/monaco-editor/esm/vs/platform/configuration/common/configurationModels",
        "node_modules/monaco-editor/esm/vs/platform/keybinding/common/abstractKeybindingService",
        "node_modules/monaco-editor/esm/vs/platform/keybinding/common/keybindingResolver",
        "node_modules/monaco-editor/esm/vs/platform/keybinding/common/keybindingsRegistry",
        "node_modules/monaco-editor/esm/vs/platform/keybinding/common/resolvedKeybindingItem",
        "node_modules/monaco-editor/esm/vs/platform/keybinding/common/usLayoutResolvedKeybinding",
        "node_modules/monaco-editor/esm/vs/platform/notification/common/notification",
        "node_modules/monaco-editor/esm/vs/platform/workspace/common/workspace",
        "node_modules/monaco-editor/esm/vs/editor/common/standaloneStrings"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/base/browser/ui/aria/aria": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/nls",
        "node_modules/monaco-editor/esm/vs/base/common/platform",
        "node_modules/monaco-editor/esm/vs/base/browser/dom"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/browser/config/charWidthReader": {
      "type": "js",
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/browser/config/elementSizeObserver": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/lifecycle"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/browser/config/configuration": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/browser/browser",
        "node_modules/monaco-editor/esm/vs/base/common/event",
        "node_modules/monaco-editor/esm/vs/base/common/lifecycle",
        "node_modules/monaco-editor/esm/vs/base/common/platform",
        "node_modules/monaco-editor/esm/vs/editor/browser/config/charWidthReader",
        "node_modules/monaco-editor/esm/vs/editor/browser/config/elementSizeObserver",
        "node_modules/monaco-editor/esm/vs/editor/common/config/commonEditorConfig",
        "node_modules/monaco-editor/esm/vs/editor/common/config/fontInfo"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/base/common/actions": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/lifecycle",
        "node_modules/monaco-editor/esm/vs/base/common/event"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/platform/actions/common/actions": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/actions",
        "node_modules/monaco-editor/esm/vs/platform/instantiation/common/instantiation",
        "node_modules/monaco-editor/esm/vs/platform/contextkey/common/contextkey",
        "node_modules/monaco-editor/esm/vs/platform/commands/common/commands",
        "node_modules/monaco-editor/esm/vs/base/common/event"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/platform/telemetry/common/telemetry": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/platform/instantiation/common/instantiation"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/browser/editorExtensions": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/errors",
        "node_modules/monaco-editor/esm/vs/base/common/uri",
        "node_modules/monaco-editor/esm/vs/editor/browser/services/codeEditorService",
        "node_modules/monaco-editor/esm/vs/editor/common/core/position",
        "node_modules/monaco-editor/esm/vs/editor/common/services/modelService",
        "node_modules/monaco-editor/esm/vs/editor/common/services/resolverService",
        "node_modules/monaco-editor/esm/vs/platform/actions/common/actions",
        "node_modules/monaco-editor/esm/vs/platform/commands/common/commands",
        "node_modules/monaco-editor/esm/vs/platform/contextkey/common/contextkey",
        "node_modules/monaco-editor/esm/vs/platform/keybinding/common/keybindingsRegistry",
        "node_modules/monaco-editor/esm/vs/platform/registry/common/platform",
        "node_modules/monaco-editor/esm/vs/platform/telemetry/common/telemetry",
        "node_modules/monaco-editor/esm/vs/base/common/types"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/base/browser/fastDomNode": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/browser/dom"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/base/common/decorators": {
      "type": "js",
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/base/browser/touch": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/arrays",
        "node_modules/monaco-editor/esm/vs/base/common/lifecycle",
        "node_modules/monaco-editor/esm/vs/base/browser/dom",
        "node_modules/monaco-editor/esm/vs/base/common/decorators"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/base/browser/globalMouseMoveMonitor": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/browser/dom",
        "node_modules/monaco-editor/esm/vs/base/browser/iframe",
        "node_modules/monaco-editor/esm/vs/base/browser/mouseEvent",
        "node_modules/monaco-editor/esm/vs/base/common/lifecycle"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/browser/editorDom": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/browser/dom",
        "node_modules/monaco-editor/esm/vs/base/browser/globalMouseMoveMonitor",
        "node_modules/monaco-editor/esm/vs/base/browser/mouseEvent",
        "node_modules/monaco-editor/esm/vs/base/common/lifecycle"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/common/viewModel/viewEventHandler": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/lifecycle"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/browser/view/viewPart": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/browser/fastDomNode",
        "node_modules/monaco-editor/esm/vs/editor/common/viewModel/viewEventHandler"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/common/view/renderingContext": {
      "type": "js",
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/browser/viewParts/lines/rangeUtil": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/editor/common/view/renderingContext"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/platform/theme/common/themeService": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/platform/instantiation/common/instantiation",
        "node_modules/monaco-editor/esm/vs/base/common/lifecycle",
        "node_modules/monaco-editor/esm/vs/platform/registry/common/platform",
        "node_modules/monaco-editor/esm/vs/base/common/event"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/browser/viewParts/lines/viewLine": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/browser/browser",
        "node_modules/monaco-editor/esm/vs/base/browser/fastDomNode",
        "node_modules/monaco-editor/esm/vs/base/common/platform",
        "node_modules/monaco-editor/esm/vs/editor/browser/viewParts/lines/rangeUtil",
        "node_modules/monaco-editor/esm/vs/editor/common/view/renderingContext",
        "node_modules/monaco-editor/esm/vs/editor/common/viewLayout/lineDecorations",
        "node_modules/monaco-editor/esm/vs/editor/common/viewLayout/viewLineRenderer",
        "node_modules/monaco-editor/esm/vs/platform/theme/common/themeService"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/browser/controller/mouseTarget": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/browser/browser",
        "node_modules/monaco-editor/esm/vs/editor/browser/editorDom",
        "node_modules/monaco-editor/esm/vs/editor/browser/view/viewPart",
        "node_modules/monaco-editor/esm/vs/editor/browser/viewParts/lines/viewLine",
        "node_modules/monaco-editor/esm/vs/editor/common/core/position",
        "node_modules/monaco-editor/esm/vs/editor/common/core/range"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/browser/controller/mouseHandler": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/browser/browser",
        "node_modules/monaco-editor/esm/vs/base/browser/dom",
        "node_modules/monaco-editor/esm/vs/base/browser/mouseEvent",
        "node_modules/monaco-editor/esm/vs/base/common/async",
        "node_modules/monaco-editor/esm/vs/base/common/lifecycle",
        "node_modules/monaco-editor/esm/vs/base/common/platform",
        "node_modules/monaco-editor/esm/vs/editor/browser/controller/mouseTarget",
        "node_modules/monaco-editor/esm/vs/editor/browser/editorDom",
        "node_modules/monaco-editor/esm/vs/editor/common/config/editorZoom",
        "node_modules/monaco-editor/esm/vs/editor/common/core/position",
        "node_modules/monaco-editor/esm/vs/editor/common/core/selection",
        "node_modules/monaco-editor/esm/vs/editor/common/viewModel/viewEventHandler"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/browser/controller/pointerHandler": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/browser/dom",
        "node_modules/monaco-editor/esm/vs/base/browser/touch",
        "node_modules/monaco-editor/esm/vs/editor/browser/controller/mouseHandler",
        "node_modules/monaco-editor/esm/vs/editor/browser/editorDom"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/browser/controller/textAreaState": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/strings",
        "node_modules/monaco-editor/esm/vs/editor/common/core/position",
        "node_modules/monaco-editor/esm/vs/editor/common/core/range"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/browser/controller/textAreaInput": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/browser/browser",
        "node_modules/monaco-editor/esm/vs/base/browser/dom",
        "node_modules/monaco-editor/esm/vs/base/common/async",
        "node_modules/monaco-editor/esm/vs/base/common/event",
        "node_modules/monaco-editor/esm/vs/base/common/lifecycle",
        "node_modules/monaco-editor/esm/vs/base/common/platform",
        "node_modules/monaco-editor/esm/vs/base/common/strings",
        "node_modules/monaco-editor/esm/vs/editor/browser/controller/textAreaState",
        "node_modules/monaco-editor/esm/vs/editor/common/core/selection"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/browser/view/dynamicViewOverlay": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/editor/common/viewModel/viewEventHandler"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/base/common/color": {
      "type": "js",
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/platform/theme/common/colorRegistry": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/platform/registry/common/platform",
        "node_modules/monaco-editor/esm/vs/base/common/color",
        "node_modules/monaco-editor/esm/vs/base/common/event",
        "node_modules/monaco-editor/esm/vs/nls",
        "node_modules/monaco-editor/esm/vs/platform/jsonschemas/common/jsonContributionRegistry",
        "node_modules/monaco-editor/esm/vs/base/common/async"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/common/view/editorColorRegistry": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/nls",
        "node_modules/monaco-editor/esm/vs/base/common/color",
        "node_modules/monaco-editor/esm/vs/platform/theme/common/colorRegistry",
        "node_modules/monaco-editor/esm/vs/platform/theme/common/themeService"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/browser/viewParts/lineNumbers/lineNumbers": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/platform",
        "node_modules/monaco-editor/esm/vs/editor/browser/view/dynamicViewOverlay",
        "node_modules/monaco-editor/esm/vs/editor/common/core/position",
        "node_modules/monaco-editor/esm/vs/editor/common/view/editorColorRegistry",
        "node_modules/monaco-editor/esm/vs/platform/theme/common/themeService"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/browser/viewParts/margin/margin": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/browser/fastDomNode",
        "node_modules/monaco-editor/esm/vs/editor/browser/view/viewPart"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/common/controller/wordCharacterClassifier": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/editor/common/core/characterClassifier"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/common/view/viewEvents": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/errors",
        "node_modules/monaco-editor/esm/vs/base/common/lifecycle"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/browser/controller/textAreaHandler": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/browser/browser",
        "node_modules/monaco-editor/esm/vs/base/browser/fastDomNode",
        "node_modules/monaco-editor/esm/vs/base/common/platform",
        "node_modules/monaco-editor/esm/vs/base/common/strings",
        "node_modules/monaco-editor/esm/vs/editor/browser/config/configuration",
        "node_modules/monaco-editor/esm/vs/editor/browser/controller/textAreaInput",
        "node_modules/monaco-editor/esm/vs/editor/browser/controller/textAreaState",
        "node_modules/monaco-editor/esm/vs/editor/browser/view/viewPart",
        "node_modules/monaco-editor/esm/vs/editor/browser/viewParts/lineNumbers/lineNumbers",
        "node_modules/monaco-editor/esm/vs/editor/browser/viewParts/margin/margin",
        "node_modules/monaco-editor/esm/vs/editor/common/controller/wordCharacterClassifier",
        "node_modules/monaco-editor/esm/vs/editor/common/core/position",
        "node_modules/monaco-editor/esm/vs/editor/common/core/range",
        "node_modules/monaco-editor/esm/vs/editor/common/core/selection",
        "node_modules/monaco-editor/esm/vs/editor/common/view/viewEvents"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/common/model/editStack": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/errors"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/common/model/indentationGuesser": {
      "type": "js",
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/common/model/intervalTree": {
      "type": "js",
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/common/model/pieceTreeTextBuffer/rbTreeBase": {
      "type": "js",
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/common/model/textModelSearch": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/strings",
        "node_modules/monaco-editor/esm/vs/editor/common/controller/wordCharacterClassifier",
        "node_modules/monaco-editor/esm/vs/editor/common/core/position",
        "node_modules/monaco-editor/esm/vs/editor/common/core/range",
        "node_modules/monaco-editor/esm/vs/editor/common/model"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/common/model/pieceTreeTextBuffer/pieceTreeBase": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/editor/common/core/position",
        "node_modules/monaco-editor/esm/vs/editor/common/core/range",
        "node_modules/monaco-editor/esm/vs/editor/common/model",
        "node_modules/monaco-editor/esm/vs/editor/common/model/pieceTreeTextBuffer/rbTreeBase",
        "node_modules/monaco-editor/esm/vs/editor/common/model/textModelSearch"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/common/model/pieceTreeTextBuffer/pieceTreeTextBuffer": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/strings",
        "node_modules/monaco-editor/esm/vs/editor/common/core/range",
        "node_modules/monaco-editor/esm/vs/editor/common/model",
        "node_modules/monaco-editor/esm/vs/editor/common/model/pieceTreeTextBuffer/pieceTreeBase"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/common/model/pieceTreeTextBuffer/pieceTreeTextBufferBuilder": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/strings",
        "node_modules/monaco-editor/esm/vs/editor/common/model/pieceTreeTextBuffer/pieceTreeBase",
        "node_modules/monaco-editor/esm/vs/editor/common/model/pieceTreeTextBuffer/pieceTreeTextBuffer"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/common/model/textModelEvents": {
      "type": "js",
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/common/model/textModelTokens": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/arrays",
        "node_modules/monaco-editor/esm/vs/base/common/errors",
        "node_modules/monaco-editor/esm/vs/editor/common/core/lineTokens",
        "node_modules/monaco-editor/esm/vs/editor/common/core/position",
        "node_modules/monaco-editor/esm/vs/editor/common/modes",
        "node_modules/monaco-editor/esm/vs/editor/common/modes/nullMode"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/common/model/textModel": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/errors",
        "node_modules/monaco-editor/esm/vs/base/common/event",
        "node_modules/monaco-editor/esm/vs/base/common/lifecycle",
        "node_modules/monaco-editor/esm/vs/base/common/stopwatch",
        "node_modules/monaco-editor/esm/vs/base/common/strings",
        "node_modules/monaco-editor/esm/vs/base/common/uri",
        "node_modules/monaco-editor/esm/vs/editor/common/config/editorOptions",
        "node_modules/monaco-editor/esm/vs/editor/common/core/position",
        "node_modules/monaco-editor/esm/vs/editor/common/core/range",
        "node_modules/monaco-editor/esm/vs/editor/common/core/selection",
        "node_modules/monaco-editor/esm/vs/editor/common/model",
        "node_modules/monaco-editor/esm/vs/editor/common/model/editStack",
        "node_modules/monaco-editor/esm/vs/editor/common/model/indentationGuesser",
        "node_modules/monaco-editor/esm/vs/editor/common/model/intervalTree",
        "node_modules/monaco-editor/esm/vs/editor/common/model/pieceTreeTextBuffer/pieceTreeTextBufferBuilder",
        "node_modules/monaco-editor/esm/vs/editor/common/model/textModelEvents",
        "node_modules/monaco-editor/esm/vs/editor/common/model/textModelSearch",
        "node_modules/monaco-editor/esm/vs/editor/common/model/textModelTokens",
        "node_modules/monaco-editor/esm/vs/editor/common/model/wordHelper",
        "node_modules/monaco-editor/esm/vs/editor/common/modes",
        "node_modules/monaco-editor/esm/vs/editor/common/modes/languageConfigurationRegistry",
        "node_modules/monaco-editor/esm/vs/editor/common/modes/nullMode",
        "node_modules/monaco-editor/esm/vs/editor/common/modes/supports",
        "node_modules/monaco-editor/esm/vs/editor/common/modes/supports/richEditBrackets",
        "node_modules/monaco-editor/esm/vs/base/common/types"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/common/controller/cursorCommon": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/errors",
        "node_modules/monaco-editor/esm/vs/base/common/strings",
        "node_modules/monaco-editor/esm/vs/editor/common/core/position",
        "node_modules/monaco-editor/esm/vs/editor/common/core/range",
        "node_modules/monaco-editor/esm/vs/editor/common/core/selection",
        "node_modules/monaco-editor/esm/vs/editor/common/model/textModel",
        "node_modules/monaco-editor/esm/vs/editor/common/modes/languageConfigurationRegistry"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/common/controller/cursorColumnSelection": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/editor/common/controller/cursorCommon",
        "node_modules/monaco-editor/esm/vs/editor/common/core/position",
        "node_modules/monaco-editor/esm/vs/editor/common/core/range"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/common/commands/replaceCommand": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/editor/common/core/selection"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/common/controller/cursorMoveOperations": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/editor/common/controller/cursorCommon",
        "node_modules/monaco-editor/esm/vs/editor/common/core/position",
        "node_modules/monaco-editor/esm/vs/editor/common/core/range"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/common/controller/cursorDeleteOperations": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/strings",
        "node_modules/monaco-editor/esm/vs/editor/common/commands/replaceCommand",
        "node_modules/monaco-editor/esm/vs/editor/common/controller/cursorCommon",
        "node_modules/monaco-editor/esm/vs/editor/common/controller/cursorMoveOperations",
        "node_modules/monaco-editor/esm/vs/editor/common/core/range"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/common/controller/cursorWordOperations": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/strings",
        "node_modules/monaco-editor/esm/vs/editor/common/controller/cursorCommon",
        "node_modules/monaco-editor/esm/vs/editor/common/controller/wordCharacterClassifier",
        "node_modules/monaco-editor/esm/vs/editor/common/core/position",
        "node_modules/monaco-editor/esm/vs/editor/common/core/range"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/common/controller/cursorMoveCommands": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/types",
        "node_modules/monaco-editor/esm/vs/editor/common/controller/cursorCommon",
        "node_modules/monaco-editor/esm/vs/editor/common/controller/cursorMoveOperations",
        "node_modules/monaco-editor/esm/vs/editor/common/controller/cursorWordOperations",
        "node_modules/monaco-editor/esm/vs/editor/common/core/position",
        "node_modules/monaco-editor/esm/vs/editor/common/core/range"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/common/commands/shiftCommand": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/strings",
        "node_modules/monaco-editor/esm/vs/editor/common/controller/cursorCommon",
        "node_modules/monaco-editor/esm/vs/editor/common/core/range",
        "node_modules/monaco-editor/esm/vs/editor/common/core/selection",
        "node_modules/monaco-editor/esm/vs/editor/common/modes/languageConfigurationRegistry"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/common/commands/surroundSelectionCommand": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/editor/common/core/range",
        "node_modules/monaco-editor/esm/vs/editor/common/core/selection"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/common/controller/cursorTypeOperations": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/errors",
        "node_modules/monaco-editor/esm/vs/base/common/strings",
        "node_modules/monaco-editor/esm/vs/editor/common/commands/replaceCommand",
        "node_modules/monaco-editor/esm/vs/editor/common/commands/shiftCommand",
        "node_modules/monaco-editor/esm/vs/editor/common/commands/surroundSelectionCommand",
        "node_modules/monaco-editor/esm/vs/editor/common/controller/cursorCommon",
        "node_modules/monaco-editor/esm/vs/editor/common/controller/wordCharacterClassifier",
        "node_modules/monaco-editor/esm/vs/editor/common/core/range",
        "node_modules/monaco-editor/esm/vs/editor/common/modes/languageConfiguration",
        "node_modules/monaco-editor/esm/vs/editor/common/modes/languageConfigurationRegistry"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/common/editorContextKeys": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/platform/contextkey/common/contextkey"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/browser/controller/coreCommands": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/nls",
        "node_modules/monaco-editor/esm/vs/base/common/types",
        "node_modules/monaco-editor/esm/vs/editor/browser/editorExtensions",
        "node_modules/monaco-editor/esm/vs/editor/browser/services/codeEditorService",
        "node_modules/monaco-editor/esm/vs/editor/common/controller/cursorColumnSelection",
        "node_modules/monaco-editor/esm/vs/editor/common/controller/cursorCommon",
        "node_modules/monaco-editor/esm/vs/editor/common/controller/cursorDeleteOperations",
        "node_modules/monaco-editor/esm/vs/editor/common/controller/cursorMoveCommands",
        "node_modules/monaco-editor/esm/vs/editor/common/controller/cursorTypeOperations",
        "node_modules/monaco-editor/esm/vs/editor/common/core/position",
        "node_modules/monaco-editor/esm/vs/editor/common/core/range",
        "node_modules/monaco-editor/esm/vs/editor/common/editorCommon",
        "node_modules/monaco-editor/esm/vs/editor/common/editorContextKeys",
        "node_modules/monaco-editor/esm/vs/platform/contextkey/common/contextkey"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/browser/view/viewController": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/editor/browser/controller/coreCommands",
        "node_modules/monaco-editor/esm/vs/editor/common/core/position"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/browser/view/viewLayer": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/browser/fastDomNode",
        "node_modules/monaco-editor/esm/vs/editor/common/core/stringBuilder"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/browser/view/viewOverlays": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/browser/fastDomNode",
        "node_modules/monaco-editor/esm/vs/editor/browser/config/configuration",
        "node_modules/monaco-editor/esm/vs/editor/browser/view/viewLayer",
        "node_modules/monaco-editor/esm/vs/editor/browser/view/viewPart"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/browser/viewParts/contentWidgets/contentWidgets": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/browser/dom",
        "node_modules/monaco-editor/esm/vs/base/browser/fastDomNode",
        "node_modules/monaco-editor/esm/vs/editor/browser/view/viewPart",
        "node_modules/monaco-editor/esm/vs/base/common/types"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/browser/viewParts/currentLineHighlight/currentLineHighlight": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/editor/browser/view/dynamicViewOverlay",
        "node_modules/monaco-editor/esm/vs/editor/common/view/editorColorRegistry",
        "node_modules/monaco-editor/esm/vs/platform/theme/common/themeService"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/browser/viewParts/currentLineMarginHighlight/currentLineMarginHighlight": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/editor/browser/view/dynamicViewOverlay",
        "node_modules/monaco-editor/esm/vs/editor/common/view/editorColorRegistry",
        "node_modules/monaco-editor/esm/vs/platform/theme/common/themeService"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/browser/viewParts/decorations/decorations": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/editor/browser/view/dynamicViewOverlay",
        "node_modules/monaco-editor/esm/vs/editor/common/core/range",
        "node_modules/monaco-editor/esm/vs/editor/common/view/renderingContext"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/base/browser/ui/widget": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/browser/dom",
        "node_modules/monaco-editor/esm/vs/base/browser/keyboardEvent",
        "node_modules/monaco-editor/esm/vs/base/browser/mouseEvent",
        "node_modules/monaco-editor/esm/vs/base/common/lifecycle"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/base/browser/ui/scrollbar/scrollbarArrow": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/browser/globalMouseMoveMonitor",
        "node_modules/monaco-editor/esm/vs/base/browser/ui/widget",
        "node_modules/monaco-editor/esm/vs/base/common/async"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/base/browser/ui/scrollbar/scrollbarVisibilityController": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/async",
        "node_modules/monaco-editor/esm/vs/base/common/lifecycle"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/base/browser/ui/scrollbar/abstractScrollbar": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/browser/dom",
        "node_modules/monaco-editor/esm/vs/base/browser/fastDomNode",
        "node_modules/monaco-editor/esm/vs/base/browser/globalMouseMoveMonitor",
        "node_modules/monaco-editor/esm/vs/base/browser/ui/scrollbar/scrollbarArrow",
        "node_modules/monaco-editor/esm/vs/base/browser/ui/scrollbar/scrollbarVisibilityController",
        "node_modules/monaco-editor/esm/vs/base/browser/ui/widget",
        "node_modules/monaco-editor/esm/vs/base/common/platform"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/base/browser/ui/scrollbar/scrollbarState": {
      "type": "js",
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/base/browser/ui/scrollbar/horizontalScrollbar": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/browser/mouseEvent",
        "node_modules/monaco-editor/esm/vs/base/browser/ui/scrollbar/abstractScrollbar",
        "node_modules/monaco-editor/esm/vs/base/browser/ui/scrollbar/scrollbarArrow",
        "node_modules/monaco-editor/esm/vs/base/browser/ui/scrollbar/scrollbarState"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/base/browser/ui/scrollbar/verticalScrollbar": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/browser/mouseEvent",
        "node_modules/monaco-editor/esm/vs/base/browser/ui/scrollbar/abstractScrollbar",
        "node_modules/monaco-editor/esm/vs/base/browser/ui/scrollbar/scrollbarArrow",
        "node_modules/monaco-editor/esm/vs/base/browser/ui/scrollbar/scrollbarState"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/base/common/scrollable": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/event",
        "node_modules/monaco-editor/esm/vs/base/common/lifecycle"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/base/browser/ui/scrollbar/scrollableElement": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/browser/dom",
        "node_modules/monaco-editor/esm/vs/base/browser/fastDomNode",
        "node_modules/monaco-editor/esm/vs/base/browser/mouseEvent",
        "node_modules/monaco-editor/esm/vs/base/browser/ui/scrollbar/horizontalScrollbar",
        "node_modules/monaco-editor/esm/vs/base/browser/ui/scrollbar/verticalScrollbar",
        "node_modules/monaco-editor/esm/vs/base/browser/ui/widget",
        "node_modules/monaco-editor/esm/vs/base/common/async",
        "node_modules/monaco-editor/esm/vs/base/common/event",
        "node_modules/monaco-editor/esm/vs/base/common/lifecycle",
        "node_modules/monaco-editor/esm/vs/base/common/platform",
        "node_modules/monaco-editor/esm/vs/base/common/scrollable"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/browser/viewParts/editorScrollbar/editorScrollbar": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/browser/dom",
        "node_modules/monaco-editor/esm/vs/base/browser/fastDomNode",
        "node_modules/monaco-editor/esm/vs/base/browser/ui/scrollbar/scrollableElement",
        "node_modules/monaco-editor/esm/vs/editor/browser/view/viewPart",
        "node_modules/monaco-editor/esm/vs/platform/theme/common/themeService"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/browser/viewParts/glyphMargin/glyphMargin": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/editor/browser/view/dynamicViewOverlay"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/browser/viewParts/indentGuides/indentGuides": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/editor/browser/view/dynamicViewOverlay",
        "node_modules/monaco-editor/esm/vs/editor/common/core/position",
        "node_modules/monaco-editor/esm/vs/editor/common/view/editorColorRegistry",
        "node_modules/monaco-editor/esm/vs/platform/theme/common/themeService"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/browser/viewParts/lines/viewLines": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/async",
        "node_modules/monaco-editor/esm/vs/editor/browser/config/configuration",
        "node_modules/monaco-editor/esm/vs/editor/browser/view/viewLayer",
        "node_modules/monaco-editor/esm/vs/editor/browser/view/viewPart",
        "node_modules/monaco-editor/esm/vs/editor/browser/viewParts/lines/viewLine",
        "node_modules/monaco-editor/esm/vs/editor/common/core/position",
        "node_modules/monaco-editor/esm/vs/editor/common/core/range",
        "node_modules/monaco-editor/esm/vs/editor/common/view/renderingContext"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/browser/viewParts/linesDecorations/linesDecorations": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/editor/browser/viewParts/glyphMargin/glyphMargin"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/browser/viewParts/marginDecorations/marginDecorations": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/editor/browser/viewParts/glyphMargin/glyphMargin"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/common/core/rgba": {
      "type": "js",
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/common/view/minimapCharRenderer": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/event",
        "node_modules/monaco-editor/esm/vs/editor/common/core/rgba",
        "node_modules/monaco-editor/esm/vs/editor/common/modes"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/common/view/runtimeMinimapCharRenderer": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/editor/common/view/minimapCharRenderer"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/browser/viewParts/minimap/minimap": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/browser/dom",
        "node_modules/monaco-editor/esm/vs/base/browser/fastDomNode",
        "node_modules/monaco-editor/esm/vs/base/browser/globalMouseMoveMonitor",
        "node_modules/monaco-editor/esm/vs/base/common/platform",
        "node_modules/monaco-editor/esm/vs/base/common/strings",
        "node_modules/monaco-editor/esm/vs/editor/browser/view/viewLayer",
        "node_modules/monaco-editor/esm/vs/editor/browser/view/viewPart",
        "node_modules/monaco-editor/esm/vs/editor/common/core/range",
        "node_modules/monaco-editor/esm/vs/editor/common/view/minimapCharRenderer",
        "node_modules/monaco-editor/esm/vs/editor/common/view/runtimeMinimapCharRenderer",
        "node_modules/monaco-editor/esm/vs/editor/common/view/viewEvents",
        "node_modules/monaco-editor/esm/vs/platform/theme/common/colorRegistry",
        "node_modules/monaco-editor/esm/vs/platform/theme/common/themeService"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/browser/viewParts/overlayWidgets/overlayWidgets": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/browser/fastDomNode",
        "node_modules/monaco-editor/esm/vs/editor/browser/view/viewPart"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/browser/viewParts/overviewRuler/decorationsOverviewRuler": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/browser/fastDomNode",
        "node_modules/monaco-editor/esm/vs/base/common/color",
        "node_modules/monaco-editor/esm/vs/editor/browser/view/viewPart",
        "node_modules/monaco-editor/esm/vs/editor/common/core/position",
        "node_modules/monaco-editor/esm/vs/editor/common/modes",
        "node_modules/monaco-editor/esm/vs/editor/common/view/editorColorRegistry"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/common/view/overviewZoneManager": {
      "type": "js",
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/browser/viewParts/overviewRuler/overviewRuler": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/browser/fastDomNode",
        "node_modules/monaco-editor/esm/vs/editor/common/view/overviewZoneManager",
        "node_modules/monaco-editor/esm/vs/editor/common/viewModel/viewEventHandler"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/browser/viewParts/rulers/rulers": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/browser/fastDomNode",
        "node_modules/monaco-editor/esm/vs/editor/browser/view/viewPart",
        "node_modules/monaco-editor/esm/vs/editor/common/view/editorColorRegistry",
        "node_modules/monaco-editor/esm/vs/platform/theme/common/themeService"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/browser/viewParts/scrollDecoration/scrollDecoration": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/browser/fastDomNode",
        "node_modules/monaco-editor/esm/vs/editor/browser/view/viewPart",
        "node_modules/monaco-editor/esm/vs/platform/theme/common/colorRegistry",
        "node_modules/monaco-editor/esm/vs/platform/theme/common/themeService"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/browser/viewParts/selections/selections": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/browser/browser",
        "node_modules/monaco-editor/esm/vs/editor/browser/view/dynamicViewOverlay",
        "node_modules/monaco-editor/esm/vs/platform/theme/common/colorRegistry",
        "node_modules/monaco-editor/esm/vs/platform/theme/common/themeService"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/browser/viewParts/viewCursors/viewCursor": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/browser/dom",
        "node_modules/monaco-editor/esm/vs/base/browser/fastDomNode",
        "node_modules/monaco-editor/esm/vs/base/common/strings",
        "node_modules/monaco-editor/esm/vs/editor/browser/config/configuration",
        "node_modules/monaco-editor/esm/vs/editor/common/config/editorOptions",
        "node_modules/monaco-editor/esm/vs/editor/common/core/position",
        "node_modules/monaco-editor/esm/vs/editor/common/core/range"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/browser/viewParts/viewCursors/viewCursors": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/browser/fastDomNode",
        "node_modules/monaco-editor/esm/vs/base/common/async",
        "node_modules/monaco-editor/esm/vs/editor/browser/view/viewPart",
        "node_modules/monaco-editor/esm/vs/editor/browser/viewParts/viewCursors/viewCursor",
        "node_modules/monaco-editor/esm/vs/editor/common/config/editorOptions",
        "node_modules/monaco-editor/esm/vs/editor/common/view/editorColorRegistry",
        "node_modules/monaco-editor/esm/vs/platform/theme/common/themeService"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/browser/viewParts/viewZones/viewZones": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/browser/fastDomNode",
        "node_modules/monaco-editor/esm/vs/base/common/errors",
        "node_modules/monaco-editor/esm/vs/editor/browser/view/viewPart",
        "node_modules/monaco-editor/esm/vs/editor/common/core/position"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/common/view/viewContext": {
      "type": "js",
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/common/view/viewEventDispatcher": {
      "type": "js",
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/common/viewLayout/viewLinesViewportData": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/editor/common/core/range"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/browser/view/viewImpl": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/browser/dom",
        "node_modules/monaco-editor/esm/vs/base/browser/fastDomNode",
        "node_modules/monaco-editor/esm/vs/base/common/errors",
        "node_modules/monaco-editor/esm/vs/editor/browser/controller/pointerHandler",
        "node_modules/monaco-editor/esm/vs/editor/browser/controller/textAreaHandler",
        "node_modules/monaco-editor/esm/vs/editor/browser/view/viewController",
        "node_modules/monaco-editor/esm/vs/editor/browser/view/viewOverlays",
        "node_modules/monaco-editor/esm/vs/editor/browser/view/viewPart",
        "node_modules/monaco-editor/esm/vs/editor/browser/viewParts/contentWidgets/contentWidgets",
        "node_modules/monaco-editor/esm/vs/editor/browser/viewParts/currentLineHighlight/currentLineHighlight",
        "node_modules/monaco-editor/esm/vs/editor/browser/viewParts/currentLineMarginHighlight/currentLineMarginHighlight",
        "node_modules/monaco-editor/esm/vs/editor/browser/viewParts/decorations/decorations",
        "node_modules/monaco-editor/esm/vs/editor/browser/viewParts/editorScrollbar/editorScrollbar",
        "node_modules/monaco-editor/esm/vs/editor/browser/viewParts/glyphMargin/glyphMargin",
        "node_modules/monaco-editor/esm/vs/editor/browser/viewParts/indentGuides/indentGuides",
        "node_modules/monaco-editor/esm/vs/editor/browser/viewParts/lineNumbers/lineNumbers",
        "node_modules/monaco-editor/esm/vs/editor/browser/viewParts/lines/viewLines",
        "node_modules/monaco-editor/esm/vs/editor/browser/viewParts/linesDecorations/linesDecorations",
        "node_modules/monaco-editor/esm/vs/editor/browser/viewParts/margin/margin",
        "node_modules/monaco-editor/esm/vs/editor/browser/viewParts/marginDecorations/marginDecorations",
        "node_modules/monaco-editor/esm/vs/editor/browser/viewParts/minimap/minimap",
        "node_modules/monaco-editor/esm/vs/editor/browser/viewParts/overlayWidgets/overlayWidgets",
        "node_modules/monaco-editor/esm/vs/editor/browser/viewParts/overviewRuler/decorationsOverviewRuler",
        "node_modules/monaco-editor/esm/vs/editor/browser/viewParts/overviewRuler/overviewRuler",
        "node_modules/monaco-editor/esm/vs/editor/browser/viewParts/rulers/rulers",
        "node_modules/monaco-editor/esm/vs/editor/browser/viewParts/scrollDecoration/scrollDecoration",
        "node_modules/monaco-editor/esm/vs/editor/browser/viewParts/selections/selections",
        "node_modules/monaco-editor/esm/vs/editor/browser/viewParts/viewCursors/viewCursors",
        "node_modules/monaco-editor/esm/vs/editor/browser/viewParts/viewZones/viewZones",
        "node_modules/monaco-editor/esm/vs/editor/common/core/position",
        "node_modules/monaco-editor/esm/vs/editor/common/view/renderingContext",
        "node_modules/monaco-editor/esm/vs/editor/common/view/viewContext",
        "node_modules/monaco-editor/esm/vs/editor/common/view/viewEventDispatcher",
        "node_modules/monaco-editor/esm/vs/editor/common/view/viewEvents",
        "node_modules/monaco-editor/esm/vs/editor/common/viewLayout/viewLinesViewportData",
        "node_modules/monaco-editor/esm/vs/editor/common/viewModel/viewEventHandler",
        "node_modules/monaco-editor/esm/vs/platform/theme/common/themeService"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/browser/view/viewOutgoingEvents": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/lifecycle",
        "node_modules/monaco-editor/esm/vs/editor/browser/controller/mouseTarget"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/common/controller/oneCursor": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/editor/common/controller/cursorCommon",
        "node_modules/monaco-editor/esm/vs/editor/common/core/position",
        "node_modules/monaco-editor/esm/vs/editor/common/core/range",
        "node_modules/monaco-editor/esm/vs/editor/common/core/selection"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/common/controller/cursorCollection": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/editor/common/controller/cursorCommon",
        "node_modules/monaco-editor/esm/vs/editor/common/controller/oneCursor",
        "node_modules/monaco-editor/esm/vs/editor/common/core/selection"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/common/controller/cursor": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/errors",
        "node_modules/monaco-editor/esm/vs/base/common/event",
        "node_modules/monaco-editor/esm/vs/base/common/strings",
        "node_modules/monaco-editor/esm/vs/editor/common/controller/cursorCollection",
        "node_modules/monaco-editor/esm/vs/editor/common/controller/cursorCommon",
        "node_modules/monaco-editor/esm/vs/editor/common/controller/cursorDeleteOperations",
        "node_modules/monaco-editor/esm/vs/editor/common/controller/cursorTypeOperations",
        "node_modules/monaco-editor/esm/vs/editor/common/core/range",
        "node_modules/monaco-editor/esm/vs/editor/common/core/selection",
        "node_modules/monaco-editor/esm/vs/editor/common/editorCommon",
        "node_modules/monaco-editor/esm/vs/editor/common/view/viewEvents"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/common/editorAction": {
      "type": "js",
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/common/modes/textToHtmlTokenizer": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/strings",
        "node_modules/monaco-editor/esm/vs/editor/common/core/lineTokens",
        "node_modules/monaco-editor/esm/vs/editor/common/modes/nullMode"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/common/viewLayout/whitespaceComputer": {
      "type": "js",
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/common/viewLayout/linesLayout": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/editor/common/viewLayout/whitespaceComputer"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/common/viewLayout/viewLayout": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/lifecycle",
        "node_modules/monaco-editor/esm/vs/base/common/scrollable",
        "node_modules/monaco-editor/esm/vs/editor/common/viewLayout/linesLayout",
        "node_modules/monaco-editor/esm/vs/editor/common/viewModel/viewModel"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/common/viewModel/splitLinesCollection": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/editor/common/core/position",
        "node_modules/monaco-editor/esm/vs/editor/common/core/range",
        "node_modules/monaco-editor/esm/vs/editor/common/model/textModel",
        "node_modules/monaco-editor/esm/vs/editor/common/view/viewEvents",
        "node_modules/monaco-editor/esm/vs/editor/common/viewModel/prefixSumComputer",
        "node_modules/monaco-editor/esm/vs/editor/common/viewModel/viewModel"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/common/viewModel/characterHardWrappingLineMapper": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/strings",
        "node_modules/monaco-editor/esm/vs/editor/common/core/characterClassifier",
        "node_modules/monaco-editor/esm/vs/editor/common/core/uint",
        "node_modules/monaco-editor/esm/vs/editor/common/viewModel/prefixSumComputer",
        "node_modules/monaco-editor/esm/vs/editor/common/viewModel/splitLinesCollection"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/common/viewModel/viewModelDecorations": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/editor/common/core/position",
        "node_modules/monaco-editor/esm/vs/editor/common/core/range",
        "node_modules/monaco-editor/esm/vs/editor/common/viewModel/viewModel"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/common/viewModel/viewModelImpl": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/color",
        "node_modules/monaco-editor/esm/vs/base/common/strings",
        "node_modules/monaco-editor/esm/vs/editor/common/core/position",
        "node_modules/monaco-editor/esm/vs/editor/common/core/range",
        "node_modules/monaco-editor/esm/vs/editor/common/modes",
        "node_modules/monaco-editor/esm/vs/editor/common/modes/textToHtmlTokenizer",
        "node_modules/monaco-editor/esm/vs/editor/common/view/minimapCharRenderer",
        "node_modules/monaco-editor/esm/vs/editor/common/view/viewEvents",
        "node_modules/monaco-editor/esm/vs/editor/common/viewLayout/viewLayout",
        "node_modules/monaco-editor/esm/vs/editor/common/viewModel/characterHardWrappingLineMapper",
        "node_modules/monaco-editor/esm/vs/editor/common/viewModel/splitLinesCollection",
        "node_modules/monaco-editor/esm/vs/editor/common/viewModel/viewModel",
        "node_modules/monaco-editor/esm/vs/editor/common/viewModel/viewModelDecorations",
        "node_modules/monaco-editor/esm/vs/base/common/async"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/platform/instantiation/common/serviceCollection": {
      "type": "js",
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/platform/accessibility/common/accessibility": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/platform/instantiation/common/instantiation"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/browser/widget/codeEditorWidget": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/nls",
        "node_modules/monaco-editor/esm/vs/base/browser/dom",
        "node_modules/monaco-editor/esm/vs/base/common/errors",
        "node_modules/monaco-editor/esm/vs/base/common/event",
        "node_modules/monaco-editor/esm/vs/base/common/lifecycle",
        "node_modules/monaco-editor/esm/vs/base/common/network",
        "node_modules/monaco-editor/esm/vs/editor/browser/config/configuration",
        "node_modules/monaco-editor/esm/vs/editor/browser/editorExtensions",
        "node_modules/monaco-editor/esm/vs/editor/browser/services/codeEditorService",
        "node_modules/monaco-editor/esm/vs/editor/browser/view/viewImpl",
        "node_modules/monaco-editor/esm/vs/editor/browser/view/viewOutgoingEvents",
        "node_modules/monaco-editor/esm/vs/editor/common/controller/cursor",
        "node_modules/monaco-editor/esm/vs/editor/common/controller/cursorCommon",
        "node_modules/monaco-editor/esm/vs/editor/common/core/position",
        "node_modules/monaco-editor/esm/vs/editor/common/core/range",
        "node_modules/monaco-editor/esm/vs/editor/common/core/selection",
        "node_modules/monaco-editor/esm/vs/editor/common/editorAction",
        "node_modules/monaco-editor/esm/vs/editor/common/editorCommon",
        "node_modules/monaco-editor/esm/vs/editor/common/editorContextKeys",
        "node_modules/monaco-editor/esm/vs/editor/common/modes",
        "node_modules/monaco-editor/esm/vs/editor/common/view/editorColorRegistry",
        "node_modules/monaco-editor/esm/vs/editor/common/viewModel/viewModelImpl",
        "node_modules/monaco-editor/esm/vs/platform/commands/common/commands",
        "node_modules/monaco-editor/esm/vs/platform/contextkey/common/contextkey",
        "node_modules/monaco-editor/esm/vs/platform/instantiation/common/instantiation",
        "node_modules/monaco-editor/esm/vs/platform/instantiation/common/serviceCollection",
        "node_modules/monaco-editor/esm/vs/platform/notification/common/notification",
        "node_modules/monaco-editor/esm/vs/platform/theme/common/themeService",
        "node_modules/monaco-editor/esm/vs/platform/accessibility/common/accessibility",
        "node_modules/monaco-editor/esm/vs/base/common/types"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/base/browser/ui/sash/sash": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/lifecycle",
        "node_modules/monaco-editor/esm/vs/base/browser/browser",
        "node_modules/monaco-editor/esm/vs/base/common/platform",
        "node_modules/monaco-editor/esm/vs/base/common/types",
        "node_modules/monaco-editor/esm/vs/base/browser/touch",
        "node_modules/monaco-editor/esm/vs/base/browser/mouseEvent",
        "node_modules/monaco-editor/esm/vs/base/common/event",
        "node_modules/monaco-editor/esm/vs/base/browser/dom",
        "node_modules/monaco-editor/esm/vs/base/browser/event"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/browser/core/editorState": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/strings",
        "node_modules/monaco-editor/esm/vs/base/common/cancellation",
        "node_modules/monaco-editor/esm/vs/base/common/lifecycle"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/base/browser/ui/actionbar/actionbar": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/platform",
        "node_modules/monaco-editor/esm/vs/nls",
        "node_modules/monaco-editor/esm/vs/base/common/lifecycle",
        "node_modules/monaco-editor/esm/vs/base/common/actions",
        "node_modules/monaco-editor/esm/vs/base/browser/dom",
        "node_modules/monaco-editor/esm/vs/base/common/types",
        "node_modules/monaco-editor/esm/vs/base/browser/touch",
        "node_modules/monaco-editor/esm/vs/base/browser/keyboardEvent",
        "node_modules/monaco-editor/esm/vs/base/common/event",
        "node_modules/monaco-editor/esm/vs/base/common/arrays"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/browser/widget/diffReview": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/nls",
        "node_modules/monaco-editor/esm/vs/base/browser/dom",
        "node_modules/monaco-editor/esm/vs/base/browser/fastDomNode",
        "node_modules/monaco-editor/esm/vs/base/browser/ui/actionbar/actionbar",
        "node_modules/monaco-editor/esm/vs/base/browser/ui/scrollbar/scrollableElement",
        "node_modules/monaco-editor/esm/vs/base/common/actions",
        "node_modules/monaco-editor/esm/vs/base/common/lifecycle",
        "node_modules/monaco-editor/esm/vs/editor/browser/config/configuration",
        "node_modules/monaco-editor/esm/vs/editor/browser/editorExtensions",
        "node_modules/monaco-editor/esm/vs/editor/browser/services/codeEditorService",
        "node_modules/monaco-editor/esm/vs/editor/common/core/lineTokens",
        "node_modules/monaco-editor/esm/vs/editor/common/core/position",
        "node_modules/monaco-editor/esm/vs/editor/common/view/editorColorRegistry",
        "node_modules/monaco-editor/esm/vs/editor/common/viewLayout/viewLineRenderer",
        "node_modules/monaco-editor/esm/vs/editor/common/viewModel/viewModel",
        "node_modules/monaco-editor/esm/vs/platform/contextkey/common/contextkey",
        "node_modules/monaco-editor/esm/vs/platform/theme/common/colorRegistry",
        "node_modules/monaco-editor/esm/vs/platform/theme/common/themeService"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/browser/widget/diffEditorWidget": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/nls",
        "node_modules/monaco-editor/esm/vs/base/browser/dom",
        "node_modules/monaco-editor/esm/vs/base/browser/fastDomNode",
        "node_modules/monaco-editor/esm/vs/base/browser/ui/sash/sash",
        "node_modules/monaco-editor/esm/vs/base/common/async",
        "node_modules/monaco-editor/esm/vs/base/common/event",
        "node_modules/monaco-editor/esm/vs/base/common/lifecycle",
        "node_modules/monaco-editor/esm/vs/base/common/objects",
        "node_modules/monaco-editor/esm/vs/editor/browser/config/configuration",
        "node_modules/monaco-editor/esm/vs/editor/browser/core/editorState",
        "node_modules/monaco-editor/esm/vs/editor/browser/services/codeEditorService",
        "node_modules/monaco-editor/esm/vs/editor/browser/widget/codeEditorWidget",
        "node_modules/monaco-editor/esm/vs/editor/browser/widget/diffReview",
        "node_modules/monaco-editor/esm/vs/editor/common/config/editorOptions",
        "node_modules/monaco-editor/esm/vs/editor/common/core/range",
        "node_modules/monaco-editor/esm/vs/editor/common/core/stringBuilder",
        "node_modules/monaco-editor/esm/vs/editor/common/editorCommon",
        "node_modules/monaco-editor/esm/vs/editor/common/model/textModel",
        "node_modules/monaco-editor/esm/vs/editor/common/services/editorWorkerService",
        "node_modules/monaco-editor/esm/vs/editor/common/view/overviewZoneManager",
        "node_modules/monaco-editor/esm/vs/editor/common/viewLayout/lineDecorations",
        "node_modules/monaco-editor/esm/vs/editor/common/viewLayout/viewLineRenderer",
        "node_modules/monaco-editor/esm/vs/editor/common/viewModel/viewModel",
        "node_modules/monaco-editor/esm/vs/platform/contextkey/common/contextkey",
        "node_modules/monaco-editor/esm/vs/platform/instantiation/common/instantiation",
        "node_modules/monaco-editor/esm/vs/platform/instantiation/common/serviceCollection",
        "node_modules/monaco-editor/esm/vs/platform/notification/common/notification",
        "node_modules/monaco-editor/esm/vs/platform/theme/common/colorRegistry",
        "node_modules/monaco-editor/esm/vs/platform/theme/common/themeService"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/standalone/common/standaloneThemeService": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/platform/instantiation/common/instantiation"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/platform/contextview/browser/contextView": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/platform/instantiation/common/instantiation"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/platform/keybinding/common/keybinding": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/platform/instantiation/common/instantiation"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/standalone/browser/standaloneCodeEditor": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/browser/browser",
        "node_modules/monaco-editor/esm/vs/base/browser/ui/aria/aria",
        "node_modules/monaco-editor/esm/vs/base/common/lifecycle",
        "node_modules/monaco-editor/esm/vs/editor/browser/services/codeEditorService",
        "node_modules/monaco-editor/esm/vs/editor/browser/widget/codeEditorWidget",
        "node_modules/monaco-editor/esm/vs/editor/browser/widget/diffEditorWidget",
        "node_modules/monaco-editor/esm/vs/editor/common/editorAction",
        "node_modules/monaco-editor/esm/vs/editor/common/services/editorWorkerService",
        "node_modules/monaco-editor/esm/vs/editor/standalone/browser/simpleServices",
        "node_modules/monaco-editor/esm/vs/editor/standalone/common/standaloneThemeService",
        "node_modules/monaco-editor/esm/vs/platform/actions/common/actions",
        "node_modules/monaco-editor/esm/vs/platform/commands/common/commands",
        "node_modules/monaco-editor/esm/vs/platform/configuration/common/configuration",
        "node_modules/monaco-editor/esm/vs/platform/contextkey/common/contextkey",
        "node_modules/monaco-editor/esm/vs/platform/contextview/browser/contextView",
        "node_modules/monaco-editor/esm/vs/platform/instantiation/common/instantiation",
        "node_modules/monaco-editor/esm/vs/platform/keybinding/common/keybinding",
        "node_modules/monaco-editor/esm/vs/platform/notification/common/notification",
        "node_modules/monaco-editor/esm/vs/platform/theme/common/themeService",
        "node_modules/monaco-editor/esm/vs/platform/accessibility/common/accessibility",
        "node_modules/monaco-editor/esm/vs/editor/common/standaloneStrings"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/browser/services/bulkEditService": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/platform/instantiation/common/instantiation"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/common/services/modeService": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/platform/instantiation/common/instantiation"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/common/modes/abstractMode": {
      "type": "js",
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/base/common/mime": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/path",
        "node_modules/monaco-editor/esm/vs/base/common/strings",
        "node_modules/monaco-editor/esm/vs/base/common/glob"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/common/modes/modesRegistry": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/nls",
        "node_modules/monaco-editor/esm/vs/base/common/event",
        "node_modules/monaco-editor/esm/vs/editor/common/modes",
        "node_modules/monaco-editor/esm/vs/editor/common/modes/languageConfigurationRegistry",
        "node_modules/monaco-editor/esm/vs/platform/registry/common/platform"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/common/services/languagesRegistry": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/errors",
        "node_modules/monaco-editor/esm/vs/base/common/event",
        "node_modules/monaco-editor/esm/vs/base/common/lifecycle",
        "node_modules/monaco-editor/esm/vs/base/common/mime",
        "node_modules/monaco-editor/esm/vs/base/common/strings",
        "node_modules/monaco-editor/esm/vs/editor/common/modes",
        "node_modules/monaco-editor/esm/vs/editor/common/modes/modesRegistry",
        "node_modules/monaco-editor/esm/vs/editor/common/modes/nullMode",
        "node_modules/monaco-editor/esm/vs/platform/configuration/common/configurationRegistry",
        "node_modules/monaco-editor/esm/vs/platform/registry/common/platform"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/common/services/modeServiceImpl": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/event",
        "node_modules/monaco-editor/esm/vs/base/common/lifecycle",
        "node_modules/monaco-editor/esm/vs/editor/common/modes/abstractMode",
        "node_modules/monaco-editor/esm/vs/editor/common/modes/nullMode",
        "node_modules/monaco-editor/esm/vs/editor/common/services/languagesRegistry"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/common/services/modelServiceImpl": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/event",
        "node_modules/monaco-editor/esm/vs/base/common/lifecycle",
        "node_modules/monaco-editor/esm/vs/base/common/platform",
        "node_modules/monaco-editor/esm/vs/editor/common/config/editorOptions",
        "node_modules/monaco-editor/esm/vs/editor/common/model/textModel",
        "node_modules/monaco-editor/esm/vs/editor/common/modes/modesRegistry",
        "node_modules/monaco-editor/esm/vs/editor/common/services/resourceConfiguration",
        "node_modules/monaco-editor/esm/vs/platform/configuration/common/configuration"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/browser/services/abstractCodeEditorService": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/event",
        "node_modules/monaco-editor/esm/vs/base/common/lifecycle"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/browser/services/codeEditorServiceImpl": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/browser/dom",
        "node_modules/monaco-editor/esm/vs/base/common/lifecycle",
        "node_modules/monaco-editor/esm/vs/base/common/strings",
        "node_modules/monaco-editor/esm/vs/base/common/uri",
        "node_modules/monaco-editor/esm/vs/editor/browser/services/abstractCodeEditorService",
        "node_modules/monaco-editor/esm/vs/editor/common/editorCommon",
        "node_modules/monaco-editor/esm/vs/editor/common/model",
        "node_modules/monaco-editor/esm/vs/platform/theme/common/themeService"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/standalone/browser/standaloneCodeServiceImpl": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/browser/dom",
        "node_modules/monaco-editor/esm/vs/base/common/network",
        "node_modules/monaco-editor/esm/vs/editor/browser/services/codeEditorServiceImpl"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/common/modes/supports/tokenization": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/color"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/standalone/common/themes": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/editor/common/view/editorColorRegistry",
        "node_modules/monaco-editor/esm/vs/platform/theme/common/colorRegistry"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/standalone/browser/standaloneThemeServiceImpl": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/browser/dom",
        "node_modules/monaco-editor/esm/vs/base/common/color",
        "node_modules/monaco-editor/esm/vs/base/common/event",
        "node_modules/monaco-editor/esm/vs/editor/common/modes",
        "node_modules/monaco-editor/esm/vs/editor/common/modes/supports/tokenization",
        "node_modules/monaco-editor/esm/vs/editor/standalone/common/themes",
        "node_modules/monaco-editor/esm/vs/platform/registry/common/platform",
        "node_modules/monaco-editor/esm/vs/platform/theme/common/colorRegistry",
        "node_modules/monaco-editor/esm/vs/platform/theme/common/themeService"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/platform/contextkey/browser/contextKeyService": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/event",
        "node_modules/monaco-editor/esm/vs/base/common/lifecycle",
        "node_modules/monaco-editor/esm/vs/base/common/map",
        "node_modules/monaco-editor/esm/vs/platform/commands/common/commands",
        "node_modules/monaco-editor/esm/vs/platform/configuration/common/configuration",
        "node_modules/monaco-editor/esm/vs/platform/contextkey/common/contextkey",
        "node_modules/monaco-editor/esm/vs/platform/keybinding/common/keybindingResolver"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/base/browser/ui/menu/menu": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/nls",
        "node_modules/monaco-editor/esm/vs/base/common/strings",
        "node_modules/monaco-editor/esm/vs/base/common/actions",
        "node_modules/monaco-editor/esm/vs/base/browser/ui/actionbar/actionbar",
        "node_modules/monaco-editor/esm/vs/base/browser/dom",
        "node_modules/monaco-editor/esm/vs/base/browser/keyboardEvent",
        "node_modules/monaco-editor/esm/vs/base/common/async",
        "node_modules/monaco-editor/esm/vs/base/common/lifecycle",
        "node_modules/monaco-editor/esm/vs/base/browser/ui/scrollbar/scrollableElement",
        "node_modules/monaco-editor/esm/vs/base/common/event",
        "node_modules/monaco-editor/esm/vs/base/common/platform"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/platform/theme/common/styler": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/platform/theme/common/colorRegistry",
        "node_modules/monaco-editor/esm/vs/base/common/objects"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/platform/contextview/browser/contextMenuHandler": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/lifecycle",
        "node_modules/monaco-editor/esm/vs/base/common/actions",
        "node_modules/monaco-editor/esm/vs/base/browser/ui/menu/menu",
        "node_modules/monaco-editor/esm/vs/base/browser/dom",
        "node_modules/monaco-editor/esm/vs/platform/theme/common/styler",
        "node_modules/monaco-editor/esm/vs/base/browser/event",
        "node_modules/monaco-editor/esm/vs/base/browser/mouseEvent"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/platform/contextview/browser/contextMenuService": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/platform/contextview/browser/contextMenuHandler",
        "node_modules/monaco-editor/esm/vs/platform/contextview/browser/contextView",
        "node_modules/monaco-editor/esm/vs/platform/telemetry/common/telemetry",
        "node_modules/monaco-editor/esm/vs/base/common/event",
        "node_modules/monaco-editor/esm/vs/platform/notification/common/notification",
        "node_modules/monaco-editor/esm/vs/platform/theme/common/themeService",
        "node_modules/monaco-editor/esm/vs/platform/keybinding/common/keybinding",
        "node_modules/monaco-editor/esm/vs/base/common/lifecycle"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/base/common/range": {
      "type": "js",
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/base/browser/ui/contextview/contextview": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/browser/dom",
        "node_modules/monaco-editor/esm/vs/base/common/lifecycle",
        "node_modules/monaco-editor/esm/vs/base/common/range"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/platform/layout/browser/layoutService": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/platform/instantiation/common/instantiation"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/platform/contextview/browser/contextViewService": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/browser/ui/contextview/contextview",
        "node_modules/monaco-editor/esm/vs/base/common/lifecycle",
        "node_modules/monaco-editor/esm/vs/platform/layout/browser/layoutService"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/platform/dialogs/common/dialogs": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/platform/instantiation/common/instantiation"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/base/common/collections": {
      "type": "js",
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/platform/instantiation/common/graph": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/types",
        "node_modules/monaco-editor/esm/vs/base/common/collections"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/platform/instantiation/common/descriptors": {
      "type": "js",
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/platform/instantiation/common/instantiationService": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/errors",
        "node_modules/monaco-editor/esm/vs/platform/instantiation/common/graph",
        "node_modules/monaco-editor/esm/vs/platform/instantiation/common/descriptors",
        "node_modules/monaco-editor/esm/vs/platform/instantiation/common/instantiation",
        "node_modules/monaco-editor/esm/vs/platform/instantiation/common/serviceCollection",
        "node_modules/monaco-editor/esm/vs/base/common/async"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/platform/label/common/label": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/platform/instantiation/common/instantiation"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/base/browser/ui/list/list": {
      "type": "js",
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/base/browser/ui/list/rangeMap": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/range"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/base/browser/ui/list/rowCache": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/browser/dom"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/base/browser/dnd": {
      "type": "js",
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/base/browser/ui/list/listView": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/objects",
        "node_modules/monaco-editor/esm/vs/base/common/lifecycle",
        "node_modules/monaco-editor/esm/vs/base/browser/touch",
        "node_modules/monaco-editor/esm/vs/base/browser/dom",
        "node_modules/monaco-editor/esm/vs/base/common/event",
        "node_modules/monaco-editor/esm/vs/base/browser/event",
        "node_modules/monaco-editor/esm/vs/base/browser/ui/scrollbar/scrollableElement",
        "node_modules/monaco-editor/esm/vs/base/browser/ui/list/rangeMap",
        "node_modules/monaco-editor/esm/vs/base/browser/ui/list/rowCache",
        "node_modules/monaco-editor/esm/vs/base/common/platform",
        "node_modules/monaco-editor/esm/vs/base/browser/browser",
        "node_modules/monaco-editor/esm/vs/base/common/decorators",
        "node_modules/monaco-editor/esm/vs/base/common/range",
        "node_modules/monaco-editor/esm/vs/base/common/arrays",
        "node_modules/monaco-editor/esm/vs/base/browser/dnd",
        "node_modules/monaco-editor/esm/vs/base/common/async"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/base/browser/ui/list/splice": {
      "type": "js",
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/base/common/numbers": {
      "type": "js",
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/base/common/filters": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/map",
        "node_modules/monaco-editor/esm/vs/base/common/strings"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/base/browser/ui/list/listWidget": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/nls",
        "node_modules/monaco-editor/esm/vs/base/common/lifecycle",
        "node_modules/monaco-editor/esm/vs/base/common/types",
        "node_modules/monaco-editor/esm/vs/base/common/arrays",
        "node_modules/monaco-editor/esm/vs/base/common/decorators",
        "node_modules/monaco-editor/esm/vs/base/browser/dom",
        "node_modules/monaco-editor/esm/vs/base/common/platform",
        "node_modules/monaco-editor/esm/vs/base/browser/touch",
        "node_modules/monaco-editor/esm/vs/base/browser/keyboardEvent",
        "node_modules/monaco-editor/esm/vs/base/common/event",
        "node_modules/monaco-editor/esm/vs/base/browser/event",
        "node_modules/monaco-editor/esm/vs/base/browser/ui/list/list",
        "node_modules/monaco-editor/esm/vs/base/browser/ui/list/listView",
        "node_modules/monaco-editor/esm/vs/base/common/color",
        "node_modules/monaco-editor/esm/vs/base/common/objects",
        "node_modules/monaco-editor/esm/vs/base/browser/ui/list/splice",
        "node_modules/monaco-editor/esm/vs/base/common/numbers",
        "node_modules/monaco-editor/esm/vs/base/common/filters"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/base/browser/ui/tree/indexTreeModel": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/arrays",
        "node_modules/monaco-editor/esm/vs/base/common/event",
        "node_modules/monaco-editor/esm/vs/base/common/iterator"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/base/browser/ui/tree/abstractTree": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/lifecycle",
        "node_modules/monaco-editor/esm/vs/base/browser/ui/list/listWidget",
        "node_modules/monaco-editor/esm/vs/base/browser/dom",
        "node_modules/monaco-editor/esm/vs/base/common/event",
        "node_modules/monaco-editor/esm/vs/base/browser/keyboardEvent",
        "node_modules/monaco-editor/esm/vs/base/browser/dnd",
        "node_modules/monaco-editor/esm/vs/base/common/arrays",
        "node_modules/monaco-editor/esm/vs/base/browser/ui/list/listView",
        "node_modules/monaco-editor/esm/vs/base/browser/event",
        "node_modules/monaco-editor/esm/vs/base/common/filters",
        "node_modules/monaco-editor/esm/vs/base/browser/ui/tree/indexTreeModel",
        "node_modules/monaco-editor/esm/vs/nls",
        "node_modules/monaco-editor/esm/vs/base/common/async",
        "node_modules/monaco-editor/esm/vs/base/common/platform",
        "node_modules/monaco-editor/esm/vs/base/common/map",
        "node_modules/monaco-editor/esm/vs/base/common/numbers"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/base/browser/ui/tree/objectTreeModel": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/iterator",
        "node_modules/monaco-editor/esm/vs/base/browser/ui/tree/indexTreeModel"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/base/browser/ui/tree/objectTree": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/browser/ui/tree/abstractTree",
        "node_modules/monaco-editor/esm/vs/base/browser/ui/tree/objectTreeModel"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/base/browser/ui/tree/asyncDataTree": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/browser/ui/tree/abstractTree",
        "node_modules/monaco-editor/esm/vs/base/browser/ui/tree/objectTree",
        "node_modules/monaco-editor/esm/vs/base/common/lifecycle",
        "node_modules/monaco-editor/esm/vs/base/common/event",
        "node_modules/monaco-editor/esm/vs/base/common/async",
        "node_modules/monaco-editor/esm/vs/base/common/iterator",
        "node_modules/monaco-editor/esm/vs/base/browser/ui/list/listView",
        "node_modules/monaco-editor/esm/vs/base/common/errors",
        "node_modules/monaco-editor/esm/vs/base/browser/dom",
        "node_modules/monaco-editor/esm/vs/base/common/map"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/base/browser/ui/tree/dataTree": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/browser/ui/tree/abstractTree",
        "node_modules/monaco-editor/esm/vs/base/browser/ui/tree/objectTreeModel"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/platform/list/browser/listService": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/browser/dom",
        "node_modules/monaco-editor/esm/vs/base/browser/ui/list/listWidget",
        "node_modules/monaco-editor/esm/vs/base/common/lifecycle",
        "node_modules/monaco-editor/esm/vs/nls",
        "node_modules/monaco-editor/esm/vs/platform/configuration/common/configuration",
        "node_modules/monaco-editor/esm/vs/platform/configuration/common/configurationRegistry",
        "node_modules/monaco-editor/esm/vs/platform/contextkey/common/contextkey",
        "node_modules/monaco-editor/esm/vs/platform/instantiation/common/instantiation",
        "node_modules/monaco-editor/esm/vs/platform/keybinding/common/keybinding",
        "node_modules/monaco-editor/esm/vs/platform/registry/common/platform",
        "node_modules/monaco-editor/esm/vs/platform/theme/common/styler",
        "node_modules/monaco-editor/esm/vs/platform/theme/common/themeService",
        "node_modules/monaco-editor/esm/vs/base/browser/ui/tree/objectTree",
        "node_modules/monaco-editor/esm/vs/base/browser/ui/tree/asyncDataTree",
        "node_modules/monaco-editor/esm/vs/base/browser/ui/tree/dataTree",
        "node_modules/monaco-editor/esm/vs/platform/accessibility/common/accessibility"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/platform/markers/common/markers": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/platform/instantiation/common/instantiation",
        "node_modules/monaco-editor/esm/vs/nls",
        "node_modules/monaco-editor/esm/vs/base/common/severity"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/platform/markers/common/markerService": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/arrays",
        "node_modules/monaco-editor/esm/vs/base/common/network",
        "node_modules/monaco-editor/esm/vs/base/common/types",
        "node_modules/monaco-editor/esm/vs/base/common/event",
        "node_modules/monaco-editor/esm/vs/platform/markers/common/markers"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/platform/progress/common/progress": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/platform/instantiation/common/instantiation"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/platform/storage/common/storage": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/platform/instantiation/common/instantiation",
        "node_modules/monaco-editor/esm/vs/base/common/event",
        "node_modules/monaco-editor/esm/vs/base/common/lifecycle",
        "node_modules/monaco-editor/esm/vs/base/common/types"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/platform/actions/common/menuService": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/event",
        "node_modules/monaco-editor/esm/vs/base/common/lifecycle",
        "node_modules/monaco-editor/esm/vs/platform/actions/common/actions",
        "node_modules/monaco-editor/esm/vs/platform/commands/common/commands",
        "node_modules/monaco-editor/esm/vs/platform/contextkey/common/contextkey"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/common/services/markersDecorationService": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/platform/instantiation/common/instantiation"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/common/services/markerDecorationsServiceImpl": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/platform/markers/common/markers",
        "node_modules/monaco-editor/esm/vs/base/common/lifecycle",
        "node_modules/monaco-editor/esm/vs/editor/common/model",
        "node_modules/monaco-editor/esm/vs/platform/theme/common/themeService",
        "node_modules/monaco-editor/esm/vs/editor/common/view/editorColorRegistry",
        "node_modules/monaco-editor/esm/vs/editor/common/services/modelService",
        "node_modules/monaco-editor/esm/vs/editor/common/core/range",
        "node_modules/monaco-editor/esm/vs/base/common/map",
        "node_modules/monaco-editor/esm/vs/base/common/network",
        "node_modules/monaco-editor/esm/vs/base/common/event",
        "node_modules/monaco-editor/esm/vs/base/common/types"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/platform/instantiation/common/extensions": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/platform/instantiation/common/descriptors"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/contrib/suggest/suggestMemory": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/map",
        "node_modules/monaco-editor/esm/vs/platform/storage/common/storage",
        "node_modules/monaco-editor/esm/vs/editor/common/modes",
        "node_modules/monaco-editor/esm/vs/base/common/lifecycle",
        "node_modules/monaco-editor/esm/vs/base/common/async",
        "node_modules/monaco-editor/esm/vs/platform/instantiation/common/instantiation",
        "node_modules/monaco-editor/esm/vs/platform/configuration/common/configuration",
        "node_modules/monaco-editor/esm/vs/platform/instantiation/common/extensions"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/platform/accessibility/common/accessibilityService": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/event",
        "node_modules/monaco-editor/esm/vs/base/common/lifecycle"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/contrib/codelens/codeLensCache": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/platform/instantiation/common/instantiation",
        "node_modules/monaco-editor/esm/vs/platform/instantiation/common/extensions",
        "node_modules/monaco-editor/esm/vs/base/common/map",
        "node_modules/monaco-editor/esm/vs/platform/storage/common/storage",
        "node_modules/monaco-editor/esm/vs/editor/common/core/range"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/standalone/browser/standaloneServices": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/lifecycle",
        "node_modules/monaco-editor/esm/vs/editor/browser/services/bulkEditService",
        "node_modules/monaco-editor/esm/vs/editor/browser/services/codeEditorService",
        "node_modules/monaco-editor/esm/vs/editor/common/services/editorWorkerService",
        "node_modules/monaco-editor/esm/vs/editor/common/services/editorWorkerServiceImpl",
        "node_modules/monaco-editor/esm/vs/editor/common/services/modeService",
        "node_modules/monaco-editor/esm/vs/editor/common/services/modeServiceImpl",
        "node_modules/monaco-editor/esm/vs/editor/common/services/modelService",
        "node_modules/monaco-editor/esm/vs/editor/common/services/modelServiceImpl",
        "node_modules/monaco-editor/esm/vs/editor/common/services/resourceConfiguration",
        "node_modules/monaco-editor/esm/vs/editor/standalone/browser/simpleServices",
        "node_modules/monaco-editor/esm/vs/editor/standalone/browser/standaloneCodeServiceImpl",
        "node_modules/monaco-editor/esm/vs/editor/standalone/browser/standaloneThemeServiceImpl",
        "node_modules/monaco-editor/esm/vs/editor/standalone/common/standaloneThemeService",
        "node_modules/monaco-editor/esm/vs/platform/actions/common/actions",
        "node_modules/monaco-editor/esm/vs/platform/commands/common/commands",
        "node_modules/monaco-editor/esm/vs/platform/configuration/common/configuration",
        "node_modules/monaco-editor/esm/vs/platform/contextkey/browser/contextKeyService",
        "node_modules/monaco-editor/esm/vs/platform/contextkey/common/contextkey",
        "node_modules/monaco-editor/esm/vs/platform/contextview/browser/contextMenuService",
        "node_modules/monaco-editor/esm/vs/platform/contextview/browser/contextView",
        "node_modules/monaco-editor/esm/vs/platform/contextview/browser/contextViewService",
        "node_modules/monaco-editor/esm/vs/platform/dialogs/common/dialogs",
        "node_modules/monaco-editor/esm/vs/platform/instantiation/common/instantiation",
        "node_modules/monaco-editor/esm/vs/platform/instantiation/common/instantiationService",
        "node_modules/monaco-editor/esm/vs/platform/instantiation/common/serviceCollection",
        "node_modules/monaco-editor/esm/vs/platform/keybinding/common/keybinding",
        "node_modules/monaco-editor/esm/vs/platform/label/common/label",
        "node_modules/monaco-editor/esm/vs/platform/list/browser/listService",
        "node_modules/monaco-editor/esm/vs/platform/log/common/log",
        "node_modules/monaco-editor/esm/vs/platform/markers/common/markerService",
        "node_modules/monaco-editor/esm/vs/platform/markers/common/markers",
        "node_modules/monaco-editor/esm/vs/platform/notification/common/notification",
        "node_modules/monaco-editor/esm/vs/platform/progress/common/progress",
        "node_modules/monaco-editor/esm/vs/platform/storage/common/storage",
        "node_modules/monaco-editor/esm/vs/platform/telemetry/common/telemetry",
        "node_modules/monaco-editor/esm/vs/platform/theme/common/themeService",
        "node_modules/monaco-editor/esm/vs/platform/workspace/common/workspace",
        "node_modules/monaco-editor/esm/vs/platform/actions/common/menuService",
        "node_modules/monaco-editor/esm/vs/editor/common/services/markersDecorationService",
        "node_modules/monaco-editor/esm/vs/editor/common/services/markerDecorationsServiceImpl",
        "node_modules/monaco-editor/esm/vs/editor/contrib/suggest/suggestMemory",
        "node_modules/monaco-editor/esm/vs/platform/accessibility/common/accessibility",
        "node_modules/monaco-editor/esm/vs/platform/accessibility/common/accessibilityService",
        "node_modules/monaco-editor/esm/vs/platform/layout/browser/layoutService",
        "node_modules/monaco-editor/esm/vs/editor/contrib/codelens/codeLensCache"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/platform/opener/common/opener": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/platform/instantiation/common/instantiation"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/standalone/browser/standaloneEditor": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/editor/browser/services/codeEditorService",
        "node_modules/monaco-editor/esm/vs/editor/browser/services/openerService",
        "node_modules/monaco-editor/esm/vs/editor/browser/widget/diffNavigator",
        "node_modules/monaco-editor/esm/vs/editor/common/config/editorOptions",
        "node_modules/monaco-editor/esm/vs/editor/common/config/fontInfo",
        "node_modules/monaco-editor/esm/vs/editor/common/editorCommon",
        "node_modules/monaco-editor/esm/vs/editor/common/model",
        "node_modules/monaco-editor/esm/vs/editor/common/modes",
        "node_modules/monaco-editor/esm/vs/editor/common/modes/nullMode",
        "node_modules/monaco-editor/esm/vs/editor/common/services/editorWorkerService",
        "node_modules/monaco-editor/esm/vs/editor/common/services/resolverService",
        "node_modules/monaco-editor/esm/vs/editor/common/services/webWorker",
        "node_modules/monaco-editor/esm/vs/editor/common/standalone/standaloneEnums",
        "node_modules/monaco-editor/esm/vs/editor/standalone/browser/colorizer",
        "node_modules/monaco-editor/esm/vs/editor/standalone/browser/simpleServices",
        "node_modules/monaco-editor/esm/vs/editor/standalone/browser/standaloneCodeEditor",
        "node_modules/monaco-editor/esm/vs/editor/standalone/browser/standaloneServices",
        "node_modules/monaco-editor/esm/vs/editor/standalone/common/standaloneThemeService",
        "node_modules/monaco-editor/esm/vs/platform/commands/common/commands",
        "node_modules/monaco-editor/esm/vs/platform/configuration/common/configuration",
        "node_modules/monaco-editor/esm/vs/platform/contextkey/common/contextkey",
        "node_modules/monaco-editor/esm/vs/platform/contextview/browser/contextView",
        "node_modules/monaco-editor/esm/vs/platform/instantiation/common/instantiation",
        "node_modules/monaco-editor/esm/vs/platform/keybinding/common/keybinding",
        "node_modules/monaco-editor/esm/vs/platform/notification/common/notification",
        "node_modules/monaco-editor/esm/vs/platform/opener/common/opener",
        "node_modules/monaco-editor/esm/vs/platform/accessibility/common/accessibility",
        "node_modules/monaco-editor/esm/vs/editor/browser/config/configuration"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/standalone/common/monarch/monarchCompile": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/editor/standalone/common/monarch/monarchCommon"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/standalone/browser/standaloneLanguages": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/editor/common/core/range",
        "node_modules/monaco-editor/esm/vs/editor/common/core/token",
        "node_modules/monaco-editor/esm/vs/editor/common/modes",
        "node_modules/monaco-editor/esm/vs/editor/common/modes/languageConfigurationRegistry",
        "node_modules/monaco-editor/esm/vs/editor/common/modes/modesRegistry",
        "node_modules/monaco-editor/esm/vs/editor/common/standalone/standaloneEnums",
        "node_modules/monaco-editor/esm/vs/editor/standalone/browser/standaloneServices",
        "node_modules/monaco-editor/esm/vs/editor/standalone/common/monarch/monarchCompile",
        "node_modules/monaco-editor/esm/vs/editor/standalone/common/monarch/monarchLexer"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/editor.api": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/editor/common/config/editorOptions",
        "node_modules/monaco-editor/esm/vs/editor/common/standalone/standaloneBase",
        "node_modules/monaco-editor/esm/vs/editor/standalone/browser/standaloneEditor",
        "node_modules/monaco-editor/esm/vs/editor/standalone/browser/standaloneLanguages"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/language/typescript/workerManager": {
      "type": "js",
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/language/typescript/languageFeatures": {
      "type": "js",
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/language/typescript/tsMode": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/language/typescript/workerManager",
        "node_modules/monaco-editor/esm/vs/language/typescript/languageFeatures"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/language/typescript/monaco.contribution": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/editor/editor.api",
        "node_modules/monaco-editor/esm/vs/language/typescript/tsMode"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/language/css/workerManager": {
      "type": "js",
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/language/css/_deps/vscode-languageserver-types/main": {
      "type": "js",
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/language/css/languageFeatures": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/language/css/_deps/vscode-languageserver-types/main"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/language/css/cssMode": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/language/css/workerManager",
        "node_modules/monaco-editor/esm/vs/language/css/languageFeatures"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/language/css/monaco.contribution": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/editor/editor.api",
        "node_modules/monaco-editor/esm/vs/language/css/cssMode"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/language/json/workerManager": {
      "type": "js",
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/language/json/_deps/vscode-languageserver-types/main": {
      "type": "js",
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/language/json/languageFeatures": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/language/json/_deps/vscode-languageserver-types/main"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/language/json/_deps/jsonc-parser/impl/scanner": {
      "type": "js",
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/language/json/_deps/jsonc-parser/impl/format": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/language/json/_deps/jsonc-parser/impl/scanner"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/language/json/_deps/jsonc-parser/impl/parser": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/language/json/_deps/jsonc-parser/impl/scanner"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/language/json/_deps/jsonc-parser/impl/edit": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/language/json/_deps/jsonc-parser/impl/format",
        "node_modules/monaco-editor/esm/vs/language/json/_deps/jsonc-parser/impl/parser"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/language/json/_deps/jsonc-parser/main": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/language/json/_deps/jsonc-parser/impl/format",
        "node_modules/monaco-editor/esm/vs/language/json/_deps/jsonc-parser/impl/edit",
        "node_modules/monaco-editor/esm/vs/language/json/_deps/jsonc-parser/impl/scanner",
        "node_modules/monaco-editor/esm/vs/language/json/_deps/jsonc-parser/impl/parser"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/language/json/tokenization": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/language/json/_deps/jsonc-parser/main"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/language/json/jsonMode": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/language/json/workerManager",
        "node_modules/monaco-editor/esm/vs/language/json/languageFeatures",
        "node_modules/monaco-editor/esm/vs/language/json/tokenization"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/language/json/monaco.contribution": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/editor/editor.api",
        "node_modules/monaco-editor/esm/vs/language/json/jsonMode"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/language/html/workerManager": {
      "type": "js",
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/language/html/_deps/vscode-languageserver-types/main": {
      "type": "js",
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/language/html/languageFeatures": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/language/html/_deps/vscode-languageserver-types/main"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/language/html/htmlMode": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/language/html/workerManager",
        "node_modules/monaco-editor/esm/vs/language/html/languageFeatures"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/language/html/monaco.contribution": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/editor/editor.api",
        "node_modules/monaco-editor/esm/vs/language/html/htmlMode"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/basic-languages/_.contribution": {
      "type": "js",
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/basic-languages/bat/bat": {
      "type": "js",
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/basic-languages/bat/bat.contribution": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/basic-languages/_.contribution",
        "node_modules/monaco-editor/esm/vs/basic-languages/bat/bat"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/basic-languages/coffee/coffee": {
      "type": "js",
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/basic-languages/coffee/coffee.contribution": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/basic-languages/_.contribution",
        "node_modules/monaco-editor/esm/vs/basic-languages/coffee/coffee"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/basic-languages/cpp/cpp": {
      "type": "js",
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/basic-languages/cpp/cpp.contribution": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/basic-languages/_.contribution",
        "node_modules/monaco-editor/esm/vs/basic-languages/cpp/cpp"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/basic-languages/csharp/csharp": {
      "type": "js",
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/basic-languages/csharp/csharp.contribution": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/basic-languages/_.contribution",
        "node_modules/monaco-editor/esm/vs/basic-languages/csharp/csharp"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/basic-languages/csp/csp": {
      "type": "js",
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/basic-languages/csp/csp.contribution": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/basic-languages/_.contribution",
        "node_modules/monaco-editor/esm/vs/basic-languages/csp/csp"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/basic-languages/css/css": {
      "type": "js",
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/basic-languages/css/css.contribution": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/basic-languages/_.contribution",
        "node_modules/monaco-editor/esm/vs/basic-languages/css/css"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/basic-languages/dockerfile/dockerfile": {
      "type": "js",
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/basic-languages/dockerfile/dockerfile.contribution": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/basic-languages/_.contribution",
        "node_modules/monaco-editor/esm/vs/basic-languages/dockerfile/dockerfile"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/basic-languages/fsharp/fsharp": {
      "type": "js",
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/basic-languages/fsharp/fsharp.contribution": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/basic-languages/_.contribution",
        "node_modules/monaco-editor/esm/vs/basic-languages/fsharp/fsharp"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/basic-languages/go/go": {
      "type": "js",
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/basic-languages/go/go.contribution": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/basic-languages/_.contribution",
        "node_modules/monaco-editor/esm/vs/basic-languages/go/go"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/basic-languages/handlebars/handlebars": {
      "type": "js",
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/basic-languages/handlebars/handlebars.contribution": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/basic-languages/_.contribution",
        "node_modules/monaco-editor/esm/vs/basic-languages/handlebars/handlebars"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/basic-languages/html/html": {
      "type": "js",
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/basic-languages/html/html.contribution": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/basic-languages/_.contribution",
        "node_modules/monaco-editor/esm/vs/basic-languages/html/html"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/basic-languages/ini/ini": {
      "type": "js",
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/basic-languages/ini/ini.contribution": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/basic-languages/_.contribution",
        "node_modules/monaco-editor/esm/vs/basic-languages/ini/ini"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/basic-languages/java/java": {
      "type": "js",
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/basic-languages/java/java.contribution": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/basic-languages/_.contribution",
        "node_modules/monaco-editor/esm/vs/basic-languages/java/java"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/basic-languages/typescript/typescript": {
      "type": "js",
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/basic-languages/javascript/javascript": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/basic-languages/typescript/typescript"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/basic-languages/javascript/javascript.contribution": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/basic-languages/_.contribution",
        "node_modules/monaco-editor/esm/vs/basic-languages/javascript/javascript"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/basic-languages/kotlin/kotlin": {
      "type": "js",
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/basic-languages/kotlin/kotlin.contribution": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/basic-languages/_.contribution",
        "node_modules/monaco-editor/esm/vs/basic-languages/kotlin/kotlin"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/basic-languages/less/less": {
      "type": "js",
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/basic-languages/less/less.contribution": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/basic-languages/_.contribution",
        "node_modules/monaco-editor/esm/vs/basic-languages/less/less"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/basic-languages/lua/lua": {
      "type": "js",
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/basic-languages/lua/lua.contribution": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/basic-languages/_.contribution",
        "node_modules/monaco-editor/esm/vs/basic-languages/lua/lua"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/basic-languages/markdown/markdown": {
      "type": "js",
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/basic-languages/markdown/markdown.contribution": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/basic-languages/_.contribution",
        "node_modules/monaco-editor/esm/vs/basic-languages/markdown/markdown"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/basic-languages/msdax/msdax": {
      "type": "js",
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/basic-languages/msdax/msdax.contribution": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/basic-languages/_.contribution",
        "node_modules/monaco-editor/esm/vs/basic-languages/msdax/msdax"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/basic-languages/mysql/mysql": {
      "type": "js",
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/basic-languages/mysql/mysql.contribution": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/basic-languages/_.contribution",
        "node_modules/monaco-editor/esm/vs/basic-languages/mysql/mysql"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/basic-languages/objective-c/objective-c": {
      "type": "js",
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/basic-languages/objective-c/objective-c.contribution": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/basic-languages/_.contribution",
        "node_modules/monaco-editor/esm/vs/basic-languages/objective-c/objective-c"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/basic-languages/pascal/pascal": {
      "type": "js",
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/basic-languages/pascal/pascal.contribution": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/basic-languages/_.contribution",
        "node_modules/monaco-editor/esm/vs/basic-languages/pascal/pascal"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/basic-languages/pgsql/pgsql": {
      "type": "js",
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/basic-languages/pgsql/pgsql.contribution": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/basic-languages/_.contribution",
        "node_modules/monaco-editor/esm/vs/basic-languages/pgsql/pgsql"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/basic-languages/php/php": {
      "type": "js",
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/basic-languages/php/php.contribution": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/basic-languages/_.contribution",
        "node_modules/monaco-editor/esm/vs/basic-languages/php/php"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/basic-languages/postiats/postiats": {
      "type": "js",
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/basic-languages/postiats/postiats.contribution": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/basic-languages/_.contribution",
        "node_modules/monaco-editor/esm/vs/basic-languages/postiats/postiats"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/basic-languages/powerquery/powerquery": {
      "type": "js",
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/basic-languages/powerquery/powerquery.contribution": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/basic-languages/_.contribution",
        "node_modules/monaco-editor/esm/vs/basic-languages/powerquery/powerquery"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/basic-languages/powershell/powershell": {
      "type": "js",
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/basic-languages/powershell/powershell.contribution": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/basic-languages/_.contribution",
        "node_modules/monaco-editor/esm/vs/basic-languages/powershell/powershell"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/basic-languages/pug/pug": {
      "type": "js",
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/basic-languages/pug/pug.contribution": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/basic-languages/_.contribution",
        "node_modules/monaco-editor/esm/vs/basic-languages/pug/pug"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/basic-languages/python/python": {
      "type": "js",
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/basic-languages/python/python.contribution": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/basic-languages/_.contribution",
        "node_modules/monaco-editor/esm/vs/basic-languages/python/python"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/basic-languages/r/r": {
      "type": "js",
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/basic-languages/r/r.contribution": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/basic-languages/_.contribution",
        "node_modules/monaco-editor/esm/vs/basic-languages/r/r"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/basic-languages/razor/razor": {
      "type": "js",
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/basic-languages/razor/razor.contribution": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/basic-languages/_.contribution",
        "node_modules/monaco-editor/esm/vs/basic-languages/razor/razor"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/basic-languages/redis/redis": {
      "type": "js",
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/basic-languages/redis/redis.contribution": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/basic-languages/_.contribution",
        "node_modules/monaco-editor/esm/vs/basic-languages/redis/redis"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/basic-languages/redshift/redshift": {
      "type": "js",
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/basic-languages/redshift/redshift.contribution": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/basic-languages/_.contribution",
        "node_modules/monaco-editor/esm/vs/basic-languages/redshift/redshift"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/basic-languages/ruby/ruby": {
      "type": "js",
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/basic-languages/ruby/ruby.contribution": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/basic-languages/_.contribution",
        "node_modules/monaco-editor/esm/vs/basic-languages/ruby/ruby"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/basic-languages/rust/rust": {
      "type": "js",
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/basic-languages/rust/rust.contribution": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/basic-languages/_.contribution",
        "node_modules/monaco-editor/esm/vs/basic-languages/rust/rust"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/basic-languages/sb/sb": {
      "type": "js",
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/basic-languages/sb/sb.contribution": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/basic-languages/_.contribution",
        "node_modules/monaco-editor/esm/vs/basic-languages/sb/sb"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/basic-languages/scss/scss": {
      "type": "js",
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/basic-languages/scss/scss.contribution": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/basic-languages/_.contribution",
        "node_modules/monaco-editor/esm/vs/basic-languages/scss/scss"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/basic-languages/solidity/solidity": {
      "type": "js",
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/basic-languages/solidity/solidity.contribution": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/basic-languages/_.contribution",
        "node_modules/monaco-editor/esm/vs/basic-languages/solidity/solidity"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/basic-languages/sql/sql": {
      "type": "js",
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/basic-languages/sql/sql.contribution": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/basic-languages/_.contribution",
        "node_modules/monaco-editor/esm/vs/basic-languages/sql/sql"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/basic-languages/st/st": {
      "type": "js",
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/basic-languages/st/st.contribution": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/basic-languages/_.contribution",
        "node_modules/monaco-editor/esm/vs/basic-languages/st/st"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/basic-languages/swift/swift": {
      "type": "js",
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/basic-languages/swift/swift.contribution": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/basic-languages/_.contribution",
        "node_modules/monaco-editor/esm/vs/basic-languages/swift/swift"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/basic-languages/tcl/tcl": {
      "type": "js",
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/basic-languages/tcl/tcl.contribution": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/basic-languages/_.contribution",
        "node_modules/monaco-editor/esm/vs/basic-languages/tcl/tcl"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/basic-languages/typescript/typescript.contribution": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/basic-languages/_.contribution",
        "node_modules/monaco-editor/esm/vs/basic-languages/typescript/typescript"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/basic-languages/vb/vb": {
      "type": "js",
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/basic-languages/vb/vb.contribution": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/basic-languages/_.contribution",
        "node_modules/monaco-editor/esm/vs/basic-languages/vb/vb"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/basic-languages/xml/xml": {
      "type": "js",
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/basic-languages/xml/xml.contribution": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/basic-languages/_.contribution",
        "node_modules/monaco-editor/esm/vs/basic-languages/xml/xml"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/basic-languages/yaml/yaml": {
      "type": "js",
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/basic-languages/yaml/yaml.contribution": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/basic-languages/_.contribution",
        "node_modules/monaco-editor/esm/vs/basic-languages/yaml/yaml"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/basic-languages/scheme/scheme": {
      "type": "js",
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/basic-languages/scheme/scheme.contribution": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/basic-languages/_.contribution",
        "node_modules/monaco-editor/esm/vs/basic-languages/scheme/scheme"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/basic-languages/clojure/clojure": {
      "type": "js",
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/basic-languages/clojure/clojure.contribution": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/basic-languages/_.contribution",
        "node_modules/monaco-editor/esm/vs/basic-languages/clojure/clojure"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/basic-languages/shell/shell": {
      "type": "js",
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/basic-languages/shell/shell.contribution": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/basic-languages/_.contribution",
        "node_modules/monaco-editor/esm/vs/basic-languages/shell/shell"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/basic-languages/perl/perl": {
      "type": "js",
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/basic-languages/perl/perl.contribution": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/basic-languages/_.contribution",
        "node_modules/monaco-editor/esm/vs/basic-languages/perl/perl"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/basic-languages/azcli/azcli": {
      "type": "js",
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/basic-languages/azcli/azcli.contribution": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/basic-languages/_.contribution",
        "node_modules/monaco-editor/esm/vs/basic-languages/azcli/azcli"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/basic-languages/apex/apex": {
      "type": "js",
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/basic-languages/apex/apex.contribution": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/basic-languages/_.contribution",
        "node_modules/monaco-editor/esm/vs/basic-languages/apex/apex"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/basic-languages/graphql/graphql": {
      "type": "js",
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/basic-languages/graphql/graphql.contribution": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/basic-languages/_.contribution",
        "node_modules/monaco-editor/esm/vs/basic-languages/graphql/graphql"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/basic-languages/monaco.contribution": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/editor/editor.api",
        "node_modules/monaco-editor/esm/vs/basic-languages/bat/bat.contribution",
        "node_modules/monaco-editor/esm/vs/basic-languages/coffee/coffee.contribution",
        "node_modules/monaco-editor/esm/vs/basic-languages/cpp/cpp.contribution",
        "node_modules/monaco-editor/esm/vs/basic-languages/csharp/csharp.contribution",
        "node_modules/monaco-editor/esm/vs/basic-languages/csp/csp.contribution",
        "node_modules/monaco-editor/esm/vs/basic-languages/css/css.contribution",
        "node_modules/monaco-editor/esm/vs/basic-languages/dockerfile/dockerfile.contribution",
        "node_modules/monaco-editor/esm/vs/basic-languages/fsharp/fsharp.contribution",
        "node_modules/monaco-editor/esm/vs/basic-languages/go/go.contribution",
        "node_modules/monaco-editor/esm/vs/basic-languages/handlebars/handlebars.contribution",
        "node_modules/monaco-editor/esm/vs/basic-languages/html/html.contribution",
        "node_modules/monaco-editor/esm/vs/basic-languages/ini/ini.contribution",
        "node_modules/monaco-editor/esm/vs/basic-languages/java/java.contribution",
        "node_modules/monaco-editor/esm/vs/basic-languages/javascript/javascript.contribution",
        "node_modules/monaco-editor/esm/vs/basic-languages/kotlin/kotlin.contribution",
        "node_modules/monaco-editor/esm/vs/basic-languages/less/less.contribution",
        "node_modules/monaco-editor/esm/vs/basic-languages/lua/lua.contribution",
        "node_modules/monaco-editor/esm/vs/basic-languages/markdown/markdown.contribution",
        "node_modules/monaco-editor/esm/vs/basic-languages/msdax/msdax.contribution",
        "node_modules/monaco-editor/esm/vs/basic-languages/mysql/mysql.contribution",
        "node_modules/monaco-editor/esm/vs/basic-languages/objective-c/objective-c.contribution",
        "node_modules/monaco-editor/esm/vs/basic-languages/pascal/pascal.contribution",
        "node_modules/monaco-editor/esm/vs/basic-languages/pgsql/pgsql.contribution",
        "node_modules/monaco-editor/esm/vs/basic-languages/php/php.contribution",
        "node_modules/monaco-editor/esm/vs/basic-languages/postiats/postiats.contribution",
        "node_modules/monaco-editor/esm/vs/basic-languages/powerquery/powerquery.contribution",
        "node_modules/monaco-editor/esm/vs/basic-languages/powershell/powershell.contribution",
        "node_modules/monaco-editor/esm/vs/basic-languages/pug/pug.contribution",
        "node_modules/monaco-editor/esm/vs/basic-languages/python/python.contribution",
        "node_modules/monaco-editor/esm/vs/basic-languages/r/r.contribution",
        "node_modules/monaco-editor/esm/vs/basic-languages/razor/razor.contribution",
        "node_modules/monaco-editor/esm/vs/basic-languages/redis/redis.contribution",
        "node_modules/monaco-editor/esm/vs/basic-languages/redshift/redshift.contribution",
        "node_modules/monaco-editor/esm/vs/basic-languages/ruby/ruby.contribution",
        "node_modules/monaco-editor/esm/vs/basic-languages/rust/rust.contribution",
        "node_modules/monaco-editor/esm/vs/basic-languages/sb/sb.contribution",
        "node_modules/monaco-editor/esm/vs/basic-languages/scss/scss.contribution",
        "node_modules/monaco-editor/esm/vs/basic-languages/solidity/solidity.contribution",
        "node_modules/monaco-editor/esm/vs/basic-languages/sql/sql.contribution",
        "node_modules/monaco-editor/esm/vs/basic-languages/st/st.contribution",
        "node_modules/monaco-editor/esm/vs/basic-languages/swift/swift.contribution",
        "node_modules/monaco-editor/esm/vs/basic-languages/tcl/tcl.contribution",
        "node_modules/monaco-editor/esm/vs/basic-languages/typescript/typescript.contribution",
        "node_modules/monaco-editor/esm/vs/basic-languages/vb/vb.contribution",
        "node_modules/monaco-editor/esm/vs/basic-languages/xml/xml.contribution",
        "node_modules/monaco-editor/esm/vs/basic-languages/yaml/yaml.contribution",
        "node_modules/monaco-editor/esm/vs/basic-languages/scheme/scheme.contribution",
        "node_modules/monaco-editor/esm/vs/basic-languages/clojure/clojure.contribution",
        "node_modules/monaco-editor/esm/vs/basic-languages/shell/shell.contribution",
        "node_modules/monaco-editor/esm/vs/basic-languages/perl/perl.contribution",
        "node_modules/monaco-editor/esm/vs/basic-languages/azcli/azcli.contribution",
        "node_modules/monaco-editor/esm/vs/basic-languages/apex/apex.contribution",
        "node_modules/monaco-editor/esm/vs/basic-languages/graphql/graphql.contribution"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/contrib/bracketMatching/bracketMatching": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/nls",
        "node_modules/monaco-editor/esm/vs/base/common/async",
        "node_modules/monaco-editor/esm/vs/base/common/lifecycle",
        "node_modules/monaco-editor/esm/vs/editor/browser/editorExtensions",
        "node_modules/monaco-editor/esm/vs/editor/common/core/position",
        "node_modules/monaco-editor/esm/vs/editor/common/core/selection",
        "node_modules/monaco-editor/esm/vs/editor/common/editorContextKeys",
        "node_modules/monaco-editor/esm/vs/editor/common/model",
        "node_modules/monaco-editor/esm/vs/editor/common/model/textModel",
        "node_modules/monaco-editor/esm/vs/editor/common/view/editorColorRegistry",
        "node_modules/monaco-editor/esm/vs/platform/theme/common/colorRegistry",
        "node_modules/monaco-editor/esm/vs/platform/theme/common/themeService",
        "node_modules/monaco-editor/esm/vs/platform/actions/common/actions"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/contrib/caretOperations/moveCaretCommand": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/editor/common/core/range"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/contrib/caretOperations/caretOperations": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/nls",
        "node_modules/monaco-editor/esm/vs/editor/browser/editorExtensions",
        "node_modules/monaco-editor/esm/vs/editor/common/editorContextKeys",
        "node_modules/monaco-editor/esm/vs/editor/contrib/caretOperations/moveCaretCommand"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/contrib/caretOperations/transpose": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/nls",
        "node_modules/monaco-editor/esm/vs/base/common/strings",
        "node_modules/monaco-editor/esm/vs/editor/browser/editorExtensions",
        "node_modules/monaco-editor/esm/vs/editor/common/commands/replaceCommand",
        "node_modules/monaco-editor/esm/vs/editor/common/core/position",
        "node_modules/monaco-editor/esm/vs/editor/common/core/range",
        "node_modules/monaco-editor/esm/vs/editor/common/editorContextKeys"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/contrib/clipboard/clipboard": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/nls",
        "node_modules/monaco-editor/esm/vs/base/browser/browser",
        "node_modules/monaco-editor/esm/vs/base/common/platform",
        "node_modules/monaco-editor/esm/vs/editor/browser/controller/textAreaInput",
        "node_modules/monaco-editor/esm/vs/editor/browser/editorExtensions",
        "node_modules/monaco-editor/esm/vs/editor/browser/services/codeEditorService",
        "node_modules/monaco-editor/esm/vs/editor/common/editorContextKeys"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/contrib/message/messageController": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/nls",
        "node_modules/monaco-editor/esm/vs/base/common/async",
        "node_modules/monaco-editor/esm/vs/base/common/lifecycle",
        "node_modules/monaco-editor/esm/vs/base/browser/ui/aria/aria",
        "node_modules/monaco-editor/esm/vs/editor/common/core/range",
        "node_modules/monaco-editor/esm/vs/editor/browser/editorExtensions",
        "node_modules/monaco-editor/esm/vs/platform/contextkey/common/contextkey",
        "node_modules/monaco-editor/esm/vs/platform/theme/common/themeService",
        "node_modules/monaco-editor/esm/vs/platform/theme/common/colorRegistry"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/contrib/codeAction/codeActionTrigger": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/strings"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/contrib/codeAction/codeAction": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/arrays",
        "node_modules/monaco-editor/esm/vs/base/common/cancellation",
        "node_modules/monaco-editor/esm/vs/base/common/errors",
        "node_modules/monaco-editor/esm/vs/base/common/uri",
        "node_modules/monaco-editor/esm/vs/editor/browser/editorExtensions",
        "node_modules/monaco-editor/esm/vs/editor/common/core/range",
        "node_modules/monaco-editor/esm/vs/editor/common/modes",
        "node_modules/monaco-editor/esm/vs/editor/common/services/modelService",
        "node_modules/monaco-editor/esm/vs/editor/contrib/codeAction/codeActionTrigger",
        "node_modules/monaco-editor/esm/vs/editor/browser/core/editorState"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/contrib/codeAction/codeActionModel": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/async",
        "node_modules/monaco-editor/esm/vs/base/common/event",
        "node_modules/monaco-editor/esm/vs/base/common/lifecycle",
        "node_modules/monaco-editor/esm/vs/editor/common/core/range",
        "node_modules/monaco-editor/esm/vs/editor/common/modes",
        "node_modules/monaco-editor/esm/vs/platform/contextkey/common/contextkey",
        "node_modules/monaco-editor/esm/vs/editor/contrib/codeAction/codeAction"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/contrib/codeAction/codeActionWidget": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/browser/dom",
        "node_modules/monaco-editor/esm/vs/base/common/actions",
        "node_modules/monaco-editor/esm/vs/base/common/errors",
        "node_modules/monaco-editor/esm/vs/base/common/event",
        "node_modules/monaco-editor/esm/vs/editor/common/core/position"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/contrib/codeAction/lightBulbWidget": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/browser/dom",
        "node_modules/monaco-editor/esm/vs/base/browser/globalMouseMoveMonitor",
        "node_modules/monaco-editor/esm/vs/base/common/cancellation",
        "node_modules/monaco-editor/esm/vs/base/common/event",
        "node_modules/monaco-editor/esm/vs/base/common/lifecycle",
        "node_modules/monaco-editor/esm/vs/editor/common/model/textModel",
        "node_modules/monaco-editor/esm/vs/editor/contrib/codeAction/codeActionModel"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/contrib/codeAction/codeActionCommands": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/lifecycle",
        "node_modules/monaco-editor/esm/vs/base/common/strings",
        "node_modules/monaco-editor/esm/vs/editor/browser/editorExtensions",
        "node_modules/monaco-editor/esm/vs/editor/browser/services/bulkEditService",
        "node_modules/monaco-editor/esm/vs/editor/common/editorContextKeys",
        "node_modules/monaco-editor/esm/vs/editor/contrib/message/messageController",
        "node_modules/monaco-editor/esm/vs/nls",
        "node_modules/monaco-editor/esm/vs/platform/commands/common/commands",
        "node_modules/monaco-editor/esm/vs/platform/contextkey/common/contextkey",
        "node_modules/monaco-editor/esm/vs/platform/contextview/browser/contextView",
        "node_modules/monaco-editor/esm/vs/platform/keybinding/common/keybinding",
        "node_modules/monaco-editor/esm/vs/platform/markers/common/markers",
        "node_modules/monaco-editor/esm/vs/platform/progress/common/progress",
        "node_modules/monaco-editor/esm/vs/editor/contrib/codeAction/codeActionModel",
        "node_modules/monaco-editor/esm/vs/editor/contrib/codeAction/codeActionTrigger",
        "node_modules/monaco-editor/esm/vs/editor/contrib/codeAction/codeActionWidget",
        "node_modules/monaco-editor/esm/vs/editor/contrib/codeAction/lightBulbWidget",
        "node_modules/monaco-editor/esm/vs/base/common/errors"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/contrib/codeAction/codeActionContributions": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/editor/browser/editorExtensions",
        "node_modules/monaco-editor/esm/vs/editor/contrib/codeAction/codeActionCommands"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/contrib/codelens/codelens": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/arrays",
        "node_modules/monaco-editor/esm/vs/base/common/cancellation",
        "node_modules/monaco-editor/esm/vs/base/common/errors",
        "node_modules/monaco-editor/esm/vs/base/common/uri",
        "node_modules/monaco-editor/esm/vs/editor/browser/editorExtensions",
        "node_modules/monaco-editor/esm/vs/editor/common/modes",
        "node_modules/monaco-editor/esm/vs/editor/common/services/modelService"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/contrib/codelens/codelensWidget": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/browser/dom",
        "node_modules/monaco-editor/esm/vs/base/common/arrays",
        "node_modules/monaco-editor/esm/vs/base/common/strings",
        "node_modules/monaco-editor/esm/vs/editor/common/core/range",
        "node_modules/monaco-editor/esm/vs/editor/common/model/textModel",
        "node_modules/monaco-editor/esm/vs/editor/common/view/editorColorRegistry",
        "node_modules/monaco-editor/esm/vs/platform/theme/common/colorRegistry",
        "node_modules/monaco-editor/esm/vs/platform/theme/common/themeService"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/contrib/codelens/codelensController": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/async",
        "node_modules/monaco-editor/esm/vs/base/common/errors",
        "node_modules/monaco-editor/esm/vs/base/common/lifecycle",
        "node_modules/monaco-editor/esm/vs/editor/browser/core/editorState",
        "node_modules/monaco-editor/esm/vs/editor/browser/editorExtensions",
        "node_modules/monaco-editor/esm/vs/editor/common/modes",
        "node_modules/monaco-editor/esm/vs/editor/contrib/codelens/codelens",
        "node_modules/monaco-editor/esm/vs/editor/contrib/codelens/codelensWidget",
        "node_modules/monaco-editor/esm/vs/platform/commands/common/commands",
        "node_modules/monaco-editor/esm/vs/platform/notification/common/notification",
        "node_modules/monaco-editor/esm/vs/editor/contrib/codelens/codeLensCache"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/base/common/hash": {
      "type": "js",
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/contrib/colorPicker/color": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/cancellation",
        "node_modules/monaco-editor/esm/vs/base/common/errors",
        "node_modules/monaco-editor/esm/vs/base/common/uri",
        "node_modules/monaco-editor/esm/vs/editor/browser/editorExtensions",
        "node_modules/monaco-editor/esm/vs/editor/common/core/range",
        "node_modules/monaco-editor/esm/vs/editor/common/modes",
        "node_modules/monaco-editor/esm/vs/editor/common/services/modelService"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/contrib/colorPicker/colorDetector": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/async",
        "node_modules/monaco-editor/esm/vs/base/common/color",
        "node_modules/monaco-editor/esm/vs/base/common/errors",
        "node_modules/monaco-editor/esm/vs/base/common/hash",
        "node_modules/monaco-editor/esm/vs/base/common/lifecycle",
        "node_modules/monaco-editor/esm/vs/editor/browser/editorExtensions",
        "node_modules/monaco-editor/esm/vs/editor/browser/services/codeEditorService",
        "node_modules/monaco-editor/esm/vs/editor/common/core/range",
        "node_modules/monaco-editor/esm/vs/editor/common/model/textModel",
        "node_modules/monaco-editor/esm/vs/editor/common/modes",
        "node_modules/monaco-editor/esm/vs/editor/contrib/colorPicker/color",
        "node_modules/monaco-editor/esm/vs/platform/configuration/common/configuration"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/contrib/comment/blockCommentCommand": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/editor/common/core/editOperation",
        "node_modules/monaco-editor/esm/vs/editor/common/core/position",
        "node_modules/monaco-editor/esm/vs/editor/common/core/range",
        "node_modules/monaco-editor/esm/vs/editor/common/core/selection",
        "node_modules/monaco-editor/esm/vs/editor/common/modes/languageConfigurationRegistry"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/contrib/comment/lineCommentCommand": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/strings",
        "node_modules/monaco-editor/esm/vs/editor/common/core/editOperation",
        "node_modules/monaco-editor/esm/vs/editor/common/core/position",
        "node_modules/monaco-editor/esm/vs/editor/common/core/range",
        "node_modules/monaco-editor/esm/vs/editor/common/core/selection",
        "node_modules/monaco-editor/esm/vs/editor/common/modes/languageConfigurationRegistry",
        "node_modules/monaco-editor/esm/vs/editor/contrib/comment/blockCommentCommand"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/contrib/comment/comment": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/nls",
        "node_modules/monaco-editor/esm/vs/base/common/keyCodes",
        "node_modules/monaco-editor/esm/vs/editor/browser/editorExtensions",
        "node_modules/monaco-editor/esm/vs/editor/common/editorContextKeys",
        "node_modules/monaco-editor/esm/vs/editor/contrib/comment/blockCommentCommand",
        "node_modules/monaco-editor/esm/vs/editor/contrib/comment/lineCommentCommand"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/contrib/contextmenu/contextmenu": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/nls",
        "node_modules/monaco-editor/esm/vs/base/browser/dom",
        "node_modules/monaco-editor/esm/vs/base/browser/ui/actionbar/actionbar",
        "node_modules/monaco-editor/esm/vs/base/common/lifecycle",
        "node_modules/monaco-editor/esm/vs/editor/browser/editorExtensions",
        "node_modules/monaco-editor/esm/vs/editor/common/editorContextKeys",
        "node_modules/monaco-editor/esm/vs/platform/actions/common/actions",
        "node_modules/monaco-editor/esm/vs/platform/contextkey/common/contextkey",
        "node_modules/monaco-editor/esm/vs/platform/contextview/browser/contextView",
        "node_modules/monaco-editor/esm/vs/platform/keybinding/common/keybinding"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/contrib/cursorUndo/cursorUndo": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/nls",
        "node_modules/monaco-editor/esm/vs/base/common/lifecycle",
        "node_modules/monaco-editor/esm/vs/editor/browser/editorExtensions",
        "node_modules/monaco-editor/esm/vs/editor/common/editorContextKeys"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/contrib/dnd/dragAndDropCommand": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/editor/common/core/selection",
        "node_modules/monaco-editor/esm/vs/editor/common/core/range"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/contrib/dnd/dnd": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/lifecycle",
        "node_modules/monaco-editor/esm/vs/base/common/platform",
        "node_modules/monaco-editor/esm/vs/editor/browser/editorExtensions",
        "node_modules/monaco-editor/esm/vs/editor/common/core/position",
        "node_modules/monaco-editor/esm/vs/editor/common/core/range",
        "node_modules/monaco-editor/esm/vs/editor/common/core/selection",
        "node_modules/monaco-editor/esm/vs/editor/contrib/dnd/dragAndDropCommand",
        "node_modules/monaco-editor/esm/vs/editor/common/model/textModel"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/contrib/find/findDecorations": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/editor/common/core/range",
        "node_modules/monaco-editor/esm/vs/editor/common/model",
        "node_modules/monaco-editor/esm/vs/editor/common/model/textModel",
        "node_modules/monaco-editor/esm/vs/platform/theme/common/colorRegistry",
        "node_modules/monaco-editor/esm/vs/platform/theme/common/themeService"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/contrib/find/replaceAllCommand": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/editor/common/core/range"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/contrib/find/replacePattern": {
      "type": "js",
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/contrib/find/findModel": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/async",
        "node_modules/monaco-editor/esm/vs/base/common/lifecycle",
        "node_modules/monaco-editor/esm/vs/editor/common/commands/replaceCommand",
        "node_modules/monaco-editor/esm/vs/editor/common/core/position",
        "node_modules/monaco-editor/esm/vs/editor/common/core/range",
        "node_modules/monaco-editor/esm/vs/editor/common/core/selection",
        "node_modules/monaco-editor/esm/vs/editor/common/model/textModelSearch",
        "node_modules/monaco-editor/esm/vs/editor/contrib/find/findDecorations",
        "node_modules/monaco-editor/esm/vs/editor/contrib/find/replaceAllCommand",
        "node_modules/monaco-editor/esm/vs/editor/contrib/find/replacePattern",
        "node_modules/monaco-editor/esm/vs/platform/contextkey/common/contextkey"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/base/browser/ui/checkbox/checkbox": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/browser/dom",
        "node_modules/monaco-editor/esm/vs/base/browser/ui/widget",
        "node_modules/monaco-editor/esm/vs/base/common/color",
        "node_modules/monaco-editor/esm/vs/base/common/event",
        "node_modules/monaco-editor/esm/vs/base/common/objects"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/base/browser/ui/findinput/findInputCheckboxes": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/browser/ui/checkbox/checkbox",
        "node_modules/monaco-editor/esm/vs/nls"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/contrib/find/findOptionsWidget": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/browser/dom",
        "node_modules/monaco-editor/esm/vs/base/browser/ui/findinput/findInputCheckboxes",
        "node_modules/monaco-editor/esm/vs/base/browser/ui/widget",
        "node_modules/monaco-editor/esm/vs/base/common/async",
        "node_modules/monaco-editor/esm/vs/editor/contrib/find/findModel",
        "node_modules/monaco-editor/esm/vs/platform/theme/common/colorRegistry",
        "node_modules/monaco-editor/esm/vs/platform/theme/common/themeService"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/contrib/find/findState": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/event",
        "node_modules/monaco-editor/esm/vs/editor/common/core/range"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/base/common/idGenerator": {
      "type": "js",
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/base/common/htmlContent": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/arrays"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/base/common/marked/marked": {
      "type": "js",
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/base/browser/htmlContentRenderer": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/browser/dom",
        "node_modules/monaco-editor/esm/vs/base/common/idGenerator",
        "node_modules/monaco-editor/esm/vs/base/common/strings",
        "node_modules/monaco-editor/esm/vs/base/common/htmlContent",
        "node_modules/monaco-editor/esm/vs/base/common/marked/marked",
        "node_modules/monaco-editor/esm/vs/base/common/errors",
        "node_modules/monaco-editor/esm/vs/base/common/uri",
        "node_modules/monaco-editor/esm/vs/base/common/marshalling",
        "node_modules/monaco-editor/esm/vs/base/common/objects"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/base/common/history": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/iterator"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/base/browser/ui/inputbox/inputBox": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/nls",
        "node_modules/monaco-editor/esm/vs/base/browser/browser",
        "node_modules/monaco-editor/esm/vs/base/browser/dom",
        "node_modules/monaco-editor/esm/vs/base/browser/htmlContentRenderer",
        "node_modules/monaco-editor/esm/vs/base/browser/ui/aria/aria",
        "node_modules/monaco-editor/esm/vs/base/browser/ui/actionbar/actionbar",
        "node_modules/monaco-editor/esm/vs/base/common/event",
        "node_modules/monaco-editor/esm/vs/base/browser/ui/widget",
        "node_modules/monaco-editor/esm/vs/base/common/color",
        "node_modules/monaco-editor/esm/vs/base/common/objects",
        "node_modules/monaco-editor/esm/vs/base/common/history"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/base/browser/ui/findinput/findInput": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/nls",
        "node_modules/monaco-editor/esm/vs/base/browser/dom",
        "node_modules/monaco-editor/esm/vs/base/browser/ui/inputbox/inputBox",
        "node_modules/monaco-editor/esm/vs/base/browser/ui/widget",
        "node_modules/monaco-editor/esm/vs/base/common/event",
        "node_modules/monaco-editor/esm/vs/base/browser/ui/findinput/findInputCheckboxes"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/platform/browser/contextScopedHistoryWidget": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/platform/contextkey/common/contextkey",
        "node_modules/monaco-editor/esm/vs/base/browser/ui/inputbox/inputBox",
        "node_modules/monaco-editor/esm/vs/base/browser/ui/findinput/findInput",
        "node_modules/monaco-editor/esm/vs/platform/keybinding/common/keybindingsRegistry"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/contrib/find/findWidget": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/nls",
        "node_modules/monaco-editor/esm/vs/base/browser/dom",
        "node_modules/monaco-editor/esm/vs/base/browser/ui/sash/sash",
        "node_modules/monaco-editor/esm/vs/base/browser/ui/widget",
        "node_modules/monaco-editor/esm/vs/base/common/async",
        "node_modules/monaco-editor/esm/vs/base/common/errors",
        "node_modules/monaco-editor/esm/vs/base/common/lifecycle",
        "node_modules/monaco-editor/esm/vs/base/common/platform",
        "node_modules/monaco-editor/esm/vs/base/common/strings",
        "node_modules/monaco-editor/esm/vs/editor/common/core/range",
        "node_modules/monaco-editor/esm/vs/editor/contrib/find/findModel",
        "node_modules/monaco-editor/esm/vs/platform/theme/common/colorRegistry",
        "node_modules/monaco-editor/esm/vs/platform/theme/common/themeService",
        "node_modules/monaco-editor/esm/vs/platform/browser/contextScopedHistoryWidget"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/platform/clipboard/common/clipboardService": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/platform/instantiation/common/instantiation"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/contrib/find/findController": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/nls",
        "node_modules/monaco-editor/esm/vs/base/common/async",
        "node_modules/monaco-editor/esm/vs/base/common/lifecycle",
        "node_modules/monaco-editor/esm/vs/base/common/strings",
        "node_modules/monaco-editor/esm/vs/editor/browser/editorExtensions",
        "node_modules/monaco-editor/esm/vs/editor/common/editorContextKeys",
        "node_modules/monaco-editor/esm/vs/editor/contrib/find/findModel",
        "node_modules/monaco-editor/esm/vs/editor/contrib/find/findOptionsWidget",
        "node_modules/monaco-editor/esm/vs/editor/contrib/find/findState",
        "node_modules/monaco-editor/esm/vs/editor/contrib/find/findWidget",
        "node_modules/monaco-editor/esm/vs/platform/clipboard/common/clipboardService",
        "node_modules/monaco-editor/esm/vs/platform/contextkey/common/contextkey",
        "node_modules/monaco-editor/esm/vs/platform/contextview/browser/contextView",
        "node_modules/monaco-editor/esm/vs/platform/instantiation/common/instantiation",
        "node_modules/monaco-editor/esm/vs/platform/keybinding/common/keybinding",
        "node_modules/monaco-editor/esm/vs/platform/storage/common/storage",
        "node_modules/monaco-editor/esm/vs/platform/theme/common/themeService"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/contrib/folding/foldingRanges": {
      "type": "js",
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/contrib/folding/foldingModel": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/event",
        "node_modules/monaco-editor/esm/vs/editor/contrib/folding/foldingRanges"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/contrib/folding/foldingDecorations": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/editor/common/model/textModel"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/contrib/folding/hiddenRangeModel": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/event",
        "node_modules/monaco-editor/esm/vs/editor/common/core/range",
        "node_modules/monaco-editor/esm/vs/base/common/arrays"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/contrib/folding/indentRangeProvider": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/editor/contrib/folding/foldingRanges",
        "node_modules/monaco-editor/esm/vs/editor/common/model/textModel",
        "node_modules/monaco-editor/esm/vs/editor/common/modes/languageConfigurationRegistry"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/contrib/folding/syntaxRangeProvider": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/errors",
        "node_modules/monaco-editor/esm/vs/editor/contrib/folding/foldingRanges"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/contrib/folding/intializingRangeProvider": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/editor/contrib/folding/syntaxRangeProvider"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/contrib/folding/folding": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/nls",
        "node_modules/monaco-editor/esm/vs/base/common/types",
        "node_modules/monaco-editor/esm/vs/base/common/strings",
        "node_modules/monaco-editor/esm/vs/base/common/async",
        "node_modules/monaco-editor/esm/vs/base/common/keyCodes",
        "node_modules/monaco-editor/esm/vs/base/common/lifecycle",
        "node_modules/monaco-editor/esm/vs/editor/browser/editorExtensions",
        "node_modules/monaco-editor/esm/vs/editor/contrib/folding/foldingModel",
        "node_modules/monaco-editor/esm/vs/editor/contrib/folding/foldingDecorations",
        "node_modules/monaco-editor/esm/vs/editor/common/editorContextKeys",
        "node_modules/monaco-editor/esm/vs/editor/contrib/folding/hiddenRangeModel",
        "node_modules/monaco-editor/esm/vs/editor/common/modes/languageConfigurationRegistry",
        "node_modules/monaco-editor/esm/vs/editor/contrib/folding/indentRangeProvider",
        "node_modules/monaco-editor/esm/vs/editor/common/modes",
        "node_modules/monaco-editor/esm/vs/editor/contrib/folding/syntaxRangeProvider",
        "node_modules/monaco-editor/esm/vs/editor/contrib/folding/intializingRangeProvider",
        "node_modules/monaco-editor/esm/vs/base/common/errors"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/contrib/fontZoom/fontZoom": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/nls",
        "node_modules/monaco-editor/esm/vs/editor/browser/editorExtensions",
        "node_modules/monaco-editor/esm/vs/editor/common/config/editorZoom"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/contrib/format/formattingEdit": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/editor/common/core/editOperation",
        "node_modules/monaco-editor/esm/vs/editor/common/core/range"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/platform/extensions/common/extensions": {
      "type": "js",
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/contrib/format/format": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/browser/ui/aria/aria",
        "node_modules/monaco-editor/esm/vs/base/common/arrays",
        "node_modules/monaco-editor/esm/vs/base/common/cancellation",
        "node_modules/monaco-editor/esm/vs/base/common/errors",
        "node_modules/monaco-editor/esm/vs/base/common/uri",
        "node_modules/monaco-editor/esm/vs/editor/browser/core/editorState",
        "node_modules/monaco-editor/esm/vs/editor/browser/editorBrowser",
        "node_modules/monaco-editor/esm/vs/editor/browser/editorExtensions",
        "node_modules/monaco-editor/esm/vs/editor/common/core/position",
        "node_modules/monaco-editor/esm/vs/editor/common/core/range",
        "node_modules/monaco-editor/esm/vs/editor/common/core/selection",
        "node_modules/monaco-editor/esm/vs/editor/common/modes",
        "node_modules/monaco-editor/esm/vs/editor/common/services/editorWorkerService",
        "node_modules/monaco-editor/esm/vs/editor/common/services/modelService",
        "node_modules/monaco-editor/esm/vs/editor/contrib/format/formattingEdit",
        "node_modules/monaco-editor/esm/vs/nls",
        "node_modules/monaco-editor/esm/vs/platform/extensions/common/extensions",
        "node_modules/monaco-editor/esm/vs/platform/instantiation/common/instantiation",
        "node_modules/monaco-editor/esm/vs/base/common/linkedList"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/contrib/format/formatActions": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/arrays",
        "node_modules/monaco-editor/esm/vs/base/common/cancellation",
        "node_modules/monaco-editor/esm/vs/base/common/keyCodes",
        "node_modules/monaco-editor/esm/vs/base/common/lifecycle",
        "node_modules/monaco-editor/esm/vs/editor/browser/editorExtensions",
        "node_modules/monaco-editor/esm/vs/editor/browser/services/codeEditorService",
        "node_modules/monaco-editor/esm/vs/editor/common/core/characterClassifier",
        "node_modules/monaco-editor/esm/vs/editor/common/core/range",
        "node_modules/monaco-editor/esm/vs/editor/common/editorContextKeys",
        "node_modules/monaco-editor/esm/vs/editor/common/modes",
        "node_modules/monaco-editor/esm/vs/editor/common/services/editorWorkerService",
        "node_modules/monaco-editor/esm/vs/editor/contrib/format/format",
        "node_modules/monaco-editor/esm/vs/editor/contrib/format/formattingEdit",
        "node_modules/monaco-editor/esm/vs/nls",
        "node_modules/monaco-editor/esm/vs/platform/commands/common/commands",
        "node_modules/monaco-editor/esm/vs/platform/contextkey/common/contextkey",
        "node_modules/monaco-editor/esm/vs/platform/instantiation/common/instantiation",
        "node_modules/monaco-editor/esm/vs/base/common/errors"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/browser/widget/embeddedCodeEditorWidget": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/objects",
        "node_modules/monaco-editor/esm/vs/editor/browser/services/codeEditorService",
        "node_modules/monaco-editor/esm/vs/editor/browser/widget/codeEditorWidget",
        "node_modules/monaco-editor/esm/vs/platform/commands/common/commands",
        "node_modules/monaco-editor/esm/vs/platform/contextkey/common/contextkey",
        "node_modules/monaco-editor/esm/vs/platform/instantiation/common/instantiation",
        "node_modules/monaco-editor/esm/vs/platform/notification/common/notification",
        "node_modules/monaco-editor/esm/vs/platform/theme/common/themeService",
        "node_modules/monaco-editor/esm/vs/platform/accessibility/common/accessibility"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/contrib/zoneWidget/zoneWidget": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/browser/dom",
        "node_modules/monaco-editor/esm/vs/base/browser/ui/sash/sash",
        "node_modules/monaco-editor/esm/vs/base/common/color",
        "node_modules/monaco-editor/esm/vs/base/common/idGenerator",
        "node_modules/monaco-editor/esm/vs/base/common/lifecycle",
        "node_modules/monaco-editor/esm/vs/base/common/objects",
        "node_modules/monaco-editor/esm/vs/editor/common/core/range",
        "node_modules/monaco-editor/esm/vs/editor/common/model/textModel"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/contrib/referenceSearch/peekViewWidget": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/browser/dom",
        "node_modules/monaco-editor/esm/vs/base/browser/ui/actionbar/actionbar",
        "node_modules/monaco-editor/esm/vs/base/common/actions",
        "node_modules/monaco-editor/esm/vs/base/common/color",
        "node_modules/monaco-editor/esm/vs/base/common/event",
        "node_modules/monaco-editor/esm/vs/base/common/objects",
        "node_modules/monaco-editor/esm/vs/base/common/strings",
        "node_modules/monaco-editor/esm/vs/editor/browser/services/codeEditorService",
        "node_modules/monaco-editor/esm/vs/editor/browser/widget/embeddedCodeEditorWidget",
        "node_modules/monaco-editor/esm/vs/editor/contrib/zoneWidget/zoneWidget",
        "node_modules/monaco-editor/esm/vs/nls",
        "node_modules/monaco-editor/esm/vs/platform/contextkey/common/contextkey",
        "node_modules/monaco-editor/esm/vs/platform/instantiation/common/instantiation",
        "node_modules/monaco-editor/esm/vs/platform/instantiation/common/extensions"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/contrib/referenceSearch/referencesModel": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/nls",
        "node_modules/monaco-editor/esm/vs/base/common/event",
        "node_modules/monaco-editor/esm/vs/base/common/resources",
        "node_modules/monaco-editor/esm/vs/base/common/lifecycle",
        "node_modules/monaco-editor/esm/vs/base/common/strings",
        "node_modules/monaco-editor/esm/vs/base/common/idGenerator",
        "node_modules/monaco-editor/esm/vs/editor/common/core/range"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/base/browser/ui/octiconLabel/octiconLabel": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/strings"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/base/browser/ui/highlightedlabel/highlightedLabel": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/objects",
        "node_modules/monaco-editor/esm/vs/base/browser/ui/octiconLabel/octiconLabel",
        "node_modules/monaco-editor/esm/vs/base/common/strings"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/base/browser/ui/iconLabel/iconLabel": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/browser/dom",
        "node_modules/monaco-editor/esm/vs/base/browser/ui/highlightedlabel/highlightedLabel",
        "node_modules/monaco-editor/esm/vs/base/common/lifecycle"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/base/browser/ui/countBadge/countBadge": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/browser/dom",
        "node_modules/monaco-editor/esm/vs/base/common/strings",
        "node_modules/monaco-editor/esm/vs/base/common/color",
        "node_modules/monaco-editor/esm/vs/base/common/objects"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/base/common/labels": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/uri",
        "node_modules/monaco-editor/esm/vs/base/common/path",
        "node_modules/monaco-editor/esm/vs/base/common/strings",
        "node_modules/monaco-editor/esm/vs/base/common/network",
        "node_modules/monaco-editor/esm/vs/base/common/platform",
        "node_modules/monaco-editor/esm/vs/base/common/resources"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/contrib/referenceSearch/referencesTree": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/editor/contrib/referenceSearch/referencesModel",
        "node_modules/monaco-editor/esm/vs/editor/common/services/resolverService",
        "node_modules/monaco-editor/esm/vs/base/browser/ui/iconLabel/iconLabel",
        "node_modules/monaco-editor/esm/vs/base/browser/ui/countBadge/countBadge",
        "node_modules/monaco-editor/esm/vs/platform/label/common/label",
        "node_modules/monaco-editor/esm/vs/platform/theme/common/themeService",
        "node_modules/monaco-editor/esm/vs/platform/theme/common/styler",
        "node_modules/monaco-editor/esm/vs/base/browser/dom",
        "node_modules/monaco-editor/esm/vs/nls",
        "node_modules/monaco-editor/esm/vs/base/common/labels",
        "node_modules/monaco-editor/esm/vs/base/common/resources",
        "node_modules/monaco-editor/esm/vs/base/common/strings",
        "node_modules/monaco-editor/esm/vs/base/common/lifecycle",
        "node_modules/monaco-editor/esm/vs/platform/instantiation/common/instantiation",
        "node_modules/monaco-editor/esm/vs/platform/keybinding/common/keybinding",
        "node_modules/monaco-editor/esm/vs/base/common/filters"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/base/browser/ui/splitview/splitview": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/lifecycle",
        "node_modules/monaco-editor/esm/vs/base/common/event",
        "node_modules/monaco-editor/esm/vs/base/common/types",
        "node_modules/monaco-editor/esm/vs/base/browser/dom",
        "node_modules/monaco-editor/esm/vs/base/common/numbers",
        "node_modules/monaco-editor/esm/vs/base/common/arrays",
        "node_modules/monaco-editor/esm/vs/base/browser/ui/sash/sash",
        "node_modules/monaco-editor/esm/vs/base/common/color",
        "node_modules/monaco-editor/esm/vs/base/browser/event"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/contrib/referenceSearch/referencesWidget": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/browser/dom",
        "node_modules/monaco-editor/esm/vs/base/common/color",
        "node_modules/monaco-editor/esm/vs/base/common/event",
        "node_modules/monaco-editor/esm/vs/base/common/lifecycle",
        "node_modules/monaco-editor/esm/vs/base/common/network",
        "node_modules/monaco-editor/esm/vs/base/common/resources",
        "node_modules/monaco-editor/esm/vs/editor/browser/widget/embeddedCodeEditorWidget",
        "node_modules/monaco-editor/esm/vs/editor/common/core/range",
        "node_modules/monaco-editor/esm/vs/editor/common/model/textModel",
        "node_modules/monaco-editor/esm/vs/editor/common/services/resolverService",
        "node_modules/monaco-editor/esm/vs/editor/contrib/referenceSearch/referencesTree",
        "node_modules/monaco-editor/esm/vs/nls",
        "node_modules/monaco-editor/esm/vs/platform/contextkey/common/contextkey",
        "node_modules/monaco-editor/esm/vs/platform/instantiation/common/instantiation",
        "node_modules/monaco-editor/esm/vs/platform/label/common/label",
        "node_modules/monaco-editor/esm/vs/platform/list/browser/listService",
        "node_modules/monaco-editor/esm/vs/platform/theme/common/colorRegistry",
        "node_modules/monaco-editor/esm/vs/platform/theme/common/themeService",
        "node_modules/monaco-editor/esm/vs/editor/contrib/referenceSearch/peekViewWidget",
        "node_modules/monaco-editor/esm/vs/editor/contrib/referenceSearch/referencesModel",
        "node_modules/monaco-editor/esm/vs/base/browser/ui/splitview/splitview"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/contrib/referenceSearch/referencesController": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/nls",
        "node_modules/monaco-editor/esm/vs/base/common/errors",
        "node_modules/monaco-editor/esm/vs/base/common/lifecycle",
        "node_modules/monaco-editor/esm/vs/editor/browser/services/codeEditorService",
        "node_modules/monaco-editor/esm/vs/platform/instantiation/common/instantiation",
        "node_modules/monaco-editor/esm/vs/platform/contextkey/common/contextkey",
        "node_modules/monaco-editor/esm/vs/platform/configuration/common/configuration",
        "node_modules/monaco-editor/esm/vs/platform/storage/common/storage",
        "node_modules/monaco-editor/esm/vs/editor/contrib/referenceSearch/referencesWidget",
        "node_modules/monaco-editor/esm/vs/editor/common/core/range",
        "node_modules/monaco-editor/esm/vs/editor/common/core/position",
        "node_modules/monaco-editor/esm/vs/platform/notification/common/notification"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/contrib/goToDefinition/goToDefinition": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/arrays",
        "node_modules/monaco-editor/esm/vs/base/common/cancellation",
        "node_modules/monaco-editor/esm/vs/base/common/errors",
        "node_modules/monaco-editor/esm/vs/editor/browser/editorExtensions",
        "node_modules/monaco-editor/esm/vs/editor/common/modes"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/contrib/goToDefinition/goToDefinitionCommands": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/browser/ui/aria/aria",
        "node_modules/monaco-editor/esm/vs/base/common/async",
        "node_modules/monaco-editor/esm/vs/base/common/keyCodes",
        "node_modules/monaco-editor/esm/vs/base/common/platform",
        "node_modules/monaco-editor/esm/vs/editor/browser/editorExtensions",
        "node_modules/monaco-editor/esm/vs/editor/browser/services/codeEditorService",
        "node_modules/monaco-editor/esm/vs/editor/common/core/range",
        "node_modules/monaco-editor/esm/vs/editor/common/editorContextKeys",
        "node_modules/monaco-editor/esm/vs/editor/common/modes",
        "node_modules/monaco-editor/esm/vs/editor/contrib/message/messageController",
        "node_modules/monaco-editor/esm/vs/editor/contrib/referenceSearch/peekViewWidget",
        "node_modules/monaco-editor/esm/vs/editor/contrib/referenceSearch/referencesController",
        "node_modules/monaco-editor/esm/vs/editor/contrib/referenceSearch/referencesModel",
        "node_modules/monaco-editor/esm/vs/nls",
        "node_modules/monaco-editor/esm/vs/platform/actions/common/actions",
        "node_modules/monaco-editor/esm/vs/platform/contextkey/common/contextkey",
        "node_modules/monaco-editor/esm/vs/platform/notification/common/notification",
        "node_modules/monaco-editor/esm/vs/platform/progress/common/progress",
        "node_modules/monaco-editor/esm/vs/editor/contrib/goToDefinition/goToDefinition",
        "node_modules/monaco-editor/esm/vs/platform/commands/common/commands",
        "node_modules/monaco-editor/esm/vs/editor/browser/core/editorState"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/contrib/goToDefinition/clickLinkGesture": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/browser/browser",
        "node_modules/monaco-editor/esm/vs/base/common/lifecycle",
        "node_modules/monaco-editor/esm/vs/base/common/event",
        "node_modules/monaco-editor/esm/vs/base/common/platform"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/contrib/goToDefinition/goToDefinitionMouse": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/nls",
        "node_modules/monaco-editor/esm/vs/base/common/async",
        "node_modules/monaco-editor/esm/vs/base/common/errors",
        "node_modules/monaco-editor/esm/vs/base/common/htmlContent",
        "node_modules/monaco-editor/esm/vs/editor/common/services/modeService",
        "node_modules/monaco-editor/esm/vs/editor/common/core/range",
        "node_modules/monaco-editor/esm/vs/editor/common/modes",
        "node_modules/monaco-editor/esm/vs/editor/browser/editorExtensions",
        "node_modules/monaco-editor/esm/vs/editor/contrib/goToDefinition/goToDefinition",
        "node_modules/monaco-editor/esm/vs/base/common/lifecycle",
        "node_modules/monaco-editor/esm/vs/editor/common/services/resolverService",
        "node_modules/monaco-editor/esm/vs/platform/theme/common/themeService",
        "node_modules/monaco-editor/esm/vs/platform/theme/common/colorRegistry",
        "node_modules/monaco-editor/esm/vs/editor/browser/core/editorState",
        "node_modules/monaco-editor/esm/vs/editor/contrib/goToDefinition/goToDefinitionCommands",
        "node_modules/monaco-editor/esm/vs/editor/contrib/goToDefinition/clickLinkGesture",
        "node_modules/monaco-editor/esm/vs/editor/common/core/position",
        "node_modules/monaco-editor/esm/vs/base/common/types"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/contrib/gotoError/gotoErrorWidget": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/nls",
        "node_modules/monaco-editor/esm/vs/base/browser/dom",
        "node_modules/monaco-editor/esm/vs/base/common/lifecycle",
        "node_modules/monaco-editor/esm/vs/platform/markers/common/markers",
        "node_modules/monaco-editor/esm/vs/editor/common/core/range",
        "node_modules/monaco-editor/esm/vs/platform/theme/common/colorRegistry",
        "node_modules/monaco-editor/esm/vs/platform/theme/common/themeService",
        "node_modules/monaco-editor/esm/vs/base/common/color",
        "node_modules/monaco-editor/esm/vs/editor/common/view/editorColorRegistry",
        "node_modules/monaco-editor/esm/vs/base/browser/ui/scrollbar/scrollableElement",
        "node_modules/monaco-editor/esm/vs/base/common/labels",
        "node_modules/monaco-editor/esm/vs/base/common/arrays",
        "node_modules/monaco-editor/esm/vs/base/common/event",
        "node_modules/monaco-editor/esm/vs/editor/contrib/referenceSearch/peekViewWidget",
        "node_modules/monaco-editor/esm/vs/base/common/resources",
        "node_modules/monaco-editor/esm/vs/editor/contrib/referenceSearch/referencesWidget"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/contrib/gotoError/gotoError": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/nls",
        "node_modules/monaco-editor/esm/vs/base/common/event",
        "node_modules/monaco-editor/esm/vs/base/common/lifecycle",
        "node_modules/monaco-editor/esm/vs/platform/contextkey/common/contextkey",
        "node_modules/monaco-editor/esm/vs/platform/markers/common/markers",
        "node_modules/monaco-editor/esm/vs/editor/common/core/range",
        "node_modules/monaco-editor/esm/vs/editor/browser/editorExtensions",
        "node_modules/monaco-editor/esm/vs/platform/theme/common/themeService",
        "node_modules/monaco-editor/esm/vs/editor/common/editorContextKeys",
        "node_modules/monaco-editor/esm/vs/editor/contrib/gotoError/gotoErrorWidget",
        "node_modules/monaco-editor/esm/vs/base/common/strings",
        "node_modules/monaco-editor/esm/vs/base/common/arrays",
        "node_modules/monaco-editor/esm/vs/editor/browser/services/codeEditorService",
        "node_modules/monaco-editor/esm/vs/base/common/errors",
        "node_modules/monaco-editor/esm/vs/platform/actions/common/actions",
        "node_modules/monaco-editor/esm/vs/base/common/actions",
        "node_modules/monaco-editor/esm/vs/platform/keybinding/common/keybinding"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/contrib/colorPicker/colorPickerModel": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/event"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/contrib/colorPicker/colorPickerWidget": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/browser/browser",
        "node_modules/monaco-editor/esm/vs/base/browser/dom",
        "node_modules/monaco-editor/esm/vs/base/browser/globalMouseMoveMonitor",
        "node_modules/monaco-editor/esm/vs/base/browser/ui/widget",
        "node_modules/monaco-editor/esm/vs/base/common/color",
        "node_modules/monaco-editor/esm/vs/base/common/event",
        "node_modules/monaco-editor/esm/vs/base/common/lifecycle",
        "node_modules/monaco-editor/esm/vs/platform/theme/common/colorRegistry",
        "node_modules/monaco-editor/esm/vs/platform/theme/common/themeService"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/contrib/hover/getHover": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/arrays",
        "node_modules/monaco-editor/esm/vs/base/common/cancellation",
        "node_modules/monaco-editor/esm/vs/base/common/errors",
        "node_modules/monaco-editor/esm/vs/editor/browser/editorExtensions",
        "node_modules/monaco-editor/esm/vs/editor/common/modes"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/contrib/hover/hoverOperation": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/async",
        "node_modules/monaco-editor/esm/vs/base/common/errors"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/contrib/hover/hoverWidgets": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/browser/dom",
        "node_modules/monaco-editor/esm/vs/base/browser/ui/scrollbar/scrollableElement",
        "node_modules/monaco-editor/esm/vs/base/browser/ui/widget",
        "node_modules/monaco-editor/esm/vs/base/common/lifecycle"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/contrib/markdown/markdownRenderer": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/browser/htmlContentRenderer",
        "node_modules/monaco-editor/esm/vs/platform/opener/common/opener",
        "node_modules/monaco-editor/esm/vs/editor/common/services/modeService",
        "node_modules/monaco-editor/esm/vs/base/common/uri",
        "node_modules/monaco-editor/esm/vs/base/common/errors",
        "node_modules/monaco-editor/esm/vs/editor/common/modes/textToHtmlTokenizer",
        "node_modules/monaco-editor/esm/vs/platform/instantiation/common/instantiation",
        "node_modules/monaco-editor/esm/vs/base/common/event",
        "node_modules/monaco-editor/esm/vs/base/common/lifecycle",
        "node_modules/monaco-editor/esm/vs/editor/common/modes"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/contrib/hover/modesContentHover": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/nls",
        "node_modules/monaco-editor/esm/vs/base/browser/dom",
        "node_modules/monaco-editor/esm/vs/base/common/cancellation",
        "node_modules/monaco-editor/esm/vs/base/common/color",
        "node_modules/monaco-editor/esm/vs/base/common/htmlContent",
        "node_modules/monaco-editor/esm/vs/base/common/lifecycle",
        "node_modules/monaco-editor/esm/vs/editor/common/core/position",
        "node_modules/monaco-editor/esm/vs/editor/common/core/range",
        "node_modules/monaco-editor/esm/vs/editor/common/model/textModel",
        "node_modules/monaco-editor/esm/vs/editor/common/modes",
        "node_modules/monaco-editor/esm/vs/editor/contrib/colorPicker/color",
        "node_modules/monaco-editor/esm/vs/editor/contrib/colorPicker/colorDetector",
        "node_modules/monaco-editor/esm/vs/editor/contrib/colorPicker/colorPickerModel",
        "node_modules/monaco-editor/esm/vs/editor/contrib/colorPicker/colorPickerWidget",
        "node_modules/monaco-editor/esm/vs/editor/contrib/hover/getHover",
        "node_modules/monaco-editor/esm/vs/editor/contrib/hover/hoverOperation",
        "node_modules/monaco-editor/esm/vs/editor/contrib/hover/hoverWidgets",
        "node_modules/monaco-editor/esm/vs/editor/contrib/markdown/markdownRenderer",
        "node_modules/monaco-editor/esm/vs/base/common/arrays",
        "node_modules/monaco-editor/esm/vs/platform/markers/common/markers",
        "node_modules/monaco-editor/esm/vs/base/common/resources",
        "node_modules/monaco-editor/esm/vs/base/common/errors",
        "node_modules/monaco-editor/esm/vs/platform/opener/common/opener",
        "node_modules/monaco-editor/esm/vs/editor/contrib/gotoError/gotoError",
        "node_modules/monaco-editor/esm/vs/base/common/async",
        "node_modules/monaco-editor/esm/vs/editor/contrib/codeAction/codeAction",
        "node_modules/monaco-editor/esm/vs/editor/contrib/codeAction/codeActionCommands",
        "node_modules/monaco-editor/esm/vs/base/common/actions",
        "node_modules/monaco-editor/esm/vs/editor/contrib/codeAction/codeActionTrigger",
        "node_modules/monaco-editor/esm/vs/base/common/types"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/contrib/hover/modesGlyphHover": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/browser/dom",
        "node_modules/monaco-editor/esm/vs/base/common/htmlContent",
        "node_modules/monaco-editor/esm/vs/base/common/lifecycle",
        "node_modules/monaco-editor/esm/vs/editor/contrib/hover/hoverOperation",
        "node_modules/monaco-editor/esm/vs/editor/contrib/hover/hoverWidgets",
        "node_modules/monaco-editor/esm/vs/editor/contrib/markdown/markdownRenderer",
        "node_modules/monaco-editor/esm/vs/platform/opener/common/opener",
        "node_modules/monaco-editor/esm/vs/base/common/arrays"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/contrib/hover/hover": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/nls",
        "node_modules/monaco-editor/esm/vs/base/common/keyCodes",
        "node_modules/monaco-editor/esm/vs/base/common/lifecycle",
        "node_modules/monaco-editor/esm/vs/editor/browser/editorExtensions",
        "node_modules/monaco-editor/esm/vs/editor/common/core/range",
        "node_modules/monaco-editor/esm/vs/editor/common/editorContextKeys",
        "node_modules/monaco-editor/esm/vs/editor/common/services/modeService",
        "node_modules/monaco-editor/esm/vs/editor/contrib/hover/modesContentHover",
        "node_modules/monaco-editor/esm/vs/editor/contrib/hover/modesGlyphHover",
        "node_modules/monaco-editor/esm/vs/platform/opener/common/opener",
        "node_modules/monaco-editor/esm/vs/platform/theme/common/colorRegistry",
        "node_modules/monaco-editor/esm/vs/platform/theme/common/themeService",
        "node_modules/monaco-editor/esm/vs/editor/common/services/markersDecorationService",
        "node_modules/monaco-editor/esm/vs/platform/keybinding/common/keybinding",
        "node_modules/monaco-editor/esm/vs/platform/contextview/browser/contextView",
        "node_modules/monaco-editor/esm/vs/editor/browser/services/bulkEditService",
        "node_modules/monaco-editor/esm/vs/platform/commands/common/commands"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/contrib/inPlaceReplace/inPlaceReplaceCommand": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/editor/common/core/selection"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/contrib/inPlaceReplace/inPlaceReplace": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/nls",
        "node_modules/monaco-editor/esm/vs/editor/common/core/range",
        "node_modules/monaco-editor/esm/vs/editor/common/core/selection",
        "node_modules/monaco-editor/esm/vs/editor/common/editorContextKeys",
        "node_modules/monaco-editor/esm/vs/editor/browser/editorExtensions",
        "node_modules/monaco-editor/esm/vs/editor/common/services/editorWorkerService",
        "node_modules/monaco-editor/esm/vs/editor/contrib/inPlaceReplace/inPlaceReplaceCommand",
        "node_modules/monaco-editor/esm/vs/editor/browser/core/editorState",
        "node_modules/monaco-editor/esm/vs/platform/theme/common/themeService",
        "node_modules/monaco-editor/esm/vs/editor/common/view/editorColorRegistry",
        "node_modules/monaco-editor/esm/vs/editor/common/model/textModel",
        "node_modules/monaco-editor/esm/vs/base/common/async",
        "node_modules/monaco-editor/esm/vs/base/common/errors"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/common/commands/trimTrailingWhitespaceCommand": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/strings",
        "node_modules/monaco-editor/esm/vs/editor/common/core/editOperation",
        "node_modules/monaco-editor/esm/vs/editor/common/core/range"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/contrib/linesOperations/copyLinesCommand": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/editor/common/core/range",
        "node_modules/monaco-editor/esm/vs/editor/common/core/selection"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/contrib/indentation/indentUtils": {
      "type": "js",
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/contrib/linesOperations/moveLinesCommand": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/strings",
        "node_modules/monaco-editor/esm/vs/editor/common/commands/shiftCommand",
        "node_modules/monaco-editor/esm/vs/editor/common/core/range",
        "node_modules/monaco-editor/esm/vs/editor/common/core/selection",
        "node_modules/monaco-editor/esm/vs/editor/common/modes/languageConfiguration",
        "node_modules/monaco-editor/esm/vs/editor/common/modes/languageConfigurationRegistry",
        "node_modules/monaco-editor/esm/vs/editor/contrib/indentation/indentUtils"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/contrib/linesOperations/sortLinesCommand": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/editor/common/core/editOperation",
        "node_modules/monaco-editor/esm/vs/editor/common/core/range"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/contrib/linesOperations/linesOperations": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/nls",
        "node_modules/monaco-editor/esm/vs/base/common/keyCodes",
        "node_modules/monaco-editor/esm/vs/editor/browser/controller/coreCommands",
        "node_modules/monaco-editor/esm/vs/editor/browser/editorExtensions",
        "node_modules/monaco-editor/esm/vs/editor/common/commands/replaceCommand",
        "node_modules/monaco-editor/esm/vs/editor/common/commands/trimTrailingWhitespaceCommand",
        "node_modules/monaco-editor/esm/vs/editor/common/controller/cursorTypeOperations",
        "node_modules/monaco-editor/esm/vs/editor/common/core/editOperation",
        "node_modules/monaco-editor/esm/vs/editor/common/core/position",
        "node_modules/monaco-editor/esm/vs/editor/common/core/range",
        "node_modules/monaco-editor/esm/vs/editor/common/core/selection",
        "node_modules/monaco-editor/esm/vs/editor/common/editorContextKeys",
        "node_modules/monaco-editor/esm/vs/editor/contrib/linesOperations/copyLinesCommand",
        "node_modules/monaco-editor/esm/vs/editor/contrib/linesOperations/moveLinesCommand",
        "node_modules/monaco-editor/esm/vs/editor/contrib/linesOperations/sortLinesCommand"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/contrib/links/getLinks": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/cancellation",
        "node_modules/monaco-editor/esm/vs/base/common/errors",
        "node_modules/monaco-editor/esm/vs/base/common/uri",
        "node_modules/monaco-editor/esm/vs/editor/common/core/range",
        "node_modules/monaco-editor/esm/vs/editor/common/modes",
        "node_modules/monaco-editor/esm/vs/editor/common/services/modelService",
        "node_modules/monaco-editor/esm/vs/platform/commands/common/commands",
        "node_modules/monaco-editor/esm/vs/base/common/lifecycle",
        "node_modules/monaco-editor/esm/vs/base/common/arrays"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/contrib/links/links": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/nls",
        "node_modules/monaco-editor/esm/vs/base/common/async",
        "node_modules/monaco-editor/esm/vs/base/common/cancellation",
        "node_modules/monaco-editor/esm/vs/base/common/errors",
        "node_modules/monaco-editor/esm/vs/base/common/htmlContent",
        "node_modules/monaco-editor/esm/vs/base/common/lifecycle",
        "node_modules/monaco-editor/esm/vs/base/common/platform",
        "node_modules/monaco-editor/esm/vs/editor/browser/editorExtensions",
        "node_modules/monaco-editor/esm/vs/editor/common/model/textModel",
        "node_modules/monaco-editor/esm/vs/editor/common/modes",
        "node_modules/monaco-editor/esm/vs/editor/contrib/goToDefinition/clickLinkGesture",
        "node_modules/monaco-editor/esm/vs/editor/contrib/links/getLinks",
        "node_modules/monaco-editor/esm/vs/platform/notification/common/notification",
        "node_modules/monaco-editor/esm/vs/platform/opener/common/opener",
        "node_modules/monaco-editor/esm/vs/platform/theme/common/colorRegistry",
        "node_modules/monaco-editor/esm/vs/platform/theme/common/themeService"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/contrib/multicursor/multicursor": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/nls",
        "node_modules/monaco-editor/esm/vs/base/common/async",
        "node_modules/monaco-editor/esm/vs/base/common/keyCodes",
        "node_modules/monaco-editor/esm/vs/base/common/lifecycle",
        "node_modules/monaco-editor/esm/vs/editor/browser/editorExtensions",
        "node_modules/monaco-editor/esm/vs/editor/common/controller/cursorMoveCommands",
        "node_modules/monaco-editor/esm/vs/editor/common/core/range",
        "node_modules/monaco-editor/esm/vs/editor/common/core/selection",
        "node_modules/monaco-editor/esm/vs/editor/common/editorContextKeys",
        "node_modules/monaco-editor/esm/vs/editor/common/model",
        "node_modules/monaco-editor/esm/vs/editor/common/model/textModel",
        "node_modules/monaco-editor/esm/vs/editor/common/modes",
        "node_modules/monaco-editor/esm/vs/editor/contrib/find/findController",
        "node_modules/monaco-editor/esm/vs/platform/theme/common/colorRegistry",
        "node_modules/monaco-editor/esm/vs/platform/theme/common/themeService"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/contrib/parameterHints/provideSignatureHelp": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/async",
        "node_modules/monaco-editor/esm/vs/base/common/errors",
        "node_modules/monaco-editor/esm/vs/editor/browser/editorExtensions",
        "node_modules/monaco-editor/esm/vs/editor/common/modes",
        "node_modules/monaco-editor/esm/vs/platform/contextkey/common/contextkey",
        "node_modules/monaco-editor/esm/vs/base/common/cancellation"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/contrib/parameterHints/parameterHintsModel": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/async",
        "node_modules/monaco-editor/esm/vs/base/common/errors",
        "node_modules/monaco-editor/esm/vs/base/common/event",
        "node_modules/monaco-editor/esm/vs/base/common/lifecycle",
        "node_modules/monaco-editor/esm/vs/editor/common/core/characterClassifier",
        "node_modules/monaco-editor/esm/vs/editor/common/modes",
        "node_modules/monaco-editor/esm/vs/editor/contrib/parameterHints/provideSignatureHelp"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/contrib/parameterHints/parameterHintsWidget": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/browser/dom",
        "node_modules/monaco-editor/esm/vs/base/browser/event",
        "node_modules/monaco-editor/esm/vs/base/browser/ui/aria/aria",
        "node_modules/monaco-editor/esm/vs/base/browser/ui/scrollbar/scrollableElement",
        "node_modules/monaco-editor/esm/vs/base/common/event",
        "node_modules/monaco-editor/esm/vs/base/common/lifecycle",
        "node_modules/monaco-editor/esm/vs/editor/common/services/modeService",
        "node_modules/monaco-editor/esm/vs/editor/contrib/markdown/markdownRenderer",
        "node_modules/monaco-editor/esm/vs/editor/contrib/parameterHints/provideSignatureHelp",
        "node_modules/monaco-editor/esm/vs/nls",
        "node_modules/monaco-editor/esm/vs/platform/contextkey/common/contextkey",
        "node_modules/monaco-editor/esm/vs/platform/opener/common/opener",
        "node_modules/monaco-editor/esm/vs/platform/theme/common/colorRegistry",
        "node_modules/monaco-editor/esm/vs/platform/theme/common/themeService",
        "node_modules/monaco-editor/esm/vs/editor/contrib/parameterHints/parameterHintsModel"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/contrib/parameterHints/parameterHints": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/nls",
        "node_modules/monaco-editor/esm/vs/base/common/lifecycle",
        "node_modules/monaco-editor/esm/vs/platform/instantiation/common/instantiation",
        "node_modules/monaco-editor/esm/vs/editor/common/editorContextKeys",
        "node_modules/monaco-editor/esm/vs/platform/contextkey/common/contextkey",
        "node_modules/monaco-editor/esm/vs/editor/browser/editorExtensions",
        "node_modules/monaco-editor/esm/vs/editor/contrib/parameterHints/parameterHintsWidget",
        "node_modules/monaco-editor/esm/vs/editor/contrib/parameterHints/provideSignatureHelp",
        "node_modules/monaco-editor/esm/vs/editor/common/modes"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/contrib/referenceSearch/referenceSearch": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/nls",
        "node_modules/monaco-editor/esm/vs/platform/contextkey/common/contextkey",
        "node_modules/monaco-editor/esm/vs/platform/keybinding/common/keybindingsRegistry",
        "node_modules/monaco-editor/esm/vs/editor/common/core/position",
        "node_modules/monaco-editor/esm/vs/editor/browser/editorExtensions",
        "node_modules/monaco-editor/esm/vs/editor/common/modes",
        "node_modules/monaco-editor/esm/vs/editor/common/core/range",
        "node_modules/monaco-editor/esm/vs/editor/contrib/referenceSearch/peekViewWidget",
        "node_modules/monaco-editor/esm/vs/editor/contrib/referenceSearch/referencesController",
        "node_modules/monaco-editor/esm/vs/editor/contrib/referenceSearch/referencesModel",
        "node_modules/monaco-editor/esm/vs/base/common/async",
        "node_modules/monaco-editor/esm/vs/base/common/errors",
        "node_modules/monaco-editor/esm/vs/editor/common/editorContextKeys",
        "node_modules/monaco-editor/esm/vs/editor/browser/widget/embeddedCodeEditorWidget",
        "node_modules/monaco-editor/esm/vs/editor/browser/editorBrowser",
        "node_modules/monaco-editor/esm/vs/platform/list/browser/listService",
        "node_modules/monaco-editor/esm/vs/editor/contrib/referenceSearch/referencesWidget",
        "node_modules/monaco-editor/esm/vs/platform/commands/common/commands",
        "node_modules/monaco-editor/esm/vs/base/common/uri",
        "node_modules/monaco-editor/esm/vs/editor/browser/services/codeEditorService",
        "node_modules/monaco-editor/esm/vs/base/common/cancellation"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/contrib/rename/renameInputField": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/lifecycle",
        "node_modules/monaco-editor/esm/vs/editor/common/core/position",
        "node_modules/monaco-editor/esm/vs/editor/common/core/range",
        "node_modules/monaco-editor/esm/vs/nls",
        "node_modules/monaco-editor/esm/vs/platform/contextkey/common/contextkey",
        "node_modules/monaco-editor/esm/vs/platform/theme/common/colorRegistry"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/contrib/rename/rename": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/nls",
        "node_modules/monaco-editor/esm/vs/base/common/errors",
        "node_modules/monaco-editor/esm/vs/platform/contextkey/common/contextkey",
        "node_modules/monaco-editor/esm/vs/platform/progress/common/progress",
        "node_modules/monaco-editor/esm/vs/editor/browser/editorExtensions",
        "node_modules/monaco-editor/esm/vs/editor/common/editorContextKeys",
        "node_modules/monaco-editor/esm/vs/editor/contrib/rename/renameInputField",
        "node_modules/monaco-editor/esm/vs/platform/theme/common/themeService",
        "node_modules/monaco-editor/esm/vs/editor/common/modes",
        "node_modules/monaco-editor/esm/vs/editor/common/core/position",
        "node_modules/monaco-editor/esm/vs/base/browser/ui/aria/aria",
        "node_modules/monaco-editor/esm/vs/editor/common/core/range",
        "node_modules/monaco-editor/esm/vs/editor/contrib/message/messageController",
        "node_modules/monaco-editor/esm/vs/editor/browser/core/editorState",
        "node_modules/monaco-editor/esm/vs/platform/notification/common/notification",
        "node_modules/monaco-editor/esm/vs/editor/browser/services/bulkEditService",
        "node_modules/monaco-editor/esm/vs/base/common/uri",
        "node_modules/monaco-editor/esm/vs/editor/browser/services/codeEditorService",
        "node_modules/monaco-editor/esm/vs/base/common/cancellation",
        "node_modules/monaco-editor/esm/vs/base/common/lifecycle",
        "node_modules/monaco-editor/esm/vs/base/common/async"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/contrib/smartSelect/wordSelections": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/editor/common/core/range",
        "node_modules/monaco-editor/esm/vs/base/common/strings"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/contrib/smartSelect/bracketSelections": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/editor/common/core/position",
        "node_modules/monaco-editor/esm/vs/editor/common/core/range",
        "node_modules/monaco-editor/esm/vs/base/common/linkedList"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/contrib/smartSelect/smartSelect": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/arrays",
        "node_modules/monaco-editor/esm/vs/base/common/cancellation",
        "node_modules/monaco-editor/esm/vs/editor/browser/editorExtensions",
        "node_modules/monaco-editor/esm/vs/editor/common/core/position",
        "node_modules/monaco-editor/esm/vs/editor/common/core/range",
        "node_modules/monaco-editor/esm/vs/editor/common/core/selection",
        "node_modules/monaco-editor/esm/vs/editor/common/editorContextKeys",
        "node_modules/monaco-editor/esm/vs/editor/common/modes",
        "node_modules/monaco-editor/esm/vs/nls",
        "node_modules/monaco-editor/esm/vs/base/common/lifecycle",
        "node_modules/monaco-editor/esm/vs/editor/contrib/smartSelect/wordSelections",
        "node_modules/monaco-editor/esm/vs/editor/contrib/smartSelect/bracketSelections",
        "node_modules/monaco-editor/esm/vs/platform/commands/common/commands",
        "node_modules/monaco-editor/esm/vs/base/common/errors"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/contrib/suggest/suggest": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/async",
        "node_modules/monaco-editor/esm/vs/base/common/objects",
        "node_modules/monaco-editor/esm/vs/base/common/errors",
        "node_modules/monaco-editor/esm/vs/editor/browser/editorExtensions",
        "node_modules/monaco-editor/esm/vs/editor/common/modes",
        "node_modules/monaco-editor/esm/vs/platform/contextkey/common/contextkey",
        "node_modules/monaco-editor/esm/vs/base/common/cancellation",
        "node_modules/monaco-editor/esm/vs/editor/common/core/range",
        "node_modules/monaco-editor/esm/vs/base/common/filters"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/contrib/snippet/snippetParser": {
      "type": "js",
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/platform/workspaces/common/workspaces": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/uri"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/contrib/snippet/snippetVariables": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/nls",
        "node_modules/monaco-editor/esm/vs/base/common/path",
        "node_modules/monaco-editor/esm/vs/editor/contrib/snippet/snippetParser",
        "node_modules/monaco-editor/esm/vs/editor/common/modes/languageConfigurationRegistry",
        "node_modules/monaco-editor/esm/vs/base/common/strings",
        "node_modules/monaco-editor/esm/vs/platform/workspaces/common/workspaces"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/contrib/snippet/snippetSession": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/arrays",
        "node_modules/monaco-editor/esm/vs/base/common/lifecycle",
        "node_modules/monaco-editor/esm/vs/base/common/strings",
        "node_modules/monaco-editor/esm/vs/editor/common/core/editOperation",
        "node_modules/monaco-editor/esm/vs/editor/common/core/range",
        "node_modules/monaco-editor/esm/vs/editor/common/core/selection",
        "node_modules/monaco-editor/esm/vs/editor/common/model/textModel",
        "node_modules/monaco-editor/esm/vs/platform/clipboard/common/clipboardService",
        "node_modules/monaco-editor/esm/vs/platform/workspace/common/workspace",
        "node_modules/monaco-editor/esm/vs/platform/instantiation/common/instantiation",
        "node_modules/monaco-editor/esm/vs/editor/contrib/snippet/snippetParser",
        "node_modules/monaco-editor/esm/vs/editor/contrib/snippet/snippetVariables",
        "node_modules/monaco-editor/esm/vs/platform/theme/common/themeService",
        "node_modules/monaco-editor/esm/vs/platform/theme/common/colorRegistry"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/contrib/snippet/snippetController2": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/lifecycle",
        "node_modules/monaco-editor/esm/vs/base/common/strings",
        "node_modules/monaco-editor/esm/vs/editor/browser/editorExtensions",
        "node_modules/monaco-editor/esm/vs/editor/common/core/range",
        "node_modules/monaco-editor/esm/vs/editor/common/core/selection",
        "node_modules/monaco-editor/esm/vs/editor/common/editorContextKeys",
        "node_modules/monaco-editor/esm/vs/editor/contrib/suggest/suggest",
        "node_modules/monaco-editor/esm/vs/platform/contextkey/common/contextkey",
        "node_modules/monaco-editor/esm/vs/platform/log/common/log",
        "node_modules/monaco-editor/esm/vs/editor/contrib/snippet/snippetSession"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/contrib/suggest/suggestAlternatives": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/lifecycle",
        "node_modules/monaco-editor/esm/vs/platform/contextkey/common/contextkey"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/contrib/suggest/completionModel": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/filters",
        "node_modules/monaco-editor/esm/vs/base/common/lifecycle",
        "node_modules/monaco-editor/esm/vs/editor/common/config/editorOptions"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/contrib/suggest/wordDistance": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/arrays",
        "node_modules/monaco-editor/esm/vs/editor/common/core/range",
        "node_modules/monaco-editor/esm/vs/editor/contrib/smartSelect/bracketSelections"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/contrib/suggest/suggestModel": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/arrays",
        "node_modules/monaco-editor/esm/vs/base/common/async",
        "node_modules/monaco-editor/esm/vs/base/common/errors",
        "node_modules/monaco-editor/esm/vs/base/common/event",
        "node_modules/monaco-editor/esm/vs/base/common/lifecycle",
        "node_modules/monaco-editor/esm/vs/editor/common/core/selection",
        "node_modules/monaco-editor/esm/vs/editor/common/modes",
        "node_modules/monaco-editor/esm/vs/editor/contrib/suggest/completionModel",
        "node_modules/monaco-editor/esm/vs/editor/contrib/suggest/suggest",
        "node_modules/monaco-editor/esm/vs/editor/contrib/snippet/snippetController2",
        "node_modules/monaco-editor/esm/vs/base/common/cancellation",
        "node_modules/monaco-editor/esm/vs/editor/contrib/suggest/wordDistance"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/platform/files/common/files": {
      "type": "js",
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/common/services/getIconClasses": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/network",
        "node_modules/monaco-editor/esm/vs/base/common/resources",
        "node_modules/monaco-editor/esm/vs/editor/common/modes/modesRegistry",
        "node_modules/monaco-editor/esm/vs/platform/files/common/files"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/contrib/suggest/suggestWidget": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/nls",
        "node_modules/monaco-editor/esm/vs/base/common/filters",
        "node_modules/monaco-editor/esm/vs/base/common/strings",
        "node_modules/monaco-editor/esm/vs/base/common/event",
        "node_modules/monaco-editor/esm/vs/base/common/errors",
        "node_modules/monaco-editor/esm/vs/base/common/lifecycle",
        "node_modules/monaco-editor/esm/vs/base/browser/dom",
        "node_modules/monaco-editor/esm/vs/base/browser/ui/list/listWidget",
        "node_modules/monaco-editor/esm/vs/base/browser/ui/scrollbar/scrollableElement",
        "node_modules/monaco-editor/esm/vs/platform/keybinding/common/keybinding",
        "node_modules/monaco-editor/esm/vs/platform/contextkey/common/contextkey",
        "node_modules/monaco-editor/esm/vs/editor/contrib/suggest/suggest",
        "node_modules/monaco-editor/esm/vs/base/browser/ui/aria/aria",
        "node_modules/monaco-editor/esm/vs/platform/telemetry/common/telemetry",
        "node_modules/monaco-editor/esm/vs/platform/theme/common/styler",
        "node_modules/monaco-editor/esm/vs/platform/theme/common/themeService",
        "node_modules/monaco-editor/esm/vs/platform/theme/common/colorRegistry",
        "node_modules/monaco-editor/esm/vs/platform/storage/common/storage",
        "node_modules/monaco-editor/esm/vs/editor/contrib/markdown/markdownRenderer",
        "node_modules/monaco-editor/esm/vs/editor/common/services/modeService",
        "node_modules/monaco-editor/esm/vs/platform/opener/common/opener",
        "node_modules/monaco-editor/esm/vs/base/common/async",
        "node_modules/monaco-editor/esm/vs/base/common/cancellation",
        "node_modules/monaco-editor/esm/vs/editor/common/modes",
        "node_modules/monaco-editor/esm/vs/base/browser/ui/iconLabel/iconLabel",
        "node_modules/monaco-editor/esm/vs/editor/common/services/getIconClasses",
        "node_modules/monaco-editor/esm/vs/editor/common/services/modelService",
        "node_modules/monaco-editor/esm/vs/base/common/uri",
        "node_modules/monaco-editor/esm/vs/platform/instantiation/common/instantiation",
        "node_modules/monaco-editor/esm/vs/platform/files/common/files"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/contrib/suggest/wordContextKey": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/platform/contextkey/common/contextkey",
        "node_modules/monaco-editor/esm/vs/base/common/lifecycle"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/contrib/suggest/suggestController": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/browser/ui/aria/aria",
        "node_modules/monaco-editor/esm/vs/base/common/arrays",
        "node_modules/monaco-editor/esm/vs/base/common/errors",
        "node_modules/monaco-editor/esm/vs/base/common/lifecycle",
        "node_modules/monaco-editor/esm/vs/editor/browser/editorExtensions",
        "node_modules/monaco-editor/esm/vs/editor/common/core/editOperation",
        "node_modules/monaco-editor/esm/vs/editor/common/core/range",
        "node_modules/monaco-editor/esm/vs/editor/common/editorContextKeys",
        "node_modules/monaco-editor/esm/vs/editor/contrib/snippet/snippetController2",
        "node_modules/monaco-editor/esm/vs/editor/contrib/snippet/snippetParser",
        "node_modules/monaco-editor/esm/vs/editor/contrib/suggest/suggestMemory",
        "node_modules/monaco-editor/esm/vs/nls",
        "node_modules/monaco-editor/esm/vs/platform/commands/common/commands",
        "node_modules/monaco-editor/esm/vs/platform/contextkey/common/contextkey",
        "node_modules/monaco-editor/esm/vs/platform/instantiation/common/instantiation",
        "node_modules/monaco-editor/esm/vs/editor/contrib/suggest/suggest",
        "node_modules/monaco-editor/esm/vs/editor/contrib/suggest/suggestAlternatives",
        "node_modules/monaco-editor/esm/vs/editor/contrib/suggest/suggestModel",
        "node_modules/monaco-editor/esm/vs/editor/contrib/suggest/suggestWidget",
        "node_modules/monaco-editor/esm/vs/editor/contrib/suggest/wordContextKey",
        "node_modules/monaco-editor/esm/vs/base/common/event",
        "node_modules/monaco-editor/esm/vs/editor/common/services/editorWorkerService",
        "node_modules/monaco-editor/esm/vs/base/common/async",
        "node_modules/monaco-editor/esm/vs/editor/common/core/characterClassifier",
        "node_modules/monaco-editor/esm/vs/base/common/types"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/contrib/tokenization/tokenization": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/nls",
        "node_modules/monaco-editor/esm/vs/editor/browser/editorExtensions",
        "node_modules/monaco-editor/esm/vs/base/common/stopwatch"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/contrib/toggleTabFocusMode/toggleTabFocusMode": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/nls",
        "node_modules/monaco-editor/esm/vs/base/browser/ui/aria/aria",
        "node_modules/monaco-editor/esm/vs/editor/browser/editorExtensions",
        "node_modules/monaco-editor/esm/vs/editor/common/config/commonEditorConfig"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/contrib/wordHighlighter/wordHighlighter": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/nls",
        "node_modules/monaco-editor/esm/vs/base/common/arrays",
        "node_modules/monaco-editor/esm/vs/base/common/async",
        "node_modules/monaco-editor/esm/vs/base/common/cancellation",
        "node_modules/monaco-editor/esm/vs/base/common/errors",
        "node_modules/monaco-editor/esm/vs/base/common/lifecycle",
        "node_modules/monaco-editor/esm/vs/editor/browser/editorExtensions",
        "node_modules/monaco-editor/esm/vs/editor/common/core/range",
        "node_modules/monaco-editor/esm/vs/editor/common/editorContextKeys",
        "node_modules/monaco-editor/esm/vs/editor/common/model",
        "node_modules/monaco-editor/esm/vs/editor/common/model/textModel",
        "node_modules/monaco-editor/esm/vs/editor/common/modes",
        "node_modules/monaco-editor/esm/vs/platform/contextkey/common/contextkey",
        "node_modules/monaco-editor/esm/vs/platform/theme/common/colorRegistry",
        "node_modules/monaco-editor/esm/vs/platform/theme/common/themeService"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/contrib/wordOperations/wordOperations": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/editor/browser/editorExtensions",
        "node_modules/monaco-editor/esm/vs/editor/common/commands/replaceCommand",
        "node_modules/monaco-editor/esm/vs/editor/common/controller/cursorCommon",
        "node_modules/monaco-editor/esm/vs/editor/common/controller/cursorWordOperations",
        "node_modules/monaco-editor/esm/vs/editor/common/controller/wordCharacterClassifier",
        "node_modules/monaco-editor/esm/vs/editor/common/core/position",
        "node_modules/monaco-editor/esm/vs/editor/common/core/range",
        "node_modules/monaco-editor/esm/vs/editor/common/core/selection",
        "node_modules/monaco-editor/esm/vs/editor/common/editorContextKeys"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/contrib/wordPartOperations/wordPartOperations": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/editor/browser/editorExtensions",
        "node_modules/monaco-editor/esm/vs/editor/common/controller/cursorWordOperations",
        "node_modules/monaco-editor/esm/vs/editor/common/core/range",
        "node_modules/monaco-editor/esm/vs/editor/common/editorContextKeys",
        "node_modules/monaco-editor/esm/vs/editor/contrib/wordOperations/wordOperations",
        "node_modules/monaco-editor/esm/vs/platform/commands/common/commands"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/editor.all": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/editor/browser/controller/coreCommands",
        "node_modules/monaco-editor/esm/vs/editor/browser/widget/codeEditorWidget",
        "node_modules/monaco-editor/esm/vs/editor/browser/widget/diffEditorWidget",
        "node_modules/monaco-editor/esm/vs/editor/browser/widget/diffNavigator",
        "node_modules/monaco-editor/esm/vs/editor/contrib/bracketMatching/bracketMatching",
        "node_modules/monaco-editor/esm/vs/editor/contrib/caretOperations/caretOperations",
        "node_modules/monaco-editor/esm/vs/editor/contrib/caretOperations/transpose",
        "node_modules/monaco-editor/esm/vs/editor/contrib/clipboard/clipboard",
        "node_modules/monaco-editor/esm/vs/editor/contrib/codeAction/codeActionContributions",
        "node_modules/monaco-editor/esm/vs/editor/contrib/codelens/codelensController",
        "node_modules/monaco-editor/esm/vs/editor/contrib/colorPicker/colorDetector",
        "node_modules/monaco-editor/esm/vs/editor/contrib/comment/comment",
        "node_modules/monaco-editor/esm/vs/editor/contrib/contextmenu/contextmenu",
        "node_modules/monaco-editor/esm/vs/editor/contrib/cursorUndo/cursorUndo",
        "node_modules/monaco-editor/esm/vs/editor/contrib/dnd/dnd",
        "node_modules/monaco-editor/esm/vs/editor/contrib/find/findController",
        "node_modules/monaco-editor/esm/vs/editor/contrib/folding/folding",
        "node_modules/monaco-editor/esm/vs/editor/contrib/fontZoom/fontZoom",
        "node_modules/monaco-editor/esm/vs/editor/contrib/format/formatActions",
        "node_modules/monaco-editor/esm/vs/editor/contrib/goToDefinition/goToDefinitionCommands",
        "node_modules/monaco-editor/esm/vs/editor/contrib/goToDefinition/goToDefinitionMouse",
        "node_modules/monaco-editor/esm/vs/editor/contrib/gotoError/gotoError",
        "node_modules/monaco-editor/esm/vs/editor/contrib/hover/hover",
        "node_modules/monaco-editor/esm/vs/editor/contrib/inPlaceReplace/inPlaceReplace",
        "node_modules/monaco-editor/esm/vs/editor/contrib/linesOperations/linesOperations",
        "node_modules/monaco-editor/esm/vs/editor/contrib/links/links",
        "node_modules/monaco-editor/esm/vs/editor/contrib/multicursor/multicursor",
        "node_modules/monaco-editor/esm/vs/editor/contrib/parameterHints/parameterHints",
        "node_modules/monaco-editor/esm/vs/editor/contrib/referenceSearch/referenceSearch",
        "node_modules/monaco-editor/esm/vs/editor/contrib/rename/rename",
        "node_modules/monaco-editor/esm/vs/editor/contrib/smartSelect/smartSelect",
        "node_modules/monaco-editor/esm/vs/editor/contrib/snippet/snippetController2",
        "node_modules/monaco-editor/esm/vs/editor/contrib/suggest/suggestController",
        "node_modules/monaco-editor/esm/vs/editor/contrib/tokenization/tokenization",
        "node_modules/monaco-editor/esm/vs/editor/contrib/toggleTabFocusMode/toggleTabFocusMode",
        "node_modules/monaco-editor/esm/vs/editor/contrib/wordHighlighter/wordHighlighter",
        "node_modules/monaco-editor/esm/vs/editor/contrib/wordOperations/wordOperations",
        "node_modules/monaco-editor/esm/vs/editor/contrib/wordPartOperations/wordPartOperations",
        "node_modules/monaco-editor/esm/vs/editor/common/standaloneStrings"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/standalone/browser/accessibilityHelp/accessibilityHelp": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/browser/browser",
        "node_modules/monaco-editor/esm/vs/base/browser/dom",
        "node_modules/monaco-editor/esm/vs/base/browser/fastDomNode",
        "node_modules/monaco-editor/esm/vs/base/browser/htmlContentRenderer",
        "node_modules/monaco-editor/esm/vs/base/browser/ui/aria/aria",
        "node_modules/monaco-editor/esm/vs/base/browser/ui/widget",
        "node_modules/monaco-editor/esm/vs/base/common/lifecycle",
        "node_modules/monaco-editor/esm/vs/base/common/platform",
        "node_modules/monaco-editor/esm/vs/base/common/strings",
        "node_modules/monaco-editor/esm/vs/base/common/uri",
        "node_modules/monaco-editor/esm/vs/editor/browser/editorExtensions",
        "node_modules/monaco-editor/esm/vs/editor/common/editorContextKeys",
        "node_modules/monaco-editor/esm/vs/editor/contrib/toggleTabFocusMode/toggleTabFocusMode",
        "node_modules/monaco-editor/esm/vs/platform/contextkey/common/contextkey",
        "node_modules/monaco-editor/esm/vs/platform/instantiation/common/instantiation",
        "node_modules/monaco-editor/esm/vs/platform/keybinding/common/keybinding",
        "node_modules/monaco-editor/esm/vs/platform/opener/common/opener",
        "node_modules/monaco-editor/esm/vs/platform/theme/common/colorRegistry",
        "node_modules/monaco-editor/esm/vs/platform/theme/common/themeService",
        "node_modules/monaco-editor/esm/vs/editor/common/standaloneStrings"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/standalone/browser/iPadShowKeyboard/iPadShowKeyboard": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/browser/browser",
        "node_modules/monaco-editor/esm/vs/base/browser/dom",
        "node_modules/monaco-editor/esm/vs/base/common/lifecycle",
        "node_modules/monaco-editor/esm/vs/editor/browser/editorExtensions"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/standalone/browser/inspectTokens/inspectTokens": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/color",
        "node_modules/monaco-editor/esm/vs/base/common/lifecycle",
        "node_modules/monaco-editor/esm/vs/base/common/strings",
        "node_modules/monaco-editor/esm/vs/editor/browser/editorExtensions",
        "node_modules/monaco-editor/esm/vs/editor/common/modes",
        "node_modules/monaco-editor/esm/vs/editor/common/modes/nullMode",
        "node_modules/monaco-editor/esm/vs/editor/common/services/modeService",
        "node_modules/monaco-editor/esm/vs/editor/standalone/common/standaloneThemeService",
        "node_modules/monaco-editor/esm/vs/platform/theme/common/colorRegistry",
        "node_modules/monaco-editor/esm/vs/platform/theme/common/themeService",
        "node_modules/monaco-editor/esm/vs/editor/common/standaloneStrings"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/base/browser/ui/keybindingLabel/keybindingLabel": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/objects",
        "node_modules/monaco-editor/esm/vs/base/common/keybindingLabels",
        "node_modules/monaco-editor/esm/vs/base/browser/dom",
        "node_modules/monaco-editor/esm/vs/nls"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/base/parts/quickopen/browser/quickOpenModel": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/nls",
        "node_modules/monaco-editor/esm/vs/base/common/types",
        "node_modules/monaco-editor/esm/vs/base/browser/ui/iconLabel/iconLabel",
        "node_modules/monaco-editor/esm/vs/base/browser/ui/actionbar/actionbar",
        "node_modules/monaco-editor/esm/vs/base/browser/ui/highlightedlabel/highlightedLabel",
        "node_modules/monaco-editor/esm/vs/base/browser/dom",
        "node_modules/monaco-editor/esm/vs/base/browser/ui/keybindingLabel/keybindingLabel",
        "node_modules/monaco-editor/esm/vs/base/common/platform",
        "node_modules/monaco-editor/esm/vs/base/common/arrays"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/base/parts/quickopen/browser/quickOpenViewer": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/types"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/base/parts/tree/browser/treeDefaults": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/platform",
        "node_modules/monaco-editor/esm/vs/base/common/errors",
        "node_modules/monaco-editor/esm/vs/base/browser/dom",
        "node_modules/monaco-editor/esm/vs/base/common/keyCodes"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/base/parts/tree/browser/treeModel": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/assert",
        "node_modules/monaco-editor/esm/vs/base/common/errors",
        "node_modules/monaco-editor/esm/vs/base/common/lifecycle",
        "node_modules/monaco-editor/esm/vs/base/common/event"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/base/parts/tree/browser/treeDnd": {
      "type": "js",
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/base/parts/tree/browser/treeViewModel": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/iterator"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/base/parts/tree/browser/tree": {
      "type": "js",
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/base/parts/tree/browser/treeView": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/platform",
        "node_modules/monaco-editor/esm/vs/base/browser/browser",
        "node_modules/monaco-editor/esm/vs/base/common/lifecycle",
        "node_modules/monaco-editor/esm/vs/base/browser/dom",
        "node_modules/monaco-editor/esm/vs/base/common/diff/diff",
        "node_modules/monaco-editor/esm/vs/base/browser/touch",
        "node_modules/monaco-editor/esm/vs/base/common/strings",
        "node_modules/monaco-editor/esm/vs/base/browser/mouseEvent",
        "node_modules/monaco-editor/esm/vs/base/browser/keyboardEvent",
        "node_modules/monaco-editor/esm/vs/base/parts/tree/browser/treeDnd",
        "node_modules/monaco-editor/esm/vs/base/common/iterator",
        "node_modules/monaco-editor/esm/vs/base/browser/ui/scrollbar/scrollableElement",
        "node_modules/monaco-editor/esm/vs/base/parts/tree/browser/treeViewModel",
        "node_modules/monaco-editor/esm/vs/base/parts/tree/browser/tree",
        "node_modules/monaco-editor/esm/vs/base/common/event",
        "node_modules/monaco-editor/esm/vs/base/browser/dnd",
        "node_modules/monaco-editor/esm/vs/base/parts/tree/browser/treeDefaults",
        "node_modules/monaco-editor/esm/vs/base/common/async"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/base/parts/tree/browser/treeImpl": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/parts/tree/browser/treeDefaults",
        "node_modules/monaco-editor/esm/vs/base/parts/tree/browser/treeModel",
        "node_modules/monaco-editor/esm/vs/base/parts/tree/browser/treeView",
        "node_modules/monaco-editor/esm/vs/base/common/event",
        "node_modules/monaco-editor/esm/vs/base/common/color",
        "node_modules/monaco-editor/esm/vs/base/common/objects"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/base/browser/ui/progressbar/progressbar": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/lifecycle",
        "node_modules/monaco-editor/esm/vs/base/common/color",
        "node_modules/monaco-editor/esm/vs/base/common/objects",
        "node_modules/monaco-editor/esm/vs/base/browser/dom",
        "node_modules/monaco-editor/esm/vs/base/common/async"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/base/parts/quickopen/browser/quickOpenWidget": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/nls",
        "node_modules/monaco-editor/esm/vs/base/common/platform",
        "node_modules/monaco-editor/esm/vs/base/common/types",
        "node_modules/monaco-editor/esm/vs/base/parts/quickopen/browser/quickOpenViewer",
        "node_modules/monaco-editor/esm/vs/base/browser/ui/inputbox/inputBox",
        "node_modules/monaco-editor/esm/vs/base/parts/tree/browser/treeImpl",
        "node_modules/monaco-editor/esm/vs/base/browser/ui/progressbar/progressbar",
        "node_modules/monaco-editor/esm/vs/base/browser/keyboardEvent",
        "node_modules/monaco-editor/esm/vs/base/parts/tree/browser/treeDefaults",
        "node_modules/monaco-editor/esm/vs/base/browser/dom",
        "node_modules/monaco-editor/esm/vs/base/common/lifecycle",
        "node_modules/monaco-editor/esm/vs/base/common/color",
        "node_modules/monaco-editor/esm/vs/base/common/objects",
        "node_modules/monaco-editor/esm/vs/base/browser/mouseEvent"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/standalone/browser/quickOpen/quickOpenEditorWidget": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/browser/dom",
        "node_modules/monaco-editor/esm/vs/base/parts/quickopen/browser/quickOpenWidget",
        "node_modules/monaco-editor/esm/vs/platform/theme/common/colorRegistry",
        "node_modules/monaco-editor/esm/vs/platform/theme/common/styler"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/standalone/browser/quickOpen/editorQuickOpen": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/editor/browser/editorExtensions",
        "node_modules/monaco-editor/esm/vs/editor/common/model/textModel",
        "node_modules/monaco-editor/esm/vs/editor/standalone/browser/quickOpen/quickOpenEditorWidget",
        "node_modules/monaco-editor/esm/vs/platform/theme/common/themeService"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/standalone/browser/quickOpen/gotoLine": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/strings",
        "node_modules/monaco-editor/esm/vs/base/parts/quickopen/browser/quickOpenModel",
        "node_modules/monaco-editor/esm/vs/editor/browser/editorBrowser",
        "node_modules/monaco-editor/esm/vs/editor/browser/editorExtensions",
        "node_modules/monaco-editor/esm/vs/editor/common/core/position",
        "node_modules/monaco-editor/esm/vs/editor/common/core/range",
        "node_modules/monaco-editor/esm/vs/editor/common/editorContextKeys",
        "node_modules/monaco-editor/esm/vs/editor/standalone/browser/quickOpen/editorQuickOpen",
        "node_modules/monaco-editor/esm/vs/editor/common/standaloneStrings"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/standalone/browser/quickOpen/quickCommand": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/strings",
        "node_modules/monaco-editor/esm/vs/base/browser/browser",
        "node_modules/monaco-editor/esm/vs/base/common/errors",
        "node_modules/monaco-editor/esm/vs/base/common/filters",
        "node_modules/monaco-editor/esm/vs/base/parts/quickopen/browser/quickOpenModel",
        "node_modules/monaco-editor/esm/vs/editor/browser/editorExtensions",
        "node_modules/monaco-editor/esm/vs/editor/common/editorContextKeys",
        "node_modules/monaco-editor/esm/vs/editor/standalone/browser/quickOpen/editorQuickOpen",
        "node_modules/monaco-editor/esm/vs/platform/keybinding/common/keybinding",
        "node_modules/monaco-editor/esm/vs/editor/common/standaloneStrings"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/contrib/quickOpen/quickOpen": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/errors",
        "node_modules/monaco-editor/esm/vs/base/common/uri",
        "node_modules/monaco-editor/esm/vs/editor/common/core/range",
        "node_modules/monaco-editor/esm/vs/editor/browser/editorExtensions",
        "node_modules/monaco-editor/esm/vs/editor/common/modes",
        "node_modules/monaco-editor/esm/vs/editor/common/services/modelService",
        "node_modules/monaco-editor/esm/vs/base/common/cancellation",
        "node_modules/monaco-editor/esm/vs/editor/common/services/resolverService"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/standalone/browser/quickOpen/quickOutline": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/base/common/cancellation",
        "node_modules/monaco-editor/esm/vs/base/common/filters",
        "node_modules/monaco-editor/esm/vs/base/common/strings",
        "node_modules/monaco-editor/esm/vs/base/parts/quickopen/browser/quickOpenModel",
        "node_modules/monaco-editor/esm/vs/editor/browser/editorExtensions",
        "node_modules/monaco-editor/esm/vs/editor/common/core/range",
        "node_modules/monaco-editor/esm/vs/editor/common/editorContextKeys",
        "node_modules/monaco-editor/esm/vs/editor/common/modes",
        "node_modules/monaco-editor/esm/vs/editor/contrib/quickOpen/quickOpen",
        "node_modules/monaco-editor/esm/vs/editor/standalone/browser/quickOpen/editorQuickOpen",
        "node_modules/monaco-editor/esm/vs/editor/common/standaloneStrings"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/standalone/browser/referenceSearch/standaloneReferenceSearch": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/editor/browser/editorExtensions",
        "node_modules/monaco-editor/esm/vs/editor/browser/services/codeEditorService",
        "node_modules/monaco-editor/esm/vs/editor/contrib/referenceSearch/referencesController",
        "node_modules/monaco-editor/esm/vs/platform/configuration/common/configuration",
        "node_modules/monaco-editor/esm/vs/platform/contextkey/common/contextkey",
        "node_modules/monaco-editor/esm/vs/platform/instantiation/common/instantiation",
        "node_modules/monaco-editor/esm/vs/platform/notification/common/notification",
        "node_modules/monaco-editor/esm/vs/platform/storage/common/storage"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/standalone/browser/toggleHighContrast/toggleHighContrast": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/editor/browser/editorExtensions",
        "node_modules/monaco-editor/esm/vs/editor/standalone/common/standaloneThemeService",
        "node_modules/monaco-editor/esm/vs/editor/common/standaloneStrings"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/edcore.main": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/editor/editor.all",
        "node_modules/monaco-editor/esm/vs/editor/standalone/browser/accessibilityHelp/accessibilityHelp",
        "node_modules/monaco-editor/esm/vs/editor/standalone/browser/iPadShowKeyboard/iPadShowKeyboard",
        "node_modules/monaco-editor/esm/vs/editor/standalone/browser/inspectTokens/inspectTokens",
        "node_modules/monaco-editor/esm/vs/editor/standalone/browser/quickOpen/gotoLine",
        "node_modules/monaco-editor/esm/vs/editor/standalone/browser/quickOpen/quickCommand",
        "node_modules/monaco-editor/esm/vs/editor/standalone/browser/quickOpen/quickOutline",
        "node_modules/monaco-editor/esm/vs/editor/standalone/browser/referenceSearch/standaloneReferenceSearch",
        "node_modules/monaco-editor/esm/vs/editor/standalone/browser/toggleHighContrast/toggleHighContrast",
        "node_modules/monaco-editor/esm/vs/editor/editor.api"
      ],
      "pkg": "p5"
    },
    "node_modules/monaco-editor/esm/vs/editor/editor.main": {
      "type": "js",
      "deps": [
        "node_modules/monaco-editor/esm/vs/language/typescript/monaco.contribution",
        "node_modules/monaco-editor/esm/vs/language/css/monaco.contribution",
        "node_modules/monaco-editor/esm/vs/language/json/monaco.contribution",
        "node_modules/monaco-editor/esm/vs/language/html/monaco.contribution",
        "node_modules/monaco-editor/esm/vs/basic-languages/monaco.contribution",
        "node_modules/monaco-editor/esm/vs/editor/edcore.main"
      ],
      "pkg": "p5"
    },
    "node_modules/echarts/lib/config": {
      "type": "js",
      "pkg": "p2"
    },
    "node_modules/zrender/lib/core/guid": {
      "type": "js",
      "pkg": "p2"
    },
    "node_modules/zrender/lib/core/env": {
      "type": "js",
      "pkg": "p2"
    },
    "node_modules/zrender/lib/core/util": {
      "type": "js",
      "pkg": "p2"
    },
    "node_modules/zrender/lib/core/vector": {
      "type": "js",
      "pkg": "p2"
    },
    "node_modules/zrender/lib/mixin/Draggable": {
      "type": "js",
      "pkg": "p2"
    },
    "node_modules/zrender/lib/mixin/Eventful": {
      "type": "js",
      "pkg": "p2"
    },
    "node_modules/zrender/lib/core/fourPointsTransform": {
      "type": "js",
      "pkg": "p2"
    },
    "node_modules/zrender/lib/core/event": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/mixin/Eventful",
        "node_modules/zrender/lib/core/env",
        "node_modules/zrender/lib/core/fourPointsTransform"
      ],
      "pkg": "p2"
    },
    "node_modules/zrender/lib/core/GestureMgr": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/event"
      ],
      "pkg": "p2"
    },
    "node_modules/zrender/lib/Handler": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util",
        "node_modules/zrender/lib/core/vector",
        "node_modules/zrender/lib/mixin/Draggable",
        "node_modules/zrender/lib/mixin/Eventful",
        "node_modules/zrender/lib/core/event",
        "node_modules/zrender/lib/core/GestureMgr"
      ],
      "pkg": "p2"
    },
    "node_modules/zrender/lib/core/matrix": {
      "type": "js",
      "pkg": "p2"
    },
    "node_modules/zrender/lib/mixin/Transformable": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/matrix",
        "node_modules/zrender/lib/core/vector"
      ],
      "pkg": "p2"
    },
    "node_modules/zrender/lib/animation/easing": {
      "type": "js",
      "pkg": "p2"
    },
    "node_modules/zrender/lib/animation/Clip": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/animation/easing"
      ],
      "pkg": "p2"
    },
    "node_modules/zrender/lib/core/LRU": {
      "type": "js",
      "pkg": "p2"
    },
    "node_modules/zrender/lib/tool/color": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/LRU"
      ],
      "pkg": "p2"
    },
    "node_modules/zrender/lib/animation/Animator": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/animation/Clip",
        "node_modules/zrender/lib/tool/color",
        "node_modules/zrender/lib/core/util"
      ],
      "pkg": "p2"
    },
    "node_modules/zrender/lib/config": {
      "type": "js",
      "pkg": "p2"
    },
    "node_modules/zrender/lib/core/log": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/config"
      ],
      "pkg": "p2"
    },
    "node_modules/zrender/lib/mixin/Animatable": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/animation/Animator",
        "node_modules/zrender/lib/core/log",
        "node_modules/zrender/lib/core/util"
      ],
      "pkg": "p2"
    },
    "node_modules/zrender/lib/Element": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/guid",
        "node_modules/zrender/lib/mixin/Eventful",
        "node_modules/zrender/lib/mixin/Transformable",
        "node_modules/zrender/lib/mixin/Animatable",
        "node_modules/zrender/lib/core/util"
      ],
      "pkg": "p2"
    },
    "node_modules/zrender/lib/core/BoundingRect": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/vector",
        "node_modules/zrender/lib/core/matrix"
      ],
      "pkg": "p2"
    },
    "node_modules/zrender/lib/container/Group": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util",
        "node_modules/zrender/lib/Element",
        "node_modules/zrender/lib/core/BoundingRect"
      ],
      "pkg": "p2"
    },
    "node_modules/zrender/lib/core/timsort": {
      "type": "js",
      "pkg": "p2"
    },
    "node_modules/zrender/lib/Storage": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util",
        "node_modules/zrender/lib/core/env",
        "node_modules/zrender/lib/container/Group",
        "node_modules/zrender/lib/core/timsort"
      ],
      "pkg": "p2"
    },
    "node_modules/zrender/lib/graphic/helper/fixShadow": {
      "type": "js",
      "pkg": "p2"
    },
    "node_modules/zrender/lib/graphic/constant": {
      "type": "js",
      "pkg": "p2"
    },
    "node_modules/zrender/lib/graphic/Style": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/graphic/helper/fixShadow",
        "node_modules/zrender/lib/graphic/constant"
      ],
      "pkg": "p2"
    },
    "node_modules/zrender/lib/graphic/Pattern": {
      "type": "js",
      "pkg": "p2"
    },
    "node_modules/zrender/lib/Layer": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util",
        "node_modules/zrender/lib/config",
        "node_modules/zrender/lib/graphic/Style",
        "node_modules/zrender/lib/graphic/Pattern"
      ],
      "pkg": "p2"
    },
    "node_modules/zrender/lib/animation/requestAnimationFrame": {
      "type": "js",
      "pkg": "p2"
    },
    "node_modules/zrender/lib/graphic/helper/image": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/LRU"
      ],
      "pkg": "p2"
    },
    "node_modules/zrender/lib/contain/text": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/BoundingRect",
        "node_modules/zrender/lib/graphic/helper/image",
        "node_modules/zrender/lib/core/util"
      ],
      "pkg": "p2"
    },
    "node_modules/zrender/lib/graphic/helper/roundRect": {
      "type": "js",
      "pkg": "p2"
    },
    "node_modules/zrender/lib/graphic/helper/text": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util",
        "node_modules/zrender/lib/contain/text",
        "node_modules/zrender/lib/graphic/helper/roundRect",
        "node_modules/zrender/lib/graphic/helper/image",
        "node_modules/zrender/lib/graphic/helper/fixShadow",
        "node_modules/zrender/lib/graphic/constant"
      ],
      "pkg": "p2"
    },
    "node_modules/zrender/lib/graphic/mixin/RectText": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/graphic/helper/text",
        "node_modules/zrender/lib/core/BoundingRect",
        "node_modules/zrender/lib/graphic/constant"
      ],
      "pkg": "p2"
    },
    "node_modules/zrender/lib/graphic/Displayable": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util",
        "node_modules/zrender/lib/graphic/Style",
        "node_modules/zrender/lib/Element",
        "node_modules/zrender/lib/graphic/mixin/RectText"
      ],
      "pkg": "p2"
    },
    "node_modules/zrender/lib/graphic/Image": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/graphic/Displayable",
        "node_modules/zrender/lib/core/BoundingRect",
        "node_modules/zrender/lib/core/util",
        "node_modules/zrender/lib/graphic/helper/image"
      ],
      "pkg": "p2"
    },
    "node_modules/zrender/lib/Painter": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/config",
        "node_modules/zrender/lib/core/util",
        "node_modules/zrender/lib/core/log",
        "node_modules/zrender/lib/core/BoundingRect",
        "node_modules/zrender/lib/core/timsort",
        "node_modules/zrender/lib/Layer",
        "node_modules/zrender/lib/animation/requestAnimationFrame",
        "node_modules/zrender/lib/graphic/Image",
        "node_modules/zrender/lib/core/env"
      ],
      "pkg": "p2"
    },
    "node_modules/zrender/lib/animation/Animation": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util",
        "node_modules/zrender/lib/core/event",
        "node_modules/zrender/lib/animation/requestAnimationFrame",
        "node_modules/zrender/lib/animation/Animator"
      ],
      "pkg": "p2"
    },
    "node_modules/zrender/lib/dom/HandlerProxy": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/event",
        "node_modules/zrender/lib/core/util",
        "node_modules/zrender/lib/mixin/Eventful",
        "node_modules/zrender/lib/core/env"
      ],
      "pkg": "p2"
    },
    "node_modules/zrender/lib/zrender": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/guid",
        "node_modules/zrender/lib/core/env",
        "node_modules/zrender/lib/core/util",
        "node_modules/zrender/lib/Handler",
        "node_modules/zrender/lib/Storage",
        "node_modules/zrender/lib/Painter",
        "node_modules/zrender/lib/animation/Animation",
        "node_modules/zrender/lib/dom/HandlerProxy"
      ],
      "pkg": "p2"
    },
    "node_modules/zrender/lib/core/curve": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/vector"
      ],
      "pkg": "p2"
    },
    "node_modules/zrender/lib/core/bbox": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/vector",
        "node_modules/zrender/lib/core/curve"
      ],
      "pkg": "p2"
    },
    "node_modules/zrender/lib/core/PathProxy": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/curve",
        "node_modules/zrender/lib/core/vector",
        "node_modules/zrender/lib/core/bbox",
        "node_modules/zrender/lib/core/BoundingRect",
        "node_modules/zrender/lib/config"
      ],
      "pkg": "p2"
    },
    "node_modules/zrender/lib/contain/line": {
      "type": "js",
      "pkg": "p2"
    },
    "node_modules/zrender/lib/contain/cubic": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/curve"
      ],
      "pkg": "p2"
    },
    "node_modules/zrender/lib/contain/quadratic": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/curve"
      ],
      "pkg": "p2"
    },
    "node_modules/zrender/lib/contain/util": {
      "type": "js",
      "pkg": "p2"
    },
    "node_modules/zrender/lib/contain/arc": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/contain/util"
      ],
      "pkg": "p2"
    },
    "node_modules/zrender/lib/contain/windingLine": {
      "type": "js",
      "pkg": "p2"
    },
    "node_modules/zrender/lib/contain/path": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/PathProxy",
        "node_modules/zrender/lib/contain/line",
        "node_modules/zrender/lib/contain/cubic",
        "node_modules/zrender/lib/contain/quadratic",
        "node_modules/zrender/lib/contain/arc",
        "node_modules/zrender/lib/contain/util",
        "node_modules/zrender/lib/core/curve",
        "node_modules/zrender/lib/contain/windingLine"
      ],
      "pkg": "p2"
    },
    "node_modules/zrender/lib/graphic/Path": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/graphic/Displayable",
        "node_modules/zrender/lib/core/util",
        "node_modules/zrender/lib/core/PathProxy",
        "node_modules/zrender/lib/contain/path",
        "node_modules/zrender/lib/graphic/Pattern"
      ],
      "pkg": "p2"
    },
    "node_modules/zrender/lib/tool/transformPath": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/PathProxy",
        "node_modules/zrender/lib/core/vector"
      ],
      "pkg": "p2"
    },
    "node_modules/zrender/lib/tool/path": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/graphic/Path",
        "node_modules/zrender/lib/core/PathProxy",
        "node_modules/zrender/lib/tool/transformPath"
      ],
      "pkg": "p2"
    },
    "node_modules/zrender/lib/graphic/Text": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/graphic/Displayable",
        "node_modules/zrender/lib/core/util",
        "node_modules/zrender/lib/contain/text",
        "node_modules/zrender/lib/graphic/helper/text",
        "node_modules/zrender/lib/graphic/constant"
      ],
      "pkg": "p2"
    },
    "node_modules/zrender/lib/graphic/shape/Circle": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/graphic/Path"
      ],
      "pkg": "p2"
    },
    "node_modules/zrender/lib/graphic/helper/subPixelOptimize": {
      "type": "js",
      "pkg": "p2"
    },
    "node_modules/zrender/lib/graphic/shape/Rect": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/graphic/Path",
        "node_modules/zrender/lib/graphic/helper/roundRect",
        "node_modules/zrender/lib/graphic/helper/subPixelOptimize"
      ],
      "pkg": "p2"
    },
    "node_modules/zrender/lib/graphic/shape/Ellipse": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/graphic/Path"
      ],
      "pkg": "p2"
    },
    "node_modules/zrender/lib/graphic/shape/Line": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/graphic/Path",
        "node_modules/zrender/lib/graphic/helper/subPixelOptimize"
      ],
      "pkg": "p2"
    },
    "node_modules/zrender/lib/graphic/helper/smoothSpline": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/vector"
      ],
      "pkg": "p2"
    },
    "node_modules/zrender/lib/graphic/helper/smoothBezier": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/vector"
      ],
      "pkg": "p2"
    },
    "node_modules/zrender/lib/graphic/helper/poly": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/graphic/helper/smoothSpline",
        "node_modules/zrender/lib/graphic/helper/smoothBezier"
      ],
      "pkg": "p2"
    },
    "node_modules/zrender/lib/graphic/shape/Polygon": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/graphic/Path",
        "node_modules/zrender/lib/graphic/helper/poly"
      ],
      "pkg": "p2"
    },
    "node_modules/zrender/lib/graphic/shape/Polyline": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/graphic/Path",
        "node_modules/zrender/lib/graphic/helper/poly"
      ],
      "pkg": "p2"
    },
    "node_modules/zrender/lib/graphic/Gradient": {
      "type": "js",
      "pkg": "p2"
    },
    "node_modules/zrender/lib/graphic/LinearGradient": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util",
        "node_modules/zrender/lib/graphic/Gradient"
      ],
      "pkg": "p2"
    },
    "node_modules/zrender/lib/tool/parseSVG": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/container/Group",
        "node_modules/zrender/lib/graphic/Image",
        "node_modules/zrender/lib/graphic/Text",
        "node_modules/zrender/lib/graphic/shape/Circle",
        "node_modules/zrender/lib/graphic/shape/Rect",
        "node_modules/zrender/lib/graphic/shape/Ellipse",
        "node_modules/zrender/lib/graphic/shape/Line",
        "node_modules/zrender/lib/graphic/Path",
        "node_modules/zrender/lib/graphic/shape/Polygon",
        "node_modules/zrender/lib/graphic/shape/Polyline",
        "node_modules/zrender/lib/graphic/LinearGradient",
        "node_modules/zrender/lib/graphic/Style",
        "node_modules/zrender/lib/core/matrix",
        "node_modules/zrender/lib/tool/path",
        "node_modules/zrender/lib/core/util"
      ],
      "pkg": "p2"
    },
    "node_modules/zrender/lib/graphic/CompoundPath": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/graphic/Path"
      ],
      "pkg": "p2"
    },
    "node_modules/zrender/lib/graphic/IncrementalDisplayable": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util",
        "node_modules/zrender/lib/graphic/Displayable",
        "node_modules/zrender/lib/core/BoundingRect"
      ],
      "pkg": "p2"
    },
    "node_modules/zrender/lib/graphic/shape/Arc": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/graphic/Path"
      ],
      "pkg": "p2"
    },
    "node_modules/zrender/lib/graphic/shape/BezierCurve": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/graphic/Path",
        "node_modules/zrender/lib/core/vector",
        "node_modules/zrender/lib/core/curve"
      ],
      "pkg": "p2"
    },
    "node_modules/zrender/lib/graphic/shape/Droplet": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/graphic/Path"
      ],
      "pkg": "p2"
    },
    "node_modules/zrender/lib/graphic/shape/Heart": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/graphic/Path"
      ],
      "pkg": "p2"
    },
    "node_modules/zrender/lib/graphic/shape/Isogon": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/graphic/Path"
      ],
      "pkg": "p2"
    },
    "node_modules/zrender/lib/graphic/shape/Ring": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/graphic/Path"
      ],
      "pkg": "p2"
    },
    "node_modules/zrender/lib/graphic/shape/Rose": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/graphic/Path"
      ],
      "pkg": "p2"
    },
    "node_modules/zrender/lib/graphic/helper/fixClipWithShadow": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/env"
      ],
      "pkg": "p2"
    },
    "node_modules/zrender/lib/graphic/shape/Sector": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/graphic/Path",
        "node_modules/zrender/lib/graphic/helper/fixClipWithShadow"
      ],
      "pkg": "p2"
    },
    "node_modules/zrender/lib/graphic/shape/Star": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/graphic/Path"
      ],
      "pkg": "p2"
    },
    "node_modules/zrender/lib/graphic/shape/Trochoid": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/graphic/Path"
      ],
      "pkg": "p2"
    },
    "node_modules/zrender/lib/graphic/RadialGradient": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util",
        "node_modules/zrender/lib/graphic/Gradient"
      ],
      "pkg": "p2"
    },
    "node_modules/zrender/lib/export": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util",
        "node_modules/zrender/lib/core/matrix",
        "node_modules/zrender/lib/core/vector",
        "node_modules/zrender/lib/tool/color",
        "node_modules/zrender/lib/tool/path",
        "node_modules/zrender/lib/tool/parseSVG",
        "node_modules/zrender/lib/container/Group",
        "node_modules/zrender/lib/graphic/Path",
        "node_modules/zrender/lib/graphic/Image",
        "node_modules/zrender/lib/graphic/CompoundPath",
        "node_modules/zrender/lib/graphic/Text",
        "node_modules/zrender/lib/graphic/IncrementalDisplayable",
        "node_modules/zrender/lib/graphic/shape/Arc",
        "node_modules/zrender/lib/graphic/shape/BezierCurve",
        "node_modules/zrender/lib/graphic/shape/Circle",
        "node_modules/zrender/lib/graphic/shape/Droplet",
        "node_modules/zrender/lib/graphic/shape/Ellipse",
        "node_modules/zrender/lib/graphic/shape/Heart",
        "node_modules/zrender/lib/graphic/shape/Isogon",
        "node_modules/zrender/lib/graphic/shape/Line",
        "node_modules/zrender/lib/graphic/shape/Polygon",
        "node_modules/zrender/lib/graphic/shape/Polyline",
        "node_modules/zrender/lib/graphic/shape/Rect",
        "node_modules/zrender/lib/graphic/shape/Ring",
        "node_modules/zrender/lib/graphic/shape/Rose",
        "node_modules/zrender/lib/graphic/shape/Sector",
        "node_modules/zrender/lib/graphic/shape/Star",
        "node_modules/zrender/lib/graphic/shape/Trochoid",
        "node_modules/zrender/lib/graphic/LinearGradient",
        "node_modules/zrender/lib/graphic/RadialGradient",
        "node_modules/zrender/lib/graphic/Pattern",
        "node_modules/zrender/lib/core/BoundingRect"
      ],
      "pkg": "p2"
    },
    "node_modules/zrender/lib/svg/core": {
      "type": "js",
      "pkg": "p2"
    },
    "node_modules/zrender/lib/svg/graphic": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/svg/core",
        "node_modules/zrender/lib/core/PathProxy",
        "node_modules/zrender/lib/core/BoundingRect",
        "node_modules/zrender/lib/core/matrix",
        "node_modules/zrender/lib/contain/text",
        "node_modules/zrender/lib/graphic/helper/text",
        "node_modules/zrender/lib/graphic/Text"
      ],
      "pkg": "p2"
    },
    "node_modules/zrender/lib/core/arrayDiff2": {
      "type": "js",
      "pkg": "p2"
    },
    "node_modules/zrender/lib/svg/helper/Definable": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/svg/core",
        "node_modules/zrender/lib/core/util",
        "node_modules/zrender/lib/graphic/Path",
        "node_modules/zrender/lib/graphic/Image",
        "node_modules/zrender/lib/graphic/Text",
        "node_modules/zrender/lib/svg/graphic"
      ],
      "pkg": "p2"
    },
    "node_modules/zrender/lib/svg/helper/GradientManager": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/svg/helper/Definable",
        "node_modules/zrender/lib/core/util",
        "node_modules/zrender/lib/core/log",
        "node_modules/zrender/lib/tool/color"
      ],
      "pkg": "p2"
    },
    "node_modules/zrender/lib/svg/helper/ClippathManager": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/svg/helper/Definable",
        "node_modules/zrender/lib/core/util",
        "node_modules/zrender/lib/core/matrix"
      ],
      "pkg": "p2"
    },
    "node_modules/zrender/lib/svg/helper/ShadowManager": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/svg/helper/Definable",
        "node_modules/zrender/lib/core/util"
      ],
      "pkg": "p2"
    },
    "node_modules/zrender/lib/svg/Painter": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/svg/core",
        "node_modules/zrender/lib/core/util",
        "node_modules/zrender/lib/core/log",
        "node_modules/zrender/lib/graphic/Path",
        "node_modules/zrender/lib/graphic/Image",
        "node_modules/zrender/lib/graphic/Text",
        "node_modules/zrender/lib/core/arrayDiff2",
        "node_modules/zrender/lib/svg/helper/GradientManager",
        "node_modules/zrender/lib/svg/helper/ClippathManager",
        "node_modules/zrender/lib/svg/helper/ShadowManager",
        "node_modules/zrender/lib/svg/graphic"
      ],
      "pkg": "p2"
    },
    "node_modules/zrender/lib/svg/svg": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/svg/graphic",
        "node_modules/zrender/lib/zrender",
        "node_modules/zrender/lib/svg/Painter"
      ],
      "pkg": "p2"
    },
    "node_modules/zrender/lib/vml/core": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/env"
      ],
      "pkg": "p2"
    },
    "node_modules/zrender/lib/vml/graphic": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/env",
        "node_modules/zrender/lib/core/vector",
        "node_modules/zrender/lib/core/BoundingRect",
        "node_modules/zrender/lib/tool/color",
        "node_modules/zrender/lib/contain/text",
        "node_modules/zrender/lib/graphic/helper/text",
        "node_modules/zrender/lib/graphic/mixin/RectText",
        "node_modules/zrender/lib/graphic/Displayable",
        "node_modules/zrender/lib/graphic/Image",
        "node_modules/zrender/lib/graphic/Text",
        "node_modules/zrender/lib/graphic/Path",
        "node_modules/zrender/lib/core/PathProxy",
        "node_modules/zrender/lib/graphic/Gradient",
        "node_modules/zrender/lib/vml/core"
      ],
      "pkg": "p2"
    },
    "node_modules/zrender/lib/vml/Painter": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/log",
        "node_modules/zrender/lib/vml/core",
        "node_modules/zrender/lib/core/util"
      ],
      "pkg": "p2"
    },
    "node_modules/zrender/lib/vml/vml": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/vml/graphic",
        "node_modules/zrender/lib/zrender",
        "node_modules/zrender/lib/vml/Painter"
      ],
      "pkg": "p2"
    },
    "node_modules/zrender/index": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/zrender",
        "node_modules/zrender/lib/export",
        "node_modules/zrender/lib/svg/svg",
        "node_modules/zrender/lib/vml/vml"
      ],
      "pkg": "p2"
    },
    "node_modules/zrender/lib/contain/polygon": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/contain/windingLine"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/util/model": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util",
        "node_modules/zrender/lib/core/env"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/util/clazz": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/config",
        "node_modules/zrender/lib/core/util"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/model/mixin/makeStyleMapper": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/model/mixin/lineStyle": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/model/mixin/makeStyleMapper"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/model/mixin/areaStyle": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/model/mixin/makeStyleMapper"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/util/graphic": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util",
        "node_modules/zrender/lib/tool/path",
        "node_modules/zrender/lib/tool/color",
        "node_modules/zrender/lib/core/matrix",
        "node_modules/zrender/lib/core/vector",
        "node_modules/zrender/lib/graphic/Path",
        "node_modules/zrender/lib/mixin/Transformable",
        "node_modules/zrender/lib/graphic/Image",
        "node_modules/zrender/lib/container/Group",
        "node_modules/zrender/lib/graphic/Text",
        "node_modules/zrender/lib/graphic/shape/Circle",
        "node_modules/zrender/lib/graphic/shape/Sector",
        "node_modules/zrender/lib/graphic/shape/Ring",
        "node_modules/zrender/lib/graphic/shape/Polygon",
        "node_modules/zrender/lib/graphic/shape/Polyline",
        "node_modules/zrender/lib/graphic/shape/Rect",
        "node_modules/zrender/lib/graphic/shape/Line",
        "node_modules/zrender/lib/graphic/shape/BezierCurve",
        "node_modules/zrender/lib/graphic/shape/Arc",
        "node_modules/zrender/lib/graphic/CompoundPath",
        "node_modules/zrender/lib/graphic/LinearGradient",
        "node_modules/zrender/lib/graphic/RadialGradient",
        "node_modules/zrender/lib/core/BoundingRect",
        "node_modules/zrender/lib/graphic/IncrementalDisplayable",
        "node_modules/zrender/lib/graphic/helper/subPixelOptimize"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/model/mixin/textStyle": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/contain/text",
        "node_modules/echarts/lib/util/graphic"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/model/mixin/itemStyle": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/model/mixin/makeStyleMapper"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/model/Model": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util",
        "node_modules/zrender/lib/core/env",
        "node_modules/echarts/lib/util/model",
        "node_modules/echarts/lib/util/clazz",
        "node_modules/echarts/lib/model/mixin/lineStyle",
        "node_modules/echarts/lib/model/mixin/areaStyle",
        "node_modules/echarts/lib/model/mixin/textStyle",
        "node_modules/echarts/lib/model/mixin/itemStyle"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/util/component": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util",
        "node_modules/echarts/lib/util/clazz"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/util/number": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/util/format": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util",
        "node_modules/zrender/lib/contain/text",
        "node_modules/echarts/lib/util/number"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/util/layout": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util",
        "node_modules/zrender/lib/core/BoundingRect",
        "node_modules/echarts/lib/util/number",
        "node_modules/echarts/lib/util/format"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/model/mixin/boxLayout": {
      "type": "js",
      "pkg": "p2"
    },
    "node_modules/echarts/lib/model/Component": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util",
        "node_modules/echarts/lib/model/Model",
        "node_modules/echarts/lib/util/component",
        "node_modules/echarts/lib/util/clazz",
        "node_modules/echarts/lib/util/model",
        "node_modules/echarts/lib/util/layout",
        "node_modules/echarts/lib/model/mixin/boxLayout"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/model/globalDefault": {
      "type": "js",
      "pkg": "p2"
    },
    "node_modules/echarts/lib/model/mixin/colorPalette": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/util/model"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/data/helper/sourceType": {
      "type": "js",
      "pkg": "p2"
    },
    "node_modules/echarts/lib/data/Source": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util",
        "node_modules/echarts/lib/util/clazz",
        "node_modules/echarts/lib/data/helper/sourceType"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/data/helper/sourceHelper": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/config",
        "node_modules/echarts/lib/util/model",
        "node_modules/zrender/lib/core/util",
        "node_modules/echarts/lib/data/Source",
        "node_modules/echarts/lib/data/helper/sourceType"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/model/Global": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/config",
        "node_modules/zrender/lib/core/util",
        "node_modules/echarts/lib/util/model",
        "node_modules/echarts/lib/model/Model",
        "node_modules/echarts/lib/model/Component",
        "node_modules/echarts/lib/model/globalDefault",
        "node_modules/echarts/lib/model/mixin/colorPalette",
        "node_modules/echarts/lib/data/helper/sourceHelper"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/ExtensionAPI": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/CoordinateSystem": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/model/OptionManager": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util",
        "node_modules/echarts/lib/util/model",
        "node_modules/echarts/lib/model/Component"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/preprocessor/helper/compatStyle": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util",
        "node_modules/echarts/lib/util/model"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/preprocessor/backwardCompat": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util",
        "node_modules/echarts/lib/preprocessor/helper/compatStyle",
        "node_modules/echarts/lib/util/model"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/processor/dataStack": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/data/helper/dataProvider": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/config",
        "node_modules/zrender/lib/core/util",
        "node_modules/echarts/lib/util/model",
        "node_modules/echarts/lib/util/number",
        "node_modules/echarts/lib/data/Source",
        "node_modules/echarts/lib/data/helper/sourceType"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/model/mixin/dataFormat": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/data/helper/dataProvider",
        "node_modules/echarts/lib/util/format",
        "node_modules/echarts/lib/util/model"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/stream/task": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util",
        "node_modules/echarts/lib/config"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/model/Series": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/config",
        "node_modules/zrender/lib/core/util",
        "node_modules/zrender/lib/core/env",
        "node_modules/echarts/lib/util/format",
        "node_modules/echarts/lib/util/model",
        "node_modules/echarts/lib/model/Component",
        "node_modules/echarts/lib/model/mixin/colorPalette",
        "node_modules/echarts/lib/model/mixin/dataFormat",
        "node_modules/echarts/lib/util/layout",
        "node_modules/echarts/lib/stream/task",
        "node_modules/echarts/lib/data/helper/sourceHelper",
        "node_modules/echarts/lib/data/helper/dataProvider"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/view/Component": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/container/Group",
        "node_modules/echarts/lib/util/component",
        "node_modules/echarts/lib/util/clazz"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/chart/helper/createRenderPlanner": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/util/model"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/view/Chart": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util",
        "node_modules/zrender/lib/container/Group",
        "node_modules/echarts/lib/util/component",
        "node_modules/echarts/lib/util/clazz",
        "node_modules/echarts/lib/util/model",
        "node_modules/echarts/lib/util/graphic",
        "node_modules/echarts/lib/stream/task",
        "node_modules/echarts/lib/chart/helper/createRenderPlanner"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/util/throttle": {
      "type": "js",
      "pkg": "p2"
    },
    "node_modules/echarts/lib/visual/seriesColor": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/graphic/Gradient",
        "node_modules/zrender/lib/core/util"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/lang": {
      "type": "js",
      "pkg": "p2"
    },
    "node_modules/echarts/lib/visual/aria": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util",
        "node_modules/echarts/lib/lang",
        "node_modules/echarts/lib/data/helper/dataProvider"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/loading/default": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util",
        "node_modules/echarts/lib/util/graphic"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/stream/Scheduler": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util",
        "node_modules/echarts/lib/stream/task",
        "node_modules/echarts/lib/util/component",
        "node_modules/echarts/lib/model/Global",
        "node_modules/echarts/lib/ExtensionAPI",
        "node_modules/echarts/lib/util/model"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/theme/light": {
      "type": "js",
      "pkg": "p2"
    },
    "node_modules/echarts/lib/theme/dark": {
      "type": "js",
      "pkg": "p2"
    },
    "node_modules/echarts/lib/component/dataset": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/model/Component",
        "node_modules/echarts/lib/view/Component",
        "node_modules/echarts/lib/data/helper/sourceHelper",
        "node_modules/echarts/lib/data/helper/sourceType"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/coord/geo/mapDataStorage": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/config",
        "node_modules/zrender/lib/core/util",
        "node_modules/zrender/lib/tool/parseSVG"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/data/DataDiffer": {
      "type": "js",
      "pkg": "p2"
    },
    "node_modules/echarts/lib/data/helper/dimensionHelper": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util",
        "node_modules/echarts/lib/config"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/data/DataDimensionInfo": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/data/List": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/config",
        "node_modules/zrender/lib/core/util",
        "node_modules/echarts/lib/model/Model",
        "node_modules/echarts/lib/data/DataDiffer",
        "node_modules/echarts/lib/data/Source",
        "node_modules/echarts/lib/data/helper/dataProvider",
        "node_modules/echarts/lib/data/helper/dimensionHelper",
        "node_modules/echarts/lib/data/DataDimensionInfo"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/data/helper/completeDimensions": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util",
        "node_modules/echarts/lib/util/model",
        "node_modules/echarts/lib/data/helper/sourceHelper",
        "node_modules/echarts/lib/data/Source",
        "node_modules/echarts/lib/data/helper/dimensionHelper",
        "node_modules/echarts/lib/data/DataDimensionInfo"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/data/helper/createDimensions": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/data/helper/completeDimensions"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/model/referHelper": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/config",
        "node_modules/zrender/lib/core/util"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/data/helper/dataStackHelper": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/chart/helper/createListFromArray": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util",
        "node_modules/echarts/lib/data/List",
        "node_modules/echarts/lib/data/helper/createDimensions",
        "node_modules/echarts/lib/data/helper/sourceType",
        "node_modules/echarts/lib/data/helper/dimensionHelper",
        "node_modules/echarts/lib/util/model",
        "node_modules/echarts/lib/CoordinateSystem",
        "node_modules/echarts/lib/model/referHelper",
        "node_modules/echarts/lib/data/Source",
        "node_modules/echarts/lib/data/helper/dataStackHelper",
        "node_modules/echarts/lib/data/helper/sourceHelper"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/scale/Scale": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/util/clazz"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/data/OrdinalMeta": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/scale/Ordinal": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util",
        "node_modules/echarts/lib/scale/Scale",
        "node_modules/echarts/lib/data/OrdinalMeta"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/scale/helper": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/util/number"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/scale/Interval": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/util/number",
        "node_modules/echarts/lib/util/format",
        "node_modules/echarts/lib/scale/Scale",
        "node_modules/echarts/lib/scale/helper"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/layout/barGrid": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util",
        "node_modules/echarts/lib/util/number",
        "node_modules/echarts/lib/data/helper/dataStackHelper",
        "node_modules/echarts/lib/chart/helper/createRenderPlanner"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/scale/Time": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util",
        "node_modules/echarts/lib/util/number",
        "node_modules/echarts/lib/util/format",
        "node_modules/echarts/lib/scale/helper",
        "node_modules/echarts/lib/scale/Interval"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/scale/Log": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util",
        "node_modules/echarts/lib/scale/Scale",
        "node_modules/echarts/lib/util/number",
        "node_modules/echarts/lib/scale/Interval"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/coord/axisHelper": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/config",
        "node_modules/zrender/lib/core/util",
        "node_modules/echarts/lib/scale/Ordinal",
        "node_modules/echarts/lib/scale/Interval",
        "node_modules/echarts/lib/scale/Scale",
        "node_modules/echarts/lib/util/number",
        "node_modules/echarts/lib/layout/barGrid",
        "node_modules/zrender/lib/core/BoundingRect",
        "node_modules/echarts/lib/scale/Time",
        "node_modules/echarts/lib/scale/Log"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/coord/axisModelCommonMixin": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/util/symbol": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util",
        "node_modules/echarts/lib/util/graphic",
        "node_modules/zrender/lib/core/BoundingRect",
        "node_modules/zrender/lib/contain/text"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/helper": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util",
        "node_modules/echarts/lib/chart/helper/createListFromArray",
        "node_modules/echarts/lib/coord/axisHelper",
        "node_modules/echarts/lib/coord/axisModelCommonMixin",
        "node_modules/echarts/lib/model/Model",
        "node_modules/echarts/lib/util/layout",
        "node_modules/echarts/lib/data/helper/dataStackHelper",
        "node_modules/echarts/lib/data/helper/completeDimensions",
        "node_modules/echarts/lib/data/helper/createDimensions",
        "node_modules/echarts/lib/util/symbol"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/coord/geo/Region": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/BoundingRect",
        "node_modules/zrender/lib/core/bbox",
        "node_modules/zrender/lib/core/vector",
        "node_modules/zrender/lib/contain/polygon"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/coord/geo/parseGeoJson": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util",
        "node_modules/echarts/lib/coord/geo/Region"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/coord/axisTickLabelBuilder": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util",
        "node_modules/zrender/lib/contain/text",
        "node_modules/echarts/lib/util/model",
        "node_modules/echarts/lib/coord/axisHelper"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/coord/Axis": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util",
        "node_modules/echarts/lib/util/number",
        "node_modules/echarts/lib/coord/axisTickLabelBuilder"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/export": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/zrender",
        "node_modules/zrender/lib/core/matrix",
        "node_modules/zrender/lib/core/vector",
        "node_modules/zrender/lib/core/util",
        "node_modules/zrender/lib/tool/color",
        "node_modules/echarts/lib/util/graphic",
        "node_modules/echarts/lib/util/number",
        "node_modules/echarts/lib/util/format",
        "node_modules/echarts/lib/util/throttle",
        "node_modules/echarts/lib/helper",
        "node_modules/echarts/lib/coord/geo/parseGeoJson",
        "node_modules/echarts/lib/data/List",
        "node_modules/echarts/lib/model/Model",
        "node_modules/echarts/lib/coord/Axis",
        "node_modules/zrender/lib/core/env"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/echarts": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/config",
        "node_modules/zrender/lib/zrender",
        "node_modules/zrender/lib/core/util",
        "node_modules/zrender/lib/tool/color",
        "node_modules/zrender/lib/core/env",
        "node_modules/zrender/lib/core/timsort",
        "node_modules/zrender/lib/mixin/Eventful",
        "node_modules/echarts/lib/model/Global",
        "node_modules/echarts/lib/ExtensionAPI",
        "node_modules/echarts/lib/CoordinateSystem",
        "node_modules/echarts/lib/model/OptionManager",
        "node_modules/echarts/lib/preprocessor/backwardCompat",
        "node_modules/echarts/lib/processor/dataStack",
        "node_modules/echarts/lib/model/Component",
        "node_modules/echarts/lib/model/Series",
        "node_modules/echarts/lib/view/Component",
        "node_modules/echarts/lib/view/Chart",
        "node_modules/echarts/lib/util/graphic",
        "node_modules/echarts/lib/util/model",
        "node_modules/echarts/lib/util/throttle",
        "node_modules/echarts/lib/visual/seriesColor",
        "node_modules/echarts/lib/visual/aria",
        "node_modules/echarts/lib/loading/default",
        "node_modules/echarts/lib/stream/Scheduler",
        "node_modules/echarts/lib/theme/light",
        "node_modules/echarts/lib/theme/dark",
        "node_modules/echarts/lib/component/dataset",
        "node_modules/echarts/lib/coord/geo/mapDataStorage",
        "node_modules/echarts/lib/export"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/chart/line/LineSeries": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/config",
        "node_modules/echarts/lib/chart/helper/createListFromArray",
        "node_modules/echarts/lib/model/Series"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/chart/helper/labelHelper": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/data/helper/dataProvider"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/chart/helper/Symbol": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util",
        "node_modules/echarts/lib/util/symbol",
        "node_modules/echarts/lib/util/graphic",
        "node_modules/echarts/lib/util/number",
        "node_modules/echarts/lib/chart/helper/labelHelper"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/chart/helper/SymbolDraw": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/util/graphic",
        "node_modules/echarts/lib/chart/helper/Symbol",
        "node_modules/zrender/lib/core/util"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/chart/line/helper": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/data/helper/dataStackHelper",
        "node_modules/zrender/lib/core/util"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/chart/line/lineAnimationDiff": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/chart/line/helper"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/chart/line/poly": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/graphic/Path",
        "node_modules/zrender/lib/core/vector",
        "node_modules/zrender/lib/graphic/helper/fixClipWithShadow"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/chart/helper/createClipPathFromCoordSys": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/util/graphic",
        "node_modules/echarts/lib/util/number"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/chart/line/LineView": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/config",
        "node_modules/zrender/lib/core/util",
        "node_modules/echarts/lib/chart/helper/SymbolDraw",
        "node_modules/echarts/lib/chart/helper/Symbol",
        "node_modules/echarts/lib/chart/line/lineAnimationDiff",
        "node_modules/echarts/lib/util/graphic",
        "node_modules/echarts/lib/util/model",
        "node_modules/echarts/lib/chart/line/poly",
        "node_modules/echarts/lib/view/Chart",
        "node_modules/echarts/lib/chart/line/helper",
        "node_modules/echarts/lib/chart/helper/createClipPathFromCoordSys"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/visual/symbol": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/layout/points": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util",
        "node_modules/echarts/lib/chart/helper/createRenderPlanner",
        "node_modules/echarts/lib/data/helper/dataStackHelper"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/processor/dataSample": {
      "type": "js",
      "pkg": "p2"
    },
    "node_modules/echarts/lib/coord/cartesian/Cartesian": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/coord/cartesian/Cartesian2D": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util",
        "node_modules/zrender/lib/core/BoundingRect",
        "node_modules/echarts/lib/coord/cartesian/Cartesian"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/coord/cartesian/Axis2D": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util",
        "node_modules/echarts/lib/coord/Axis"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/coord/axisDefault": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/coord/axisModelCreator": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util",
        "node_modules/echarts/lib/coord/axisDefault",
        "node_modules/echarts/lib/model/Component",
        "node_modules/echarts/lib/util/layout",
        "node_modules/echarts/lib/data/OrdinalMeta"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/coord/cartesian/AxisModel": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util",
        "node_modules/echarts/lib/model/Component",
        "node_modules/echarts/lib/coord/axisModelCreator",
        "node_modules/echarts/lib/coord/axisModelCommonMixin"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/coord/cartesian/GridModel": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/coord/cartesian/AxisModel",
        "node_modules/echarts/lib/model/Component"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/coord/cartesian/Grid": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/config",
        "node_modules/zrender/lib/core/util",
        "node_modules/echarts/lib/util/layout",
        "node_modules/echarts/lib/coord/axisHelper",
        "node_modules/echarts/lib/coord/cartesian/Cartesian2D",
        "node_modules/echarts/lib/coord/cartesian/Axis2D",
        "node_modules/echarts/lib/CoordinateSystem",
        "node_modules/echarts/lib/data/helper/dataStackHelper",
        "node_modules/echarts/lib/coord/cartesian/GridModel"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/component/axis/AxisBuilder": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util",
        "node_modules/echarts/lib/util/format",
        "node_modules/echarts/lib/util/graphic",
        "node_modules/echarts/lib/model/Model",
        "node_modules/echarts/lib/util/number",
        "node_modules/echarts/lib/util/symbol",
        "node_modules/zrender/lib/core/matrix",
        "node_modules/zrender/lib/core/vector",
        "node_modules/echarts/lib/coord/axisHelper"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/component/axisPointer/modelHelper": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util",
        "node_modules/echarts/lib/model/Model"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/component/axis/AxisView": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/config",
        "node_modules/echarts/lib/echarts",
        "node_modules/echarts/lib/component/axisPointer/modelHelper"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/coord/cartesian/cartesianAxisHelper": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/component/axis/CartesianAxisView": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util",
        "node_modules/echarts/lib/util/graphic",
        "node_modules/echarts/lib/component/axis/AxisBuilder",
        "node_modules/echarts/lib/component/axis/AxisView",
        "node_modules/echarts/lib/coord/cartesian/cartesianAxisHelper"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/component/axis": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/coord/cartesian/AxisModel",
        "node_modules/echarts/lib/component/axis/CartesianAxisView"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/component/gridSimple": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/echarts",
        "node_modules/zrender/lib/core/util",
        "node_modules/echarts/lib/util/graphic",
        "node_modules/echarts/lib/coord/cartesian/Grid",
        "node_modules/echarts/lib/component/axis"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/chart/line": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/echarts",
        "node_modules/echarts/lib/chart/line/LineSeries",
        "node_modules/echarts/lib/chart/line/LineView",
        "node_modules/echarts/lib/visual/symbol",
        "node_modules/echarts/lib/layout/points",
        "node_modules/echarts/lib/processor/dataSample",
        "node_modules/echarts/lib/component/gridSimple"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/chart/bar/BaseBarSeries": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/model/Series",
        "node_modules/echarts/lib/chart/helper/createListFromArray"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/chart/bar/BarSeries": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/chart/bar/BaseBarSeries"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/chart/bar/helper": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/util/graphic",
        "node_modules/echarts/lib/chart/helper/labelHelper"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/chart/bar/barItemStyle": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/model/mixin/makeStyleMapper"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/util/shape/sausage": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/util/graphic"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/chart/bar/BarView": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/config",
        "node_modules/echarts/lib/echarts",
        "node_modules/zrender/lib/core/util",
        "node_modules/echarts/lib/util/graphic",
        "node_modules/echarts/lib/chart/bar/helper",
        "node_modules/echarts/lib/model/Model",
        "node_modules/echarts/lib/chart/bar/barItemStyle",
        "node_modules/zrender/lib/graphic/Path",
        "node_modules/echarts/lib/util/throttle",
        "node_modules/echarts/lib/chart/helper/createClipPathFromCoordSys",
        "node_modules/echarts/lib/util/shape/sausage"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/chart/bar": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/echarts",
        "node_modules/zrender/lib/core/util",
        "node_modules/echarts/lib/layout/barGrid",
        "node_modules/echarts/lib/coord/cartesian/Grid",
        "node_modules/echarts/lib/chart/bar/BarSeries",
        "node_modules/echarts/lib/chart/bar/BarView",
        "node_modules/echarts/lib/component/gridSimple"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/chart/helper/createListSimply": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/data/helper/createDimensions",
        "node_modules/echarts/lib/data/List",
        "node_modules/zrender/lib/core/util"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/component/helper/selectableMixin": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/visual/LegendVisualProvider": {
      "type": "js",
      "pkg": "p2"
    },
    "node_modules/echarts/lib/chart/pie/PieSeries": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/echarts",
        "node_modules/echarts/lib/chart/helper/createListSimply",
        "node_modules/zrender/lib/core/util",
        "node_modules/echarts/lib/util/model",
        "node_modules/echarts/lib/util/number",
        "node_modules/echarts/lib/component/helper/selectableMixin",
        "node_modules/echarts/lib/data/helper/dataProvider",
        "node_modules/echarts/lib/data/helper/sourceHelper",
        "node_modules/echarts/lib/visual/LegendVisualProvider"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/chart/pie/PieView": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util",
        "node_modules/echarts/lib/util/graphic",
        "node_modules/echarts/lib/view/Chart"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/action/createDataSelectAction": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/echarts",
        "node_modules/zrender/lib/core/util"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/visual/dataColor": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/chart/pie/labelLayout": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/contain/text",
        "node_modules/echarts/lib/util/number"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/chart/pie/pieLayout": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/util/number",
        "node_modules/echarts/lib/util/layout",
        "node_modules/echarts/lib/chart/pie/labelLayout",
        "node_modules/zrender/lib/core/util"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/processor/dataFilter": {
      "type": "js",
      "pkg": "p2"
    },
    "node_modules/echarts/lib/chart/pie": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/echarts",
        "node_modules/zrender/lib/core/util",
        "node_modules/echarts/lib/chart/pie/PieSeries",
        "node_modules/echarts/lib/chart/pie/PieView",
        "node_modules/echarts/lib/action/createDataSelectAction",
        "node_modules/echarts/lib/visual/dataColor",
        "node_modules/echarts/lib/chart/pie/pieLayout",
        "node_modules/echarts/lib/processor/dataFilter"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/chart/scatter/ScatterSeries": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/chart/helper/createListFromArray",
        "node_modules/echarts/lib/model/Series"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/chart/helper/LargeSymbolDraw": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/util/graphic",
        "node_modules/echarts/lib/util/symbol",
        "node_modules/zrender/lib/graphic/IncrementalDisplayable"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/chart/scatter/ScatterView": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/echarts",
        "node_modules/echarts/lib/chart/helper/SymbolDraw",
        "node_modules/echarts/lib/chart/helper/LargeSymbolDraw",
        "node_modules/echarts/lib/layout/points"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/chart/scatter": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/echarts",
        "node_modules/echarts/lib/chart/scatter/ScatterSeries",
        "node_modules/echarts/lib/chart/scatter/ScatterView",
        "node_modules/echarts/lib/visual/symbol",
        "node_modules/echarts/lib/layout/points",
        "node_modules/echarts/lib/component/gridSimple"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/coord/radar/IndicatorAxis": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util",
        "node_modules/echarts/lib/coord/Axis"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/coord/radar/Radar": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util",
        "node_modules/echarts/lib/coord/radar/IndicatorAxis",
        "node_modules/echarts/lib/scale/Interval",
        "node_modules/echarts/lib/util/number",
        "node_modules/echarts/lib/coord/axisHelper",
        "node_modules/echarts/lib/CoordinateSystem",
        "node_modules/echarts/lib/scale/Log"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/coord/radar/RadarModel": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/echarts",
        "node_modules/zrender/lib/core/util",
        "node_modules/echarts/lib/coord/axisDefault",
        "node_modules/echarts/lib/model/Model",
        "node_modules/echarts/lib/coord/axisModelCommonMixin"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/component/radar/RadarView": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/config",
        "node_modules/echarts/lib/echarts",
        "node_modules/zrender/lib/core/util",
        "node_modules/echarts/lib/component/axis/AxisBuilder",
        "node_modules/echarts/lib/util/graphic"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/component/radar": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/coord/radar/Radar",
        "node_modules/echarts/lib/coord/radar/RadarModel",
        "node_modules/echarts/lib/component/radar/RadarView"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/chart/radar/RadarSeries": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/model/Series",
        "node_modules/echarts/lib/chart/helper/createListSimply",
        "node_modules/zrender/lib/core/util",
        "node_modules/echarts/lib/util/format",
        "node_modules/echarts/lib/visual/LegendVisualProvider"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/chart/radar/RadarView": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/echarts",
        "node_modules/echarts/lib/util/graphic",
        "node_modules/zrender/lib/core/util",
        "node_modules/echarts/lib/util/symbol"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/chart/radar/radarLayout": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/chart/radar/backwardCompat": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/chart/radar": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/echarts",
        "node_modules/echarts/lib/component/radar",
        "node_modules/echarts/lib/chart/radar/RadarSeries",
        "node_modules/echarts/lib/chart/radar/RadarView",
        "node_modules/echarts/lib/visual/dataColor",
        "node_modules/echarts/lib/visual/symbol",
        "node_modules/echarts/lib/chart/radar/radarLayout",
        "node_modules/echarts/lib/processor/dataFilter",
        "node_modules/echarts/lib/chart/radar/backwardCompat"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/coord/geo/fix/nanhai": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util",
        "node_modules/echarts/lib/coord/geo/Region"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/coord/geo/fix/textCoord": {
      "type": "js",
      "pkg": "p2"
    },
    "node_modules/echarts/lib/coord/geo/fix/geoCoord": {
      "type": "js",
      "pkg": "p2"
    },
    "node_modules/echarts/lib/coord/geo/fix/diaoyuIsland": {
      "type": "js",
      "pkg": "p2"
    },
    "node_modules/echarts/lib/coord/geo/geoJSONLoader": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util",
        "node_modules/echarts/lib/coord/geo/parseGeoJson",
        "node_modules/echarts/lib/util/model",
        "node_modules/echarts/lib/coord/geo/fix/nanhai",
        "node_modules/echarts/lib/coord/geo/fix/textCoord",
        "node_modules/echarts/lib/coord/geo/fix/geoCoord",
        "node_modules/echarts/lib/coord/geo/fix/diaoyuIsland"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/coord/geo/geoSVGLoader": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/tool/parseSVG",
        "node_modules/zrender/lib/container/Group",
        "node_modules/zrender/lib/graphic/shape/Rect",
        "node_modules/zrender/lib/core/util",
        "node_modules/zrender/lib/core/BoundingRect",
        "node_modules/echarts/lib/util/model"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/coord/geo/geoSourceManager": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/config",
        "node_modules/zrender/lib/core/util",
        "node_modules/echarts/lib/coord/geo/mapDataStorage",
        "node_modules/echarts/lib/coord/geo/geoJSONLoader",
        "node_modules/echarts/lib/coord/geo/geoSVGLoader",
        "node_modules/zrender/lib/core/BoundingRect"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/chart/map/MapSeries": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util",
        "node_modules/echarts/lib/chart/helper/createListSimply",
        "node_modules/echarts/lib/model/Series",
        "node_modules/echarts/lib/util/format",
        "node_modules/echarts/lib/component/helper/selectableMixin",
        "node_modules/echarts/lib/data/helper/dataProvider",
        "node_modules/echarts/lib/coord/geo/geoSourceManager",
        "node_modules/echarts/lib/data/helper/sourceHelper"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/component/helper/interactionMutex": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/echarts"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/component/helper/RoamController": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util",
        "node_modules/zrender/lib/mixin/Eventful",
        "node_modules/zrender/lib/core/event",
        "node_modules/echarts/lib/component/helper/interactionMutex"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/component/helper/roamHelper": {
      "type": "js",
      "pkg": "p2"
    },
    "node_modules/echarts/lib/component/helper/cursorHelper": {
      "type": "js",
      "pkg": "p2"
    },
    "node_modules/echarts/lib/component/helper/MapDraw": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util",
        "node_modules/echarts/lib/component/helper/RoamController",
        "node_modules/echarts/lib/component/helper/roamHelper",
        "node_modules/echarts/lib/component/helper/cursorHelper",
        "node_modules/echarts/lib/util/graphic",
        "node_modules/echarts/lib/coord/geo/geoSourceManager",
        "node_modules/echarts/lib/util/component"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/chart/map/MapView": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/echarts",
        "node_modules/zrender/lib/core/util",
        "node_modules/echarts/lib/util/graphic",
        "node_modules/echarts/lib/component/helper/MapDraw"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/action/roamHelper": {
      "type": "js",
      "pkg": "p2"
    },
    "node_modules/echarts/lib/action/geoRoam": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/echarts",
        "node_modules/zrender/lib/core/util",
        "node_modules/echarts/lib/action/roamHelper"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/coord/View": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util",
        "node_modules/zrender/lib/core/vector",
        "node_modules/zrender/lib/core/matrix",
        "node_modules/zrender/lib/core/BoundingRect",
        "node_modules/zrender/lib/mixin/Transformable"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/coord/geo/Geo": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util",
        "node_modules/zrender/lib/core/BoundingRect",
        "node_modules/echarts/lib/coord/View",
        "node_modules/echarts/lib/coord/geo/geoSourceManager"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/coord/geo/geoCreator": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/config",
        "node_modules/echarts/lib/echarts",
        "node_modules/zrender/lib/core/util",
        "node_modules/echarts/lib/coord/geo/Geo",
        "node_modules/echarts/lib/util/layout",
        "node_modules/echarts/lib/util/number",
        "node_modules/echarts/lib/coord/geo/geoSourceManager",
        "node_modules/echarts/lib/coord/geo/mapDataStorage"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/chart/map/mapSymbolLayout": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/chart/map/mapVisual": {
      "type": "js",
      "pkg": "p2"
    },
    "node_modules/echarts/lib/chart/map/mapDataStatistic": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/chart/map/backwardCompat": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/chart/map": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/echarts",
        "node_modules/echarts/lib/chart/map/MapSeries",
        "node_modules/echarts/lib/chart/map/MapView",
        "node_modules/echarts/lib/action/geoRoam",
        "node_modules/echarts/lib/coord/geo/geoCreator",
        "node_modules/echarts/lib/chart/map/mapSymbolLayout",
        "node_modules/echarts/lib/chart/map/mapVisual",
        "node_modules/echarts/lib/chart/map/mapDataStatistic",
        "node_modules/echarts/lib/chart/map/backwardCompat",
        "node_modules/echarts/lib/action/createDataSelectAction"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/data/helper/linkList": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/data/Tree": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util",
        "node_modules/echarts/lib/model/Model",
        "node_modules/echarts/lib/data/helper/linkList",
        "node_modules/echarts/lib/data/List",
        "node_modules/echarts/lib/data/helper/createDimensions"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/chart/tree/TreeSeries": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/model/Series",
        "node_modules/echarts/lib/data/Tree",
        "node_modules/echarts/lib/util/format"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/chart/tree/layoutHelper": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/util/layout"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/chart/tree/TreeView": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util",
        "node_modules/echarts/lib/util/graphic",
        "node_modules/echarts/lib/chart/helper/Symbol",
        "node_modules/echarts/lib/chart/tree/layoutHelper",
        "node_modules/echarts/lib/echarts",
        "node_modules/zrender/lib/core/bbox",
        "node_modules/echarts/lib/coord/View",
        "node_modules/echarts/lib/component/helper/roamHelper",
        "node_modules/echarts/lib/component/helper/RoamController",
        "node_modules/echarts/lib/component/helper/cursorHelper"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/chart/tree/treeAction": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/echarts",
        "node_modules/echarts/lib/action/roamHelper"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/chart/tree/traversalHelper": {
      "type": "js",
      "pkg": "p2"
    },
    "node_modules/echarts/lib/chart/tree/treeLayout": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/chart/tree/traversalHelper",
        "node_modules/echarts/lib/chart/tree/layoutHelper"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/chart/tree": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/echarts",
        "node_modules/echarts/lib/chart/tree/TreeSeries",
        "node_modules/echarts/lib/chart/tree/TreeView",
        "node_modules/echarts/lib/chart/tree/treeAction",
        "node_modules/echarts/lib/visual/symbol",
        "node_modules/echarts/lib/chart/tree/treeLayout"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/chart/helper/treeHelper": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/chart/treemap/TreemapSeries": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util",
        "node_modules/echarts/lib/model/Series",
        "node_modules/echarts/lib/data/Tree",
        "node_modules/echarts/lib/model/Model",
        "node_modules/echarts/lib/util/format",
        "node_modules/echarts/lib/chart/helper/treeHelper"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/chart/treemap/Breadcrumb": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/util/graphic",
        "node_modules/echarts/lib/util/layout",
        "node_modules/zrender/lib/core/util",
        "node_modules/echarts/lib/chart/helper/treeHelper"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/util/animation": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/chart/treemap/TreemapView": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/echarts",
        "node_modules/zrender/lib/core/util",
        "node_modules/echarts/lib/util/graphic",
        "node_modules/echarts/lib/data/DataDiffer",
        "node_modules/echarts/lib/chart/helper/treeHelper",
        "node_modules/echarts/lib/chart/treemap/Breadcrumb",
        "node_modules/echarts/lib/component/helper/RoamController",
        "node_modules/zrender/lib/core/BoundingRect",
        "node_modules/zrender/lib/core/matrix",
        "node_modules/echarts/lib/util/animation",
        "node_modules/echarts/lib/model/mixin/makeStyleMapper"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/chart/treemap/treemapAction": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/echarts",
        "node_modules/echarts/lib/chart/helper/treeHelper"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/visual/VisualMapping": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util",
        "node_modules/zrender/lib/tool/color",
        "node_modules/echarts/lib/util/number"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/chart/treemap/treemapVisual": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/visual/VisualMapping",
        "node_modules/zrender/lib/tool/color",
        "node_modules/zrender/lib/core/util"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/chart/treemap/treemapLayout": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util",
        "node_modules/zrender/lib/core/BoundingRect",
        "node_modules/echarts/lib/util/number",
        "node_modules/echarts/lib/util/layout",
        "node_modules/echarts/lib/chart/helper/treeHelper"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/chart/treemap": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/echarts",
        "node_modules/echarts/lib/chart/treemap/TreemapSeries",
        "node_modules/echarts/lib/chart/treemap/TreemapView",
        "node_modules/echarts/lib/chart/treemap/treemapAction",
        "node_modules/echarts/lib/chart/treemap/treemapVisual",
        "node_modules/echarts/lib/chart/treemap/treemapLayout"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/data/Graph": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/config",
        "node_modules/zrender/lib/core/util",
        "node_modules/echarts/lib/util/clazz"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/chart/helper/createGraphFromNodeEdge": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util",
        "node_modules/echarts/lib/data/List",
        "node_modules/echarts/lib/data/Graph",
        "node_modules/echarts/lib/data/helper/linkList",
        "node_modules/echarts/lib/data/helper/createDimensions",
        "node_modules/echarts/lib/CoordinateSystem",
        "node_modules/echarts/lib/chart/helper/createListFromArray"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/chart/graph/GraphSeries": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/echarts",
        "node_modules/echarts/lib/data/List",
        "node_modules/zrender/lib/core/util",
        "node_modules/echarts/lib/util/model",
        "node_modules/echarts/lib/model/Model",
        "node_modules/echarts/lib/util/format",
        "node_modules/echarts/lib/chart/helper/createGraphFromNodeEdge",
        "node_modules/echarts/lib/visual/LegendVisualProvider"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/chart/helper/LinePath": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/util/graphic",
        "node_modules/zrender/lib/core/vector"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/chart/helper/Line": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util",
        "node_modules/zrender/lib/core/vector",
        "node_modules/echarts/lib/util/symbol",
        "node_modules/echarts/lib/chart/helper/LinePath",
        "node_modules/echarts/lib/util/graphic",
        "node_modules/echarts/lib/util/number"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/chart/helper/LineDraw": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/util/graphic",
        "node_modules/echarts/lib/chart/helper/Line"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/chart/graph/graphHelper": {
      "type": "js",
      "pkg": "p2"
    },
    "node_modules/echarts/lib/chart/graph/adjustEdge": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/curve",
        "node_modules/zrender/lib/core/vector",
        "node_modules/echarts/lib/chart/graph/graphHelper"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/chart/graph/GraphView": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/echarts",
        "node_modules/zrender/lib/core/util",
        "node_modules/echarts/lib/chart/helper/SymbolDraw",
        "node_modules/echarts/lib/chart/helper/LineDraw",
        "node_modules/echarts/lib/component/helper/RoamController",
        "node_modules/echarts/lib/component/helper/roamHelper",
        "node_modules/echarts/lib/component/helper/cursorHelper",
        "node_modules/echarts/lib/util/graphic",
        "node_modules/echarts/lib/chart/graph/adjustEdge",
        "node_modules/echarts/lib/chart/graph/graphHelper"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/chart/helper/focusNodeAdjacencyAction": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/echarts"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/chart/graph/graphAction": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/echarts",
        "node_modules/echarts/lib/action/roamHelper",
        "node_modules/echarts/lib/chart/helper/focusNodeAdjacencyAction"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/chart/graph/categoryFilter": {
      "type": "js",
      "pkg": "p2"
    },
    "node_modules/echarts/lib/chart/graph/categoryVisual": {
      "type": "js",
      "pkg": "p2"
    },
    "node_modules/echarts/lib/chart/graph/edgeVisual": {
      "type": "js",
      "pkg": "p2"
    },
    "node_modules/echarts/lib/chart/graph/simpleLayoutHelper": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/vector"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/chart/graph/simpleLayout": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util",
        "node_modules/echarts/lib/chart/graph/simpleLayoutHelper"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/chart/graph/circularLayoutHelper": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/vector",
        "node_modules/echarts/lib/chart/graph/graphHelper"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/chart/graph/circularLayout": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/chart/graph/circularLayoutHelper"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/chart/graph/forceHelper": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/vector"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/chart/graph/forceLayout": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/chart/graph/forceHelper",
        "node_modules/echarts/lib/chart/graph/simpleLayoutHelper",
        "node_modules/echarts/lib/chart/graph/circularLayoutHelper",
        "node_modules/echarts/lib/util/number",
        "node_modules/zrender/lib/core/vector",
        "node_modules/zrender/lib/core/util"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/chart/graph/createView": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/coord/View",
        "node_modules/echarts/lib/util/layout",
        "node_modules/zrender/lib/core/bbox"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/chart/graph": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/echarts",
        "node_modules/echarts/lib/chart/graph/GraphSeries",
        "node_modules/echarts/lib/chart/graph/GraphView",
        "node_modules/echarts/lib/chart/graph/graphAction",
        "node_modules/echarts/lib/chart/graph/categoryFilter",
        "node_modules/echarts/lib/visual/symbol",
        "node_modules/echarts/lib/chart/graph/categoryVisual",
        "node_modules/echarts/lib/chart/graph/edgeVisual",
        "node_modules/echarts/lib/chart/graph/simpleLayout",
        "node_modules/echarts/lib/chart/graph/circularLayout",
        "node_modules/echarts/lib/chart/graph/forceLayout",
        "node_modules/echarts/lib/chart/graph/createView"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/chart/gauge/GaugeSeries": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/chart/helper/createListSimply",
        "node_modules/echarts/lib/model/Series"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/chart/gauge/PointerPath": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/graphic/Path"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/chart/gauge/GaugeView": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/chart/gauge/PointerPath",
        "node_modules/echarts/lib/util/graphic",
        "node_modules/echarts/lib/view/Chart",
        "node_modules/echarts/lib/util/number"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/chart/gauge": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/chart/gauge/GaugeSeries",
        "node_modules/echarts/lib/chart/gauge/GaugeView"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/chart/funnel/FunnelSeries": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/echarts",
        "node_modules/zrender/lib/core/util",
        "node_modules/echarts/lib/chart/helper/createListSimply",
        "node_modules/echarts/lib/util/model",
        "node_modules/echarts/lib/data/helper/sourceHelper",
        "node_modules/echarts/lib/visual/LegendVisualProvider"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/chart/funnel/FunnelView": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/util/graphic",
        "node_modules/zrender/lib/core/util",
        "node_modules/echarts/lib/view/Chart"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/chart/funnel/funnelLayout": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/util/layout",
        "node_modules/echarts/lib/util/number"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/chart/funnel": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/echarts",
        "node_modules/echarts/lib/chart/funnel/FunnelSeries",
        "node_modules/echarts/lib/chart/funnel/FunnelView",
        "node_modules/echarts/lib/visual/dataColor",
        "node_modules/echarts/lib/chart/funnel/funnelLayout",
        "node_modules/echarts/lib/processor/dataFilter"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/coord/parallel/parallelPreprocessor": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util",
        "node_modules/echarts/lib/util/model"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/coord/parallel/ParallelAxis": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util",
        "node_modules/echarts/lib/coord/Axis"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/component/helper/sliderMove": {
      "type": "js",
      "pkg": "p2"
    },
    "node_modules/echarts/lib/coord/parallel/Parallel": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util",
        "node_modules/zrender/lib/core/matrix",
        "node_modules/echarts/lib/util/layout",
        "node_modules/echarts/lib/coord/axisHelper",
        "node_modules/echarts/lib/coord/parallel/ParallelAxis",
        "node_modules/echarts/lib/util/graphic",
        "node_modules/echarts/lib/util/number",
        "node_modules/echarts/lib/component/helper/sliderMove"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/coord/parallel/parallelCreator": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/coord/parallel/Parallel",
        "node_modules/echarts/lib/CoordinateSystem"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/coord/parallel/AxisModel": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util",
        "node_modules/echarts/lib/model/Component",
        "node_modules/echarts/lib/model/mixin/makeStyleMapper",
        "node_modules/echarts/lib/coord/axisModelCreator",
        "node_modules/echarts/lib/util/number",
        "node_modules/echarts/lib/coord/axisModelCommonMixin"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/coord/parallel/ParallelModel": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util",
        "node_modules/echarts/lib/model/Component",
        "node_modules/echarts/lib/coord/parallel/AxisModel"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/component/axis/parallelAxisAction": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/echarts"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/component/helper/BrushController": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/config",
        "node_modules/zrender/lib/core/util",
        "node_modules/zrender/lib/mixin/Eventful",
        "node_modules/echarts/lib/util/graphic",
        "node_modules/echarts/lib/component/helper/interactionMutex",
        "node_modules/echarts/lib/data/DataDiffer"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/component/helper/brushHelper": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/BoundingRect",
        "node_modules/echarts/lib/component/helper/cursorHelper",
        "node_modules/echarts/lib/util/graphic"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/component/axis/ParallelAxisView": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/echarts",
        "node_modules/zrender/lib/core/util",
        "node_modules/echarts/lib/component/axis/AxisBuilder",
        "node_modules/echarts/lib/component/helper/BrushController",
        "node_modules/echarts/lib/component/helper/brushHelper",
        "node_modules/echarts/lib/util/graphic"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/component/parallelAxis": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/coord/parallel/parallelCreator",
        "node_modules/echarts/lib/component/axis/parallelAxisAction",
        "node_modules/echarts/lib/component/axis/ParallelAxisView"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/component/parallel": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/echarts",
        "node_modules/zrender/lib/core/util",
        "node_modules/echarts/lib/util/throttle",
        "node_modules/echarts/lib/coord/parallel/parallelPreprocessor",
        "node_modules/echarts/lib/coord/parallel/parallelCreator",
        "node_modules/echarts/lib/coord/parallel/ParallelModel",
        "node_modules/echarts/lib/component/parallelAxis"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/chart/parallel/ParallelSeries": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util",
        "node_modules/echarts/lib/model/Series",
        "node_modules/echarts/lib/chart/helper/createListFromArray"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/chart/parallel/ParallelView": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/util/graphic",
        "node_modules/echarts/lib/view/Chart"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/chart/parallel/parallelVisual": {
      "type": "js",
      "pkg": "p2"
    },
    "node_modules/echarts/lib/chart/parallel": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/echarts",
        "node_modules/echarts/lib/component/parallel",
        "node_modules/echarts/lib/chart/parallel/ParallelSeries",
        "node_modules/echarts/lib/chart/parallel/ParallelView",
        "node_modules/echarts/lib/chart/parallel/parallelVisual"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/chart/sankey/SankeySeries": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/model/Series",
        "node_modules/echarts/lib/chart/helper/createGraphFromNodeEdge",
        "node_modules/echarts/lib/util/format",
        "node_modules/echarts/lib/model/Model",
        "node_modules/echarts/lib/config"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/chart/sankey/SankeyView": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/util/graphic",
        "node_modules/echarts/lib/echarts",
        "node_modules/zrender/lib/core/util"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/chart/sankey/sankeyAction": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/echarts",
        "node_modules/echarts/lib/chart/helper/focusNodeAdjacencyAction"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/chart/sankey/sankeyLayout": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/util/layout",
        "node_modules/zrender/lib/core/util",
        "node_modules/echarts/lib/util/model"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/chart/sankey/sankeyVisual": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/visual/VisualMapping",
        "node_modules/zrender/lib/core/util"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/chart/sankey": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/echarts",
        "node_modules/echarts/lib/chart/sankey/SankeySeries",
        "node_modules/echarts/lib/chart/sankey/SankeyView",
        "node_modules/echarts/lib/chart/sankey/sankeyAction",
        "node_modules/echarts/lib/chart/sankey/sankeyLayout",
        "node_modules/echarts/lib/chart/sankey/sankeyVisual"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/chart/helper/whiskerBoxCommon": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/chart/helper/createListSimply",
        "node_modules/zrender/lib/core/util",
        "node_modules/echarts/lib/data/helper/dimensionHelper",
        "node_modules/echarts/lib/data/helper/sourceHelper"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/chart/boxplot/BoxplotSeries": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util",
        "node_modules/echarts/lib/model/Series",
        "node_modules/echarts/lib/chart/helper/whiskerBoxCommon"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/chart/boxplot/BoxplotView": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util",
        "node_modules/echarts/lib/view/Chart",
        "node_modules/echarts/lib/util/graphic",
        "node_modules/zrender/lib/graphic/Path"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/chart/boxplot/boxplotVisual": {
      "type": "js",
      "pkg": "p2"
    },
    "node_modules/echarts/lib/chart/boxplot/boxplotLayout": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util",
        "node_modules/echarts/lib/util/number"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/chart/boxplot": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/echarts",
        "node_modules/echarts/lib/chart/boxplot/BoxplotSeries",
        "node_modules/echarts/lib/chart/boxplot/BoxplotView",
        "node_modules/echarts/lib/chart/boxplot/boxplotVisual",
        "node_modules/echarts/lib/chart/boxplot/boxplotLayout"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/chart/candlestick/CandlestickSeries": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util",
        "node_modules/echarts/lib/model/Series",
        "node_modules/echarts/lib/chart/helper/whiskerBoxCommon"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/chart/candlestick/CandlestickView": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util",
        "node_modules/echarts/lib/view/Chart",
        "node_modules/echarts/lib/util/graphic",
        "node_modules/zrender/lib/graphic/Path",
        "node_modules/echarts/lib/chart/helper/createClipPathFromCoordSys"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/chart/candlestick/preprocessor": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/chart/candlestick/candlestickVisual": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/chart/helper/createRenderPlanner"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/chart/candlestick/candlestickLayout": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/util/graphic",
        "node_modules/echarts/lib/chart/helper/createRenderPlanner",
        "node_modules/echarts/lib/util/number",
        "node_modules/zrender/lib/core/util"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/chart/candlestick": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/echarts",
        "node_modules/echarts/lib/chart/candlestick/CandlestickSeries",
        "node_modules/echarts/lib/chart/candlestick/CandlestickView",
        "node_modules/echarts/lib/chart/candlestick/preprocessor",
        "node_modules/echarts/lib/chart/candlestick/candlestickVisual",
        "node_modules/echarts/lib/chart/candlestick/candlestickLayout"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/chart/effectScatter/EffectScatterSeries": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/chart/helper/createListFromArray",
        "node_modules/echarts/lib/model/Series"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/chart/helper/EffectSymbol": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util",
        "node_modules/echarts/lib/util/symbol",
        "node_modules/echarts/lib/util/graphic",
        "node_modules/echarts/lib/util/number",
        "node_modules/echarts/lib/chart/helper/Symbol"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/chart/effectScatter/EffectScatterView": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/echarts",
        "node_modules/echarts/lib/chart/helper/SymbolDraw",
        "node_modules/echarts/lib/chart/helper/EffectSymbol",
        "node_modules/zrender/lib/core/matrix",
        "node_modules/echarts/lib/layout/points"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/chart/effectScatter": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/echarts",
        "node_modules/echarts/lib/chart/effectScatter/EffectScatterSeries",
        "node_modules/echarts/lib/chart/effectScatter/EffectScatterView",
        "node_modules/echarts/lib/visual/symbol",
        "node_modules/echarts/lib/layout/points"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/chart/lines/LinesSeries": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/config",
        "node_modules/echarts/lib/model/Series",
        "node_modules/echarts/lib/data/List",
        "node_modules/zrender/lib/core/util",
        "node_modules/echarts/lib/util/format",
        "node_modules/echarts/lib/CoordinateSystem"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/chart/helper/EffectLine": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/util/graphic",
        "node_modules/echarts/lib/chart/helper/Line",
        "node_modules/zrender/lib/core/util",
        "node_modules/echarts/lib/util/symbol",
        "node_modules/zrender/lib/core/vector",
        "node_modules/zrender/lib/core/curve"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/chart/helper/Polyline": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/util/graphic",
        "node_modules/zrender/lib/core/util"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/chart/helper/EffectPolyline": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/chart/helper/Polyline",
        "node_modules/zrender/lib/core/util",
        "node_modules/echarts/lib/chart/helper/EffectLine",
        "node_modules/zrender/lib/core/vector"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/chart/helper/LargeLineDraw": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/util/graphic",
        "node_modules/zrender/lib/graphic/IncrementalDisplayable",
        "node_modules/zrender/lib/contain/line",
        "node_modules/zrender/lib/contain/quadratic"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/chart/lines/linesLayout": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/chart/helper/createRenderPlanner"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/chart/lines/LinesView": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/config",
        "node_modules/echarts/lib/echarts",
        "node_modules/echarts/lib/chart/helper/LineDraw",
        "node_modules/echarts/lib/chart/helper/EffectLine",
        "node_modules/echarts/lib/chart/helper/Line",
        "node_modules/echarts/lib/chart/helper/Polyline",
        "node_modules/echarts/lib/chart/helper/EffectPolyline",
        "node_modules/echarts/lib/chart/helper/LargeLineDraw",
        "node_modules/echarts/lib/chart/lines/linesLayout",
        "node_modules/echarts/lib/chart/helper/createClipPathFromCoordSys"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/chart/lines/linesVisual": {
      "type": "js",
      "pkg": "p2"
    },
    "node_modules/echarts/lib/chart/lines": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/echarts",
        "node_modules/echarts/lib/chart/lines/LinesSeries",
        "node_modules/echarts/lib/chart/lines/LinesView",
        "node_modules/echarts/lib/chart/lines/linesLayout",
        "node_modules/echarts/lib/chart/lines/linesVisual"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/chart/heatmap/HeatmapSeries": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/model/Series",
        "node_modules/echarts/lib/chart/helper/createListFromArray",
        "node_modules/echarts/lib/CoordinateSystem"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/chart/heatmap/HeatmapLayer": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/chart/heatmap/HeatmapView": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/config",
        "node_modules/echarts/lib/echarts",
        "node_modules/echarts/lib/util/graphic",
        "node_modules/echarts/lib/chart/heatmap/HeatmapLayer",
        "node_modules/zrender/lib/core/util"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/chart/heatmap": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/chart/heatmap/HeatmapSeries",
        "node_modules/echarts/lib/chart/heatmap/HeatmapView"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/chart/bar/PictorialBarSeries": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/chart/bar/BaseBarSeries"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/chart/bar/PictorialBarView": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/echarts",
        "node_modules/zrender/lib/core/util",
        "node_modules/echarts/lib/util/graphic",
        "node_modules/echarts/lib/util/symbol",
        "node_modules/echarts/lib/util/number",
        "node_modules/echarts/lib/chart/bar/helper"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/chart/pictorialBar": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/echarts",
        "node_modules/zrender/lib/core/util",
        "node_modules/echarts/lib/coord/cartesian/Grid",
        "node_modules/echarts/lib/chart/bar/PictorialBarSeries",
        "node_modules/echarts/lib/chart/bar/PictorialBarView",
        "node_modules/echarts/lib/layout/barGrid",
        "node_modules/echarts/lib/visual/symbol",
        "node_modules/echarts/lib/component/gridSimple"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/coord/single/SingleAxis": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util",
        "node_modules/echarts/lib/coord/Axis"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/coord/single/Single": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/coord/single/SingleAxis",
        "node_modules/echarts/lib/coord/axisHelper",
        "node_modules/echarts/lib/util/layout",
        "node_modules/zrender/lib/core/util"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/coord/single/singleCreator": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/coord/single/Single",
        "node_modules/echarts/lib/CoordinateSystem"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/coord/single/singleAxisHelper": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/component/axis/SingleAxisView": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util",
        "node_modules/echarts/lib/component/axis/AxisBuilder",
        "node_modules/echarts/lib/util/graphic",
        "node_modules/echarts/lib/coord/single/singleAxisHelper",
        "node_modules/echarts/lib/component/axis/AxisView"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/coord/single/AxisModel": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util",
        "node_modules/echarts/lib/model/Component",
        "node_modules/echarts/lib/coord/axisModelCreator",
        "node_modules/echarts/lib/coord/axisModelCommonMixin"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/component/axisPointer/findPointFromSeries": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util",
        "node_modules/echarts/lib/util/model"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/component/axisPointer/axisTrigger": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util",
        "node_modules/echarts/lib/util/model",
        "node_modules/echarts/lib/component/axisPointer/modelHelper",
        "node_modules/echarts/lib/component/axisPointer/findPointFromSeries"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/component/axisPointer/AxisPointerModel": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/echarts"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/component/axisPointer/globalListener": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util",
        "node_modules/zrender/lib/core/env",
        "node_modules/echarts/lib/util/model"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/component/axisPointer/AxisPointerView": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/echarts",
        "node_modules/echarts/lib/component/axisPointer/globalListener"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/component/axisPointer/BaseAxisPointer": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util",
        "node_modules/echarts/lib/util/clazz",
        "node_modules/echarts/lib/util/graphic",
        "node_modules/echarts/lib/component/axisPointer/modelHelper",
        "node_modules/zrender/lib/core/event",
        "node_modules/echarts/lib/util/throttle",
        "node_modules/echarts/lib/util/model"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/component/axisPointer/viewHelper": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util",
        "node_modules/echarts/lib/util/graphic",
        "node_modules/zrender/lib/contain/text",
        "node_modules/echarts/lib/util/format",
        "node_modules/zrender/lib/core/matrix",
        "node_modules/echarts/lib/coord/axisHelper",
        "node_modules/echarts/lib/component/axis/AxisBuilder"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/component/axisPointer/CartesianAxisPointer": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/component/axisPointer/BaseAxisPointer",
        "node_modules/echarts/lib/component/axisPointer/viewHelper",
        "node_modules/echarts/lib/coord/cartesian/cartesianAxisHelper",
        "node_modules/echarts/lib/component/axis/AxisView"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/component/axisPointer": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/echarts",
        "node_modules/zrender/lib/core/util",
        "node_modules/echarts/lib/component/axisPointer/modelHelper",
        "node_modules/echarts/lib/component/axisPointer/axisTrigger",
        "node_modules/echarts/lib/component/axisPointer/AxisPointerModel",
        "node_modules/echarts/lib/component/axisPointer/AxisPointerView",
        "node_modules/echarts/lib/component/axisPointer/CartesianAxisPointer"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/component/axisPointer/SingleAxisPointer": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/component/axisPointer/BaseAxisPointer",
        "node_modules/echarts/lib/component/axisPointer/viewHelper",
        "node_modules/echarts/lib/coord/single/singleAxisHelper",
        "node_modules/echarts/lib/component/axis/AxisView"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/component/singleAxis": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/echarts",
        "node_modules/echarts/lib/coord/single/singleCreator",
        "node_modules/echarts/lib/component/axis/SingleAxisView",
        "node_modules/echarts/lib/coord/single/AxisModel",
        "node_modules/echarts/lib/component/axisPointer",
        "node_modules/echarts/lib/component/axisPointer/SingleAxisPointer"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/chart/themeRiver/ThemeRiverSeries": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/model/Series",
        "node_modules/echarts/lib/data/helper/createDimensions",
        "node_modules/echarts/lib/data/helper/dimensionHelper",
        "node_modules/echarts/lib/data/List",
        "node_modules/zrender/lib/core/util",
        "node_modules/echarts/lib/util/model",
        "node_modules/echarts/lib/util/format",
        "node_modules/echarts/lib/visual/LegendVisualProvider"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/chart/themeRiver/ThemeRiverView": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/echarts",
        "node_modules/echarts/lib/chart/line/poly",
        "node_modules/echarts/lib/util/graphic",
        "node_modules/zrender/lib/core/util",
        "node_modules/echarts/lib/data/DataDiffer"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/chart/themeRiver/themeRiverLayout": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util",
        "node_modules/echarts/lib/util/number"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/chart/themeRiver/themeRiverVisual": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/chart/themeRiver": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/echarts",
        "node_modules/echarts/lib/component/singleAxis",
        "node_modules/echarts/lib/chart/themeRiver/ThemeRiverSeries",
        "node_modules/echarts/lib/chart/themeRiver/ThemeRiverView",
        "node_modules/echarts/lib/chart/themeRiver/themeRiverLayout",
        "node_modules/echarts/lib/chart/themeRiver/themeRiverVisual",
        "node_modules/echarts/lib/processor/dataFilter"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/chart/sunburst/SunburstSeries": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util",
        "node_modules/echarts/lib/model/Series",
        "node_modules/echarts/lib/data/Tree",
        "node_modules/echarts/lib/chart/helper/treeHelper"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/chart/sunburst/SunburstPiece": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util",
        "node_modules/echarts/lib/util/graphic"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/chart/sunburst/SunburstView": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util",
        "node_modules/echarts/lib/view/Chart",
        "node_modules/echarts/lib/chart/sunburst/SunburstPiece",
        "node_modules/echarts/lib/data/DataDiffer"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/chart/sunburst/sunburstAction": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/echarts",
        "node_modules/echarts/lib/chart/helper/treeHelper"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/chart/sunburst/sunburstLayout": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/util/number",
        "node_modules/zrender/lib/core/util"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/chart/sunburst": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/echarts",
        "node_modules/zrender/lib/core/util",
        "node_modules/echarts/lib/chart/sunburst/SunburstSeries",
        "node_modules/echarts/lib/chart/sunburst/SunburstView",
        "node_modules/echarts/lib/chart/sunburst/sunburstAction",
        "node_modules/echarts/lib/visual/dataColor",
        "node_modules/echarts/lib/chart/sunburst/sunburstLayout",
        "node_modules/echarts/lib/processor/dataFilter"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/coord/cartesian/prepareCustom": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/coord/geo/prepareCustom": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/coord/single/prepareCustom": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/coord/polar/prepareCustom": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/coord/calendar/prepareCustom": {
      "type": "js",
      "pkg": "p2"
    },
    "node_modules/echarts/lib/chart/custom": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/config",
        "node_modules/zrender/lib/core/util",
        "node_modules/echarts/lib/util/graphic",
        "node_modules/echarts/lib/chart/helper/labelHelper",
        "node_modules/echarts/lib/chart/helper/createListFromArray",
        "node_modules/echarts/lib/layout/barGrid",
        "node_modules/echarts/lib/data/DataDiffer",
        "node_modules/echarts/lib/model/Series",
        "node_modules/echarts/lib/model/Model",
        "node_modules/echarts/lib/view/Chart",
        "node_modules/echarts/lib/chart/helper/createClipPathFromCoordSys",
        "node_modules/echarts/lib/coord/cartesian/prepareCustom",
        "node_modules/echarts/lib/coord/geo/prepareCustom",
        "node_modules/echarts/lib/coord/single/prepareCustom",
        "node_modules/echarts/lib/coord/polar/prepareCustom",
        "node_modules/echarts/lib/coord/calendar/prepareCustom"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/component/grid": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/component/gridSimple",
        "node_modules/echarts/lib/component/axisPointer/CartesianAxisPointer",
        "node_modules/echarts/lib/component/axisPointer"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/layout/barPolar": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util",
        "node_modules/echarts/lib/util/number",
        "node_modules/echarts/lib/data/helper/dataStackHelper"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/coord/polar/RadiusAxis": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util",
        "node_modules/echarts/lib/coord/Axis"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/coord/polar/AngleAxis": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util",
        "node_modules/zrender/lib/contain/text",
        "node_modules/echarts/lib/coord/Axis",
        "node_modules/echarts/lib/util/model"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/coord/polar/Polar": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/coord/polar/RadiusAxis",
        "node_modules/echarts/lib/coord/polar/AngleAxis"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/coord/polar/AxisModel": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util",
        "node_modules/echarts/lib/model/Component",
        "node_modules/echarts/lib/coord/axisModelCreator",
        "node_modules/echarts/lib/coord/axisModelCommonMixin"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/coord/polar/PolarModel": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/echarts",
        "node_modules/echarts/lib/coord/polar/AxisModel"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/coord/polar/polarCreator": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/config",
        "node_modules/zrender/lib/core/util",
        "node_modules/echarts/lib/coord/polar/Polar",
        "node_modules/echarts/lib/util/number",
        "node_modules/echarts/lib/coord/axisHelper",
        "node_modules/echarts/lib/CoordinateSystem",
        "node_modules/echarts/lib/data/helper/dataStackHelper",
        "node_modules/echarts/lib/coord/polar/PolarModel"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/component/axis/AngleAxisView": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util",
        "node_modules/echarts/lib/util/graphic",
        "node_modules/echarts/lib/model/Model",
        "node_modules/echarts/lib/component/axis/AxisView",
        "node_modules/echarts/lib/component/axis/AxisBuilder"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/component/angleAxis": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/coord/polar/polarCreator",
        "node_modules/echarts/lib/component/axis/AngleAxisView"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/component/axis/RadiusAxisView": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util",
        "node_modules/echarts/lib/util/graphic",
        "node_modules/echarts/lib/component/axis/AxisBuilder",
        "node_modules/echarts/lib/component/axis/AxisView"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/component/radiusAxis": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/coord/polar/polarCreator",
        "node_modules/echarts/lib/component/axis/RadiusAxisView"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/component/axisPointer/PolarAxisPointer": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/util/format",
        "node_modules/echarts/lib/component/axisPointer/BaseAxisPointer",
        "node_modules/echarts/lib/util/graphic",
        "node_modules/echarts/lib/component/axisPointer/viewHelper",
        "node_modules/zrender/lib/core/matrix",
        "node_modules/echarts/lib/component/axis/AxisBuilder",
        "node_modules/echarts/lib/component/axis/AxisView"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/component/polar": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/echarts",
        "node_modules/zrender/lib/core/util",
        "node_modules/echarts/lib/layout/barPolar",
        "node_modules/echarts/lib/coord/polar/polarCreator",
        "node_modules/echarts/lib/component/angleAxis",
        "node_modules/echarts/lib/component/radiusAxis",
        "node_modules/echarts/lib/component/axisPointer",
        "node_modules/echarts/lib/component/axisPointer/PolarAxisPointer"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/coord/geo/GeoModel": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util",
        "node_modules/echarts/lib/util/model",
        "node_modules/echarts/lib/model/Component",
        "node_modules/echarts/lib/model/Model",
        "node_modules/echarts/lib/component/helper/selectableMixin",
        "node_modules/echarts/lib/coord/geo/geoCreator"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/component/geo/GeoView": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/component/helper/MapDraw",
        "node_modules/echarts/lib/echarts"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/component/geo": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/echarts",
        "node_modules/zrender/lib/core/util",
        "node_modules/echarts/lib/coord/geo/GeoModel",
        "node_modules/echarts/lib/coord/geo/geoCreator",
        "node_modules/echarts/lib/component/geo/GeoView",
        "node_modules/echarts/lib/action/geoRoam"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/coord/calendar/Calendar": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util",
        "node_modules/echarts/lib/util/layout",
        "node_modules/echarts/lib/util/number",
        "node_modules/echarts/lib/CoordinateSystem"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/coord/calendar/CalendarModel": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util",
        "node_modules/echarts/lib/model/Component",
        "node_modules/echarts/lib/util/layout"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/component/calendar/CalendarView": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/echarts",
        "node_modules/zrender/lib/core/util",
        "node_modules/echarts/lib/util/graphic",
        "node_modules/echarts/lib/util/format",
        "node_modules/echarts/lib/util/number"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/component/calendar": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/coord/calendar/Calendar",
        "node_modules/echarts/lib/coord/calendar/CalendarModel",
        "node_modules/echarts/lib/component/calendar/CalendarView"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/component/graphic": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/config",
        "node_modules/echarts/lib/echarts",
        "node_modules/zrender/lib/core/util",
        "node_modules/echarts/lib/util/model",
        "node_modules/echarts/lib/util/graphic",
        "node_modules/echarts/lib/util/layout",
        "node_modules/echarts/lib/util/number"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/component/toolbox/featureManager": {
      "type": "js",
      "pkg": "p2"
    },
    "node_modules/echarts/lib/component/toolbox/ToolboxModel": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/echarts",
        "node_modules/zrender/lib/core/util",
        "node_modules/echarts/lib/component/toolbox/featureManager"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/component/helper/listComponent": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/util/layout",
        "node_modules/echarts/lib/util/format",
        "node_modules/echarts/lib/util/graphic"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/component/toolbox/ToolboxView": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/echarts",
        "node_modules/zrender/lib/core/util",
        "node_modules/zrender/lib/contain/text",
        "node_modules/echarts/lib/component/toolbox/featureManager",
        "node_modules/echarts/lib/util/graphic",
        "node_modules/echarts/lib/model/Model",
        "node_modules/echarts/lib/data/DataDiffer",
        "node_modules/echarts/lib/component/helper/listComponent"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/component/toolbox/feature/SaveAsImage": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/env",
        "node_modules/echarts/lib/lang",
        "node_modules/echarts/lib/component/toolbox/featureManager"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/component/toolbox/feature/MagicType": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/echarts",
        "node_modules/zrender/lib/core/util",
        "node_modules/echarts/lib/lang",
        "node_modules/echarts/lib/component/toolbox/featureManager"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/component/toolbox/feature/DataView": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/echarts",
        "node_modules/zrender/lib/core/util",
        "node_modules/zrender/lib/core/event",
        "node_modules/echarts/lib/lang",
        "node_modules/echarts/lib/component/toolbox/featureManager"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/component/helper/BrushTargetManager": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/config",
        "node_modules/zrender/lib/core/util",
        "node_modules/echarts/lib/util/graphic",
        "node_modules/echarts/lib/util/model",
        "node_modules/echarts/lib/component/helper/brushHelper"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/component/dataZoom/history": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/component/dataZoom/typeDefaulter": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/model/Component"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/component/dataZoom/helper": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util",
        "node_modules/echarts/lib/util/format"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/component/dataZoom/AxisProxy": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util",
        "node_modules/echarts/lib/util/number",
        "node_modules/echarts/lib/component/dataZoom/helper",
        "node_modules/echarts/lib/component/helper/sliderMove"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/component/dataZoom/DataZoomModel": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/config",
        "node_modules/echarts/lib/echarts",
        "node_modules/zrender/lib/core/util",
        "node_modules/zrender/lib/core/env",
        "node_modules/echarts/lib/util/model",
        "node_modules/echarts/lib/component/dataZoom/helper",
        "node_modules/echarts/lib/component/dataZoom/AxisProxy"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/component/dataZoom/DataZoomView": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/view/Component"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/component/dataZoom/SelectZoomModel": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/component/dataZoom/DataZoomModel"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/component/dataZoom/SelectZoomView": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/component/dataZoom/DataZoomView"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/component/dataZoom/dataZoomProcessor": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/echarts",
        "node_modules/zrender/lib/core/util"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/component/dataZoom/dataZoomAction": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/echarts",
        "node_modules/zrender/lib/core/util",
        "node_modules/echarts/lib/component/dataZoom/helper"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/component/dataZoomSelect": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/component/dataZoom/typeDefaulter",
        "node_modules/echarts/lib/component/dataZoom/DataZoomModel",
        "node_modules/echarts/lib/component/dataZoom/DataZoomView",
        "node_modules/echarts/lib/component/dataZoom/SelectZoomModel",
        "node_modules/echarts/lib/component/dataZoom/SelectZoomView",
        "node_modules/echarts/lib/component/dataZoom/dataZoomProcessor",
        "node_modules/echarts/lib/component/dataZoom/dataZoomAction"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/component/toolbox/feature/DataZoom": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/echarts",
        "node_modules/zrender/lib/core/util",
        "node_modules/echarts/lib/component/helper/BrushController",
        "node_modules/echarts/lib/component/helper/BrushTargetManager",
        "node_modules/echarts/lib/component/dataZoom/history",
        "node_modules/echarts/lib/component/helper/sliderMove",
        "node_modules/echarts/lib/lang",
        "node_modules/echarts/lib/component/toolbox/featureManager",
        "node_modules/echarts/lib/component/dataZoomSelect"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/component/toolbox/feature/Restore": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/echarts",
        "node_modules/echarts/lib/component/dataZoom/history",
        "node_modules/echarts/lib/lang",
        "node_modules/echarts/lib/component/toolbox/featureManager"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/component/toolbox": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/component/toolbox/ToolboxModel",
        "node_modules/echarts/lib/component/toolbox/ToolboxView",
        "node_modules/echarts/lib/component/toolbox/feature/SaveAsImage",
        "node_modules/echarts/lib/component/toolbox/feature/MagicType",
        "node_modules/echarts/lib/component/toolbox/feature/DataView",
        "node_modules/echarts/lib/component/toolbox/feature/DataZoom",
        "node_modules/echarts/lib/component/toolbox/feature/Restore"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/component/tooltip/TooltipModel": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/echarts"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/component/tooltip/TooltipContent": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util",
        "node_modules/zrender/lib/tool/color",
        "node_modules/zrender/lib/core/event",
        "node_modules/zrender/lib/core/env",
        "node_modules/echarts/lib/util/format"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/component/tooltip/TooltipRichContent": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util",
        "node_modules/zrender/lib/graphic/Text"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/component/tooltip/TooltipView": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/echarts",
        "node_modules/zrender/lib/core/util",
        "node_modules/zrender/lib/core/env",
        "node_modules/echarts/lib/component/tooltip/TooltipContent",
        "node_modules/echarts/lib/component/tooltip/TooltipRichContent",
        "node_modules/echarts/lib/util/format",
        "node_modules/echarts/lib/util/number",
        "node_modules/echarts/lib/util/graphic",
        "node_modules/echarts/lib/component/axisPointer/findPointFromSeries",
        "node_modules/echarts/lib/util/layout",
        "node_modules/echarts/lib/model/Model",
        "node_modules/echarts/lib/component/axisPointer/globalListener",
        "node_modules/echarts/lib/coord/axisHelper",
        "node_modules/echarts/lib/component/axisPointer/viewHelper",
        "node_modules/echarts/lib/util/model"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/component/tooltip": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/echarts",
        "node_modules/echarts/lib/component/axisPointer",
        "node_modules/echarts/lib/component/tooltip/TooltipModel",
        "node_modules/echarts/lib/component/tooltip/TooltipView"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/component/brush/preprocessor": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/visual/visualSolution": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util",
        "node_modules/echarts/lib/visual/VisualMapping"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/component/brush/selector": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/contain/polygon",
        "node_modules/zrender/lib/core/BoundingRect",
        "node_modules/echarts/lib/util/graphic"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/component/brush/visualEncoding": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/echarts",
        "node_modules/zrender/lib/core/util",
        "node_modules/zrender/lib/core/BoundingRect",
        "node_modules/echarts/lib/visual/visualSolution",
        "node_modules/echarts/lib/component/brush/selector",
        "node_modules/echarts/lib/util/throttle",
        "node_modules/echarts/lib/component/helper/BrushTargetManager"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/component/brush/BrushModel": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/config",
        "node_modules/echarts/lib/echarts",
        "node_modules/zrender/lib/core/util",
        "node_modules/echarts/lib/visual/visualSolution",
        "node_modules/echarts/lib/model/Model"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/component/brush/BrushView": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/echarts",
        "node_modules/zrender/lib/core/util",
        "node_modules/echarts/lib/component/helper/BrushController"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/component/brush/brushAction": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/echarts"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/component/toolbox/feature/Brush": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util",
        "node_modules/echarts/lib/component/toolbox/featureManager",
        "node_modules/echarts/lib/lang"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/component/brush": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/echarts",
        "node_modules/echarts/lib/component/brush/preprocessor",
        "node_modules/echarts/lib/component/brush/visualEncoding",
        "node_modules/echarts/lib/component/brush/BrushModel",
        "node_modules/echarts/lib/component/brush/BrushView",
        "node_modules/echarts/lib/component/brush/brushAction",
        "node_modules/echarts/lib/component/toolbox/feature/Brush"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/component/title": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util",
        "node_modules/echarts/lib/echarts",
        "node_modules/echarts/lib/util/graphic",
        "node_modules/echarts/lib/util/layout"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/component/timeline/preprocessor": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/component/timeline/typeDefaulter": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/model/Component"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/component/timeline/timelineAction": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/echarts",
        "node_modules/zrender/lib/core/util"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/component/timeline/TimelineModel": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util",
        "node_modules/echarts/lib/model/Component",
        "node_modules/echarts/lib/data/List",
        "node_modules/echarts/lib/util/model"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/component/timeline/SliderTimelineModel": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util",
        "node_modules/echarts/lib/component/timeline/TimelineModel",
        "node_modules/echarts/lib/model/mixin/dataFormat"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/component/timeline/TimelineView": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/view/Component"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/component/timeline/TimelineAxis": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util",
        "node_modules/echarts/lib/coord/Axis"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/component/timeline/SliderTimelineView": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util",
        "node_modules/zrender/lib/core/BoundingRect",
        "node_modules/zrender/lib/core/matrix",
        "node_modules/echarts/lib/util/graphic",
        "node_modules/echarts/lib/util/layout",
        "node_modules/echarts/lib/component/timeline/TimelineView",
        "node_modules/echarts/lib/component/timeline/TimelineAxis",
        "node_modules/echarts/lib/util/symbol",
        "node_modules/echarts/lib/coord/axisHelper",
        "node_modules/echarts/lib/util/number",
        "node_modules/echarts/lib/util/format"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/component/timeline": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/echarts",
        "node_modules/echarts/lib/component/timeline/preprocessor",
        "node_modules/echarts/lib/component/timeline/typeDefaulter",
        "node_modules/echarts/lib/component/timeline/timelineAction",
        "node_modules/echarts/lib/component/timeline/SliderTimelineModel",
        "node_modules/echarts/lib/component/timeline/SliderTimelineView"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/component/marker/MarkerModel": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/config",
        "node_modules/echarts/lib/echarts",
        "node_modules/zrender/lib/core/util",
        "node_modules/zrender/lib/core/env",
        "node_modules/echarts/lib/util/model",
        "node_modules/echarts/lib/util/format",
        "node_modules/echarts/lib/model/mixin/dataFormat"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/component/marker/MarkPointModel": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/component/marker/MarkerModel"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/component/marker/markerHelper": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util",
        "node_modules/echarts/lib/util/number",
        "node_modules/echarts/lib/data/helper/dataStackHelper"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/component/marker/MarkerView": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/echarts",
        "node_modules/zrender/lib/core/util"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/component/marker/MarkPointView": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util",
        "node_modules/echarts/lib/chart/helper/SymbolDraw",
        "node_modules/echarts/lib/util/number",
        "node_modules/echarts/lib/data/List",
        "node_modules/echarts/lib/component/marker/markerHelper",
        "node_modules/echarts/lib/component/marker/MarkerView"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/component/markPoint": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/echarts",
        "node_modules/echarts/lib/component/marker/MarkPointModel",
        "node_modules/echarts/lib/component/marker/MarkPointView"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/component/marker/MarkLineModel": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/component/marker/MarkerModel"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/component/marker/MarkLineView": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util",
        "node_modules/echarts/lib/data/List",
        "node_modules/echarts/lib/util/number",
        "node_modules/echarts/lib/component/marker/markerHelper",
        "node_modules/echarts/lib/chart/helper/LineDraw",
        "node_modules/echarts/lib/component/marker/MarkerView",
        "node_modules/echarts/lib/data/helper/dataStackHelper"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/component/markLine": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/echarts",
        "node_modules/echarts/lib/component/marker/MarkLineModel",
        "node_modules/echarts/lib/component/marker/MarkLineView"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/component/marker/MarkAreaModel": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/component/marker/MarkerModel"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/component/marker/MarkAreaView": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util",
        "node_modules/zrender/lib/tool/color",
        "node_modules/echarts/lib/data/List",
        "node_modules/echarts/lib/util/number",
        "node_modules/echarts/lib/util/graphic",
        "node_modules/echarts/lib/component/marker/markerHelper",
        "node_modules/echarts/lib/component/marker/MarkerView"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/component/markArea": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/echarts",
        "node_modules/echarts/lib/component/marker/MarkAreaModel",
        "node_modules/echarts/lib/component/marker/MarkAreaView"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/component/legend/LegendModel": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/echarts",
        "node_modules/zrender/lib/core/util",
        "node_modules/echarts/lib/model/Model",
        "node_modules/echarts/lib/util/model",
        "node_modules/echarts/lib/lang"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/component/legend/legendAction": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/echarts",
        "node_modules/zrender/lib/core/util"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/component/legend/LegendView": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/config",
        "node_modules/echarts/lib/echarts",
        "node_modules/zrender/lib/core/util",
        "node_modules/echarts/lib/util/symbol",
        "node_modules/echarts/lib/util/graphic",
        "node_modules/echarts/lib/component/helper/listComponent",
        "node_modules/echarts/lib/util/layout"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/component/legend/legendFilter": {
      "type": "js",
      "pkg": "p2"
    },
    "node_modules/echarts/lib/component/legend": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/echarts",
        "node_modules/echarts/lib/component/legend/LegendModel",
        "node_modules/echarts/lib/component/legend/legendAction",
        "node_modules/echarts/lib/component/legend/LegendView",
        "node_modules/echarts/lib/component/legend/legendFilter",
        "node_modules/echarts/lib/model/Component"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/component/legend/ScrollableLegendModel": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/component/legend/LegendModel",
        "node_modules/echarts/lib/util/layout"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/component/legend/ScrollableLegendView": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util",
        "node_modules/echarts/lib/util/graphic",
        "node_modules/echarts/lib/util/layout",
        "node_modules/echarts/lib/component/legend/LegendView"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/component/legend/scrollableLegendAction": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/echarts"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/component/legendScroll": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/component/legend",
        "node_modules/echarts/lib/component/legend/ScrollableLegendModel",
        "node_modules/echarts/lib/component/legend/ScrollableLegendView",
        "node_modules/echarts/lib/component/legend/scrollableLegendAction"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/component/dataZoom/SliderZoomModel": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/component/dataZoom/DataZoomModel"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/component/dataZoom/SliderZoomView": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util",
        "node_modules/zrender/lib/core/event",
        "node_modules/echarts/lib/util/graphic",
        "node_modules/echarts/lib/util/throttle",
        "node_modules/echarts/lib/component/dataZoom/DataZoomView",
        "node_modules/echarts/lib/util/number",
        "node_modules/echarts/lib/util/layout",
        "node_modules/echarts/lib/component/helper/sliderMove"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/component/dataZoomSlider": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/component/dataZoom/typeDefaulter",
        "node_modules/echarts/lib/component/dataZoom/DataZoomModel",
        "node_modules/echarts/lib/component/dataZoom/DataZoomView",
        "node_modules/echarts/lib/component/dataZoom/SliderZoomModel",
        "node_modules/echarts/lib/component/dataZoom/SliderZoomView",
        "node_modules/echarts/lib/component/dataZoom/dataZoomProcessor",
        "node_modules/echarts/lib/component/dataZoom/dataZoomAction"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/component/dataZoom/InsideZoomModel": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/component/dataZoom/DataZoomModel"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/component/dataZoom/roams": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util",
        "node_modules/echarts/lib/component/helper/RoamController",
        "node_modules/echarts/lib/util/throttle"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/component/dataZoom/InsideZoomView": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util",
        "node_modules/echarts/lib/component/dataZoom/DataZoomView",
        "node_modules/echarts/lib/component/helper/sliderMove",
        "node_modules/echarts/lib/component/dataZoom/roams"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/component/dataZoomInside": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/component/dataZoom/typeDefaulter",
        "node_modules/echarts/lib/component/dataZoom/DataZoomModel",
        "node_modules/echarts/lib/component/dataZoom/DataZoomView",
        "node_modules/echarts/lib/component/dataZoom/InsideZoomModel",
        "node_modules/echarts/lib/component/dataZoom/InsideZoomView",
        "node_modules/echarts/lib/component/dataZoom/dataZoomProcessor",
        "node_modules/echarts/lib/component/dataZoom/dataZoomAction"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/component/dataZoom": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/component/dataZoomSlider",
        "node_modules/echarts/lib/component/dataZoomInside"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/component/visualMap/preprocessor": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/component/visualMap/typeDefaulter": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/model/Component"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/component/visualMap/visualEncoding": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/echarts",
        "node_modules/zrender/lib/core/util",
        "node_modules/echarts/lib/visual/visualSolution",
        "node_modules/echarts/lib/visual/VisualMapping"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/visual/visualDefault": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/component/visualMap/VisualMapModel": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/echarts",
        "node_modules/zrender/lib/core/util",
        "node_modules/zrender/lib/core/env",
        "node_modules/echarts/lib/visual/visualDefault",
        "node_modules/echarts/lib/visual/VisualMapping",
        "node_modules/echarts/lib/visual/visualSolution",
        "node_modules/echarts/lib/util/model",
        "node_modules/echarts/lib/util/number"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/component/visualMap/ContinuousModel": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util",
        "node_modules/echarts/lib/component/visualMap/VisualMapModel",
        "node_modules/echarts/lib/util/number"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/component/visualMap/VisualMapView": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/echarts",
        "node_modules/zrender/lib/core/util",
        "node_modules/echarts/lib/util/graphic",
        "node_modules/echarts/lib/util/format",
        "node_modules/echarts/lib/util/layout",
        "node_modules/echarts/lib/visual/VisualMapping"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/component/visualMap/helper": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util",
        "node_modules/echarts/lib/util/layout"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/component/visualMap/ContinuousView": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util",
        "node_modules/zrender/lib/graphic/LinearGradient",
        "node_modules/zrender/lib/core/event",
        "node_modules/echarts/lib/component/visualMap/VisualMapView",
        "node_modules/echarts/lib/util/graphic",
        "node_modules/echarts/lib/util/number",
        "node_modules/echarts/lib/component/helper/sliderMove",
        "node_modules/echarts/lib/component/visualMap/helper",
        "node_modules/echarts/lib/util/model"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/component/visualMap/visualMapAction": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/echarts"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/component/visualMapContinuous": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/echarts",
        "node_modules/echarts/lib/component/visualMap/preprocessor",
        "node_modules/echarts/lib/component/visualMap/typeDefaulter",
        "node_modules/echarts/lib/component/visualMap/visualEncoding",
        "node_modules/echarts/lib/component/visualMap/ContinuousModel",
        "node_modules/echarts/lib/component/visualMap/ContinuousView",
        "node_modules/echarts/lib/component/visualMap/visualMapAction"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/component/visualMap/PiecewiseModel": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/config",
        "node_modules/zrender/lib/core/util",
        "node_modules/echarts/lib/component/visualMap/VisualMapModel",
        "node_modules/echarts/lib/visual/VisualMapping",
        "node_modules/echarts/lib/visual/visualDefault",
        "node_modules/echarts/lib/util/number"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/component/visualMap/PiecewiseView": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util",
        "node_modules/echarts/lib/component/visualMap/VisualMapView",
        "node_modules/echarts/lib/util/graphic",
        "node_modules/echarts/lib/util/symbol",
        "node_modules/echarts/lib/util/layout",
        "node_modules/echarts/lib/component/visualMap/helper"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/component/visualMapPiecewise": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/echarts",
        "node_modules/echarts/lib/component/visualMap/preprocessor",
        "node_modules/echarts/lib/component/visualMap/typeDefaulter",
        "node_modules/echarts/lib/component/visualMap/visualEncoding",
        "node_modules/echarts/lib/component/visualMap/PiecewiseModel",
        "node_modules/echarts/lib/component/visualMap/PiecewiseView",
        "node_modules/echarts/lib/component/visualMap/visualMapAction"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/lib/component/visualMap": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/component/visualMapContinuous",
        "node_modules/echarts/lib/component/visualMapPiecewise"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/index": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/echarts",
        "node_modules/echarts/lib/export",
        "node_modules/echarts/lib/component/dataset",
        "node_modules/echarts/lib/chart/line",
        "node_modules/echarts/lib/chart/bar",
        "node_modules/echarts/lib/chart/pie",
        "node_modules/echarts/lib/chart/scatter",
        "node_modules/echarts/lib/chart/radar",
        "node_modules/echarts/lib/chart/map",
        "node_modules/echarts/lib/chart/tree",
        "node_modules/echarts/lib/chart/treemap",
        "node_modules/echarts/lib/chart/graph",
        "node_modules/echarts/lib/chart/gauge",
        "node_modules/echarts/lib/chart/funnel",
        "node_modules/echarts/lib/chart/parallel",
        "node_modules/echarts/lib/chart/sankey",
        "node_modules/echarts/lib/chart/boxplot",
        "node_modules/echarts/lib/chart/candlestick",
        "node_modules/echarts/lib/chart/effectScatter",
        "node_modules/echarts/lib/chart/lines",
        "node_modules/echarts/lib/chart/heatmap",
        "node_modules/echarts/lib/chart/pictorialBar",
        "node_modules/echarts/lib/chart/themeRiver",
        "node_modules/echarts/lib/chart/sunburst",
        "node_modules/echarts/lib/chart/custom",
        "node_modules/echarts/lib/component/grid",
        "node_modules/echarts/lib/component/polar",
        "node_modules/echarts/lib/component/geo",
        "node_modules/echarts/lib/component/singleAxis",
        "node_modules/echarts/lib/component/parallel",
        "node_modules/echarts/lib/component/calendar",
        "node_modules/echarts/lib/component/graphic",
        "node_modules/echarts/lib/component/toolbox",
        "node_modules/echarts/lib/component/tooltip",
        "node_modules/echarts/lib/component/axisPointer",
        "node_modules/echarts/lib/component/brush",
        "node_modules/echarts/lib/component/title",
        "node_modules/echarts/lib/component/timeline",
        "node_modules/echarts/lib/component/markPoint",
        "node_modules/echarts/lib/component/markLine",
        "node_modules/echarts/lib/component/markArea",
        "node_modules/echarts/lib/component/legendScroll",
        "node_modules/echarts/lib/component/legend",
        "node_modules/echarts/lib/component/dataZoom",
        "node_modules/echarts/lib/component/dataZoomInside",
        "node_modules/echarts/lib/component/dataZoomSlider",
        "node_modules/echarts/lib/component/visualMap",
        "node_modules/echarts/lib/component/visualMapContinuous",
        "node_modules/echarts/lib/component/visualMapPiecewise",
        "node_modules/zrender/lib/vml/vml",
        "node_modules/zrender/lib/svg/svg"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/extension/dataTool/gexf": {
      "type": "js",
      "deps": [
        "node_modules/zrender/lib/core/util"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/extension/dataTool/prepareBoxplotData": {
      "type": "js",
      "deps": [
        "node_modules/echarts/lib/util/number"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/extension/dataTool/index": {
      "type": "js",
      "deps": [
        "node_modules/echarts/index",
        "node_modules/echarts/extension/dataTool/gexf",
        "node_modules/echarts/extension/dataTool/prepareBoxplotData"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/map/js/china": {
      "type": "js",
      "deps": [
        "node_modules/echarts/index"
      ],
      "pkg": "p2"
    },
    "node_modules/echarts/map/js/world": {
      "type": "js",
      "deps": [
        "node_modules/echarts/index"
      ],
      "pkg": "p2"
    },
    "node_modules/flv.js/dist/flv": {
      "url": "https://bce.bdstatic.com/fex/amis-gh-pages/n/flv.js/dist/flv_d7c9b57.js",
      "type": "js"
    },
    "node_modules/hls.js/dist/hls": {
      "url": "https://bce.bdstatic.com/fex/amis-gh-pages/n/hls.js/dist/hls_9355c57.js",
      "type": "js"
    }
  },
  "pkg": {
    "p5": {
      "url": "https://bce.bdstatic.com/fex/amis-gh-pages/pkg/editor_f7ef16f.js",
      "type": "js"
    },
    "p2": {
      "url": "https://bce.bdstatic.com/fex/amis-gh-pages/pkg/charts_da464ab.js",
      "type": "js"
    }
  }
});