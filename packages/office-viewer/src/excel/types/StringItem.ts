import {RichText} from './RichText';

/**
 * String Item，如果是纯文本直接用字符串，这样是为了节省内存，但导致了后面代码都得判断类型
 */
export type StringItem = string | RichText;
