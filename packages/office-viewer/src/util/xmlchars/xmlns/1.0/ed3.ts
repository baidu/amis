/**
 * Character class utilities for XML NS 1.0 edition 3.
 *
 * @author Louis-Dominique Dubeau
 * @license MIT
 * @copyright Louis-Dominique Dubeau
 */

//
// Fragments.
//

// tslint:disable-next-line:max-line-length
export const NC_NAME_START_CHAR =
  'A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u{10000}-\u{EFFFF}';

export const NC_NAME_CHAR = `-${NC_NAME_START_CHAR}.0-9\u00B7\u0300-\u036F\u203F-\u2040`;

//
// Regular expressions.
//

export const NC_NAME_START_CHAR_RE = new RegExp(
  `^[${NC_NAME_START_CHAR}]$`,
  'u'
);

export const NC_NAME_CHAR_RE = new RegExp(`^[${NC_NAME_CHAR}]$`, 'u');

export const NC_NAME_RE = new RegExp(
  `^[${NC_NAME_START_CHAR}][${NC_NAME_CHAR}]*$`,
  'u'
);

/**
 * Determines whether a codepoint matches [[NC_NAME_START_CHAR]].
 *
 * @param c The code point.
 *
 * @returns ``true`` if the codepoint matches.
 */
// tslint:disable-next-line:cyclomatic-complexity
export function isNCNameStartChar(c: number): boolean {
  return (
    (c >= 0x41 && c <= 0x5a) ||
    c === 0x5f ||
    (c >= 0x61 && c <= 0x7a) ||
    (c >= 0xc0 && c <= 0xd6) ||
    (c >= 0xd8 && c <= 0xf6) ||
    (c >= 0x00f8 && c <= 0x02ff) ||
    (c >= 0x0370 && c <= 0x037d) ||
    (c >= 0x037f && c <= 0x1fff) ||
    (c >= 0x200c && c <= 0x200d) ||
    (c >= 0x2070 && c <= 0x218f) ||
    (c >= 0x2c00 && c <= 0x2fef) ||
    (c >= 0x3001 && c <= 0xd7ff) ||
    (c >= 0xf900 && c <= 0xfdcf) ||
    (c >= 0xfdf0 && c <= 0xfffd) ||
    (c >= 0x10000 && c <= 0xeffff)
  );
}

/**
 * Determines whether a codepoint matches [[NC_NAME_CHAR]].
 *
 * @param c The code point.
 *
 * @returns ``true`` if the codepoint matches.
 */
export function isNCNameChar(c: number): boolean {
  return (
    isNCNameStartChar(c) ||
    c === 0x2d ||
    c === 0x2e ||
    (c >= 0x30 && c <= 0x39) ||
    c === 0x00b7 ||
    (c >= 0x0300 && c <= 0x036f) ||
    (c >= 0x203f && c <= 0x2040)
  );
}
