import {ST_TblWidth} from './../openxml/Types';
import {parseSize, LengthUsage} from './parseSize';

/**
 * http://officeopenxml.com/WPtableWidth.php
 */
export function parseTblWidth(element: Element) {
  const type = element.getAttribute('w:type') as ST_TblWidth;
  if (!type || type === 'dxa') {
    return parseSize(element, 'w:w');
  } else if (type === 'pct') {
    return parseSize(element, 'w:w', LengthUsage.Percent);
  } else if (type === 'auto') {
    return 'auto';
  } else {
    console.warn('parseTblWidth: ignore type', type, element);
  }
  return '';
}
