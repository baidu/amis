/**
 * from https://github.com/jojoee/bahttext/blob/master/src/index.js
 * Nathachai Thongniran
 * MIT License
 */

const bahtxtConst = {
  defaultResult: 'ศูนย์บาทถ้วน',
  singleUnitStrs: [
    '',
    'หนึ่ง',
    'สอง',
    'สาม',
    'สี่',
    'ห้า',
    'หก',
    'เจ็ด',
    'แปด',
    'เก้า'
  ],
  placeNameStrs: ['', 'สิบ', 'ร้อย', 'พัน', 'หมื่น', 'แสน', 'ล้าน']
};

const GrammarFixs = [
  {pat: /หนึ่งสิบ/g, replace: 'สิบ'},
  {pat: /สองสิบ/g, replace: 'ยี่สิบ'},
  {pat: /สิบหนึ่ง/g, replace: 'สิบเอ็ด'}
];

/**
 * @private
 * @param {number[]} nums
 * @returns {string}
 */
function bahtxtNum2Word(nums: number[]): string {
  let result = '';
  const len = nums.length;
  const maxLen = 7;

  if (len > maxLen) {
    // more than million
    const overflowIndex = len - maxLen + 1;
    const overflowNums = nums.slice(0, overflowIndex);
    const remainingNumbs = nums.slice(overflowIndex);
    return (
      bahtxtNum2Word(overflowNums) + 'ล้าน' + bahtxtNum2Word(remainingNumbs)
    );
  } else {
    for (const num in nums) {
      const digit = nums[num];
      if (digit > 0) {
        result +=
          bahtxtConst.singleUnitStrs[digit] +
          bahtxtConst.placeNameStrs[len - parseInt(num) - 1];
      }
    }
  }

  return result;
}

/**
 * @private
 * @todo improve performance
 * @param {string} str
 * @returns {string}
 */
function bahtxtGrammarFix(str: string) {
  for (const GrammarFix of GrammarFixs) {
    str = str.replace(GrammarFix.pat, GrammarFix.replace);
  }
  return str;
}

/**
 * bahtxtCombine baht and satang
 * and also adding unit
 *
 * @private
 * @param {string} baht
 * @param {string} satang
 * @returns {string}
 */
function bahtxtCombine(baht: string, satang: string) {
  if (!baht && !satang) {
    return bahtxtConst.defaultResult;
  } else if (baht && !satang) {
    return baht + 'บาท' + 'ถ้วน';
  } else if (!baht && satang) {
    return satang + 'สตางค์';
  } else {
    return baht + 'บาท' + satang + 'สตางค์';
  }
}

/**
 * Change number to Thai pronunciation string
 *
 * @public
 * @param {number} num
 * @returns {string}
 */
export function bahttext(num: number): string {
  if (
    !num || // no null
    typeof num === 'boolean' || // no boolean
    isNaN(Number(num)) || // must be number only
    num < Number.MIN_SAFE_INTEGER || // not less than Number.MIN_SAFE_INTEGER
    num > Number.MAX_SAFE_INTEGER // no more than Number.MAX_SAFE_INTEGER
  ) {
    return bahtxtConst.defaultResult;
  }

  // set
  const positiveNum = Math.abs(num);

  // split baht and satang e.g. 432.214567 >> 432, 21
  const bahtStr = Math.floor(positiveNum).toString();
  /** @type {string} */
  const satangStr = ((positiveNum % 1) * 100).toFixed(0);

  /** @type {number[]} */
  const bahtArr = Array.from(bahtStr).map(Number);
  /** @type {number[]} */
  const satangArr = Array.from(satangStr).map(Number);

  // proceed
  let baht = bahtxtNum2Word(bahtArr);
  let satang = bahtxtNum2Word(satangArr);

  // grammar
  baht = bahtxtGrammarFix(baht);
  satang = bahtxtGrammarFix(satang);

  // combine
  const result = bahtxtCombine(baht, satang);

  return num >= 0 ? result : 'ลบ' + result;
}
