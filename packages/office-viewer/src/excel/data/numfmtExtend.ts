/**
 * 应对 numfmt 不识别的情况
 */

import {amountInWords} from './numfmt/amountInWords';

export function numfmtExtend(formatCode?: string) {
  const numfmtInstance = function (val: string) {
    switch (formatCode) {
      case '[DBNum2][$RMB]General;[Red][DBNum2][$RMB]General':
        const num = parseFloat(val);
        if (isNaN(num)) {
          return val;
        }
        return amountInWords(parseFloat(num.toFixed(2)));
      default:
        console.warn('numfmtExtend: formatCode not found', formatCode);
        return val;
    }
  };

  numfmtInstance.isDate = () => {
    return false;
  };

  numfmtInstance.info = {
    color: 0
  };

  return numfmtInstance;
}
