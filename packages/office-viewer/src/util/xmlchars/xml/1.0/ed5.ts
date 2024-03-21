/**
 * Character classes and associated utilities for the 5th edition of XML 1.0.
 *
 * @author Louis-Dominique Dubeau
 * @license MIT
 * @copyright Louis-Dominique Dubeau
 */

//
// Fragments.
//
export const CHAR = '\t\n\r\u0020-\uD7FF\uE000-\uFFFD\u{10000}-\u{10FFFF}';

export const S = ' \t\r\n';

// tslint:disable-next-line:max-line-length
export const NAME_START_CHAR =
  ':A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u{10000}-\u{EFFFF}';

export const NAME_CHAR = `-${NAME_START_CHAR}.0-9\u00B7\u0300-\u036F\u203F-\u2040`;

//
// Regular expressions.
//

export const CHAR_RE = new RegExp(`^[${CHAR}]$`, 'u');

export const S_RE = new RegExp(`^[${S}]+$`, 'u');

export const NAME_START_CHAR_RE = new RegExp(`^[${NAME_START_CHAR}]$`, 'u');

export const NAME_CHAR_RE = new RegExp(`^[${NAME_CHAR}]$`, 'u');

export const NAME_RE = new RegExp(`^[${NAME_START_CHAR}][${NAME_CHAR}]*$`, 'u');

export const NMTOKEN_RE = new RegExp(`^[${NAME_CHAR}]+$`, 'u');

const TAB = 9;
const NL = 0xa;
const CR = 0xd;
const SPACE = 0x20;

//
// Lists.
//

/** All characters in the ``S`` production. */
export const S_LIST = [SPACE, NL, CR, TAB];

/**
 * Determines whether a codepoint matches the ``CHAR`` production.
 *
 * @param c The code point.
 *
 * @returns ``true`` if the codepoint matches ``CHAR``.
 */
export function isChar(c: number): boolean {
  return (
    (c >= SPACE && c <= 0xd7ff) ||
    c === NL ||
    c === CR ||
    c === TAB ||
    (c >= 0xe000 && c <= 0xfffd) ||
    (c >= 0x10000 && c <= 0x10ffff)
  );
}

/**
 * Determines whether a codepoint matches the ``S`` (space) production.
 *
 * @param c The code point.
 *
 * @returns ``true`` if the codepoint matches ``S``.
 */
export function isS(c: number): boolean {
  return c === SPACE || c === NL || c === CR || c === TAB;
}

/**
 * Determines whether a codepoint matches the ``NAME_START_CHAR`` production.
 *
 * @param c The code point.
 *
 * @returns ``true`` if the codepoint matches ``NAME_START_CHAR``.
 */
export function isNameStartChar(c: number): boolean {
  return (
    (c >= 0x41 && c <= 0x5a) ||
    (c >= 0x61 && c <= 0x7a) ||
    c === 0x3a ||
    c === 0x5f ||
    c === 0x200c ||
    c === 0x200d ||
    (c >= 0xc0 && c <= 0xd6) ||
    (c >= 0xd8 && c <= 0xf6) ||
    (c >= 0x00f8 && c <= 0x02ff) ||
    (c >= 0x0370 && c <= 0x037d) ||
    (c >= 0x037f && c <= 0x1fff) ||
    (c >= 0x2070 && c <= 0x218f) ||
    (c >= 0x2c00 && c <= 0x2fef) ||
    (c >= 0x3001 && c <= 0xd7ff) ||
    (c >= 0xf900 && c <= 0xfdcf) ||
    (c >= 0xfdf0 && c <= 0xfffd) ||
    (c >= 0x10000 && c <= 0xeffff)
  );
}

/**
 * Determines whether a codepoint matches the ``NAME_CHAR`` production.
 *
 * @param c The code point.
 *
 * @returns ``true`` if the codepoint matches ``NAME_CHAR``.
 */
export function isNameChar(c: number): boolean {
  return (
    isNameStartChar(c) ||
    (c >= 0x30 && c <= 0x39) ||
    c === 0x2d ||
    c === 0x2e ||
    c === 0xb7 ||
    (c >= 0x0300 && c <= 0x036f) ||
    (c >= 0x203f && c <= 0x2040)
  );
}
