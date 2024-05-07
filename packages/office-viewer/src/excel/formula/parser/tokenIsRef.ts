import {Token} from '../tokenizer';

export function tokenIsRef(token?: Token) {
  return (
    token &&
    (token.name === 'SHEET' ||
      token.name === 'SHEET_QUOTE' ||
      token.name === 'CELL' ||
      token.name === 'NAME')
  );
}
