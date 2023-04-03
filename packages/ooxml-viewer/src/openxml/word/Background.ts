/**
 * 文档背景
 * http://webapp.docx4java.org/OnlineDemo/ecma376/WordML/background.html
 */

export interface DocumentBackground {
  color?: string;
  themeColor?: string;
  themeShade?: string;
  themeTint?: string;

  // TODO: 还不支持 vml
  vml?: any;
}
