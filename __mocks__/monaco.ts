/**
 * monaco 加载没搞定，可能后续会先 mock
 */

export const languages = {
  register: function (language: any) {},
  setMonarchTokensProvider: function (name: any, tokens: any) {},
  registerCompletionItemProvider: function (name: any, provider: any) {}
};

export const editor = {
  defineTheme: function (name: any, theme: any) {},
  create: function (name: any, theme: any) {
    return {
      onDidChangeModelDecorations: () => {
        return {
          dispose: () => {}
        };
      },
      dispose: () => {}
    };
  }
};
