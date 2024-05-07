/** 将 jc 转成 text-align
 *
 * http://webapp.docx4java.org/OnlineDemo/ecma376/WordML/ST_Jc.html
 */
export function jcToTextAlign(jc: string) {
  switch (jc) {
    case 'start':
    case 'left':
      return 'left';
    case 'center':
      return 'center';
    case 'end':
    case 'right':
      return 'right';
    case 'both':
    case 'distribute':
      return 'justify';
    default:
      return 'left';
  }
}
