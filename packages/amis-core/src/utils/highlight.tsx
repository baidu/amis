import React from 'react';

export function highlight(
  text: string,
  input?: string,
  hlClassName: string = 'is-matched'
) {
  if (!input) {
    return text;
  }

  text = String(text);
  const reg = new RegExp(input.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&'), 'ig');
  if (!reg.test(text)) {
    return text;
  }

  const dom: Array<any> = [];

  let start = 0;
  let match = null;

  reg.lastIndex = 0;
  while ((match = reg.exec(text))) {
    const prev = text.substring(start, match.index);
    prev && dom.push(<span key={dom.length}>{prev}</span>);

    match[0] &&
      dom.push(
        <span className={hlClassName} key={dom.length}>
          {match[0]}
        </span>
      );
    start = match.index + match[0].length;
  }
  const rest = text.substring(start);
  rest && dom.push(<span key={dom.length}>{rest}</span>);

  // const parts = text.split(reg);

  // parts.forEach((text: string, index) => {
  //   text && dom.push(<span key={index}>{text}</span>);
  //   dom.push(
  //     <span className={hlClassName} key={`${index}-hl`}>
  //       {input}
  //     </span>
  //   );
  // });

  // dom.pop();

  return dom;
}
