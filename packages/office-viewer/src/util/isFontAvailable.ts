/**
 * 检查字体是否可用，来自 https://www.samclarke.com/javascript-is-font-available/
 * 这个检查只检查宽度，并不完全准确
 */

const testString = Array(15).join('abcdefghijklmnopqrstuvwxyz0123456789中');

export const isFontAvailable = (function () {
  // 测试环境
  if (!document) {
    return () => true;
  }
  const body = document.body;

  const container = document.createElement('span');
  container.innerHTML = testString;
  container.style.cssText = [
    'position:absolute',
    'width:auto',
    'font-size:128px',
    'left:-99999px'
  ].join(' !important;');

  const getWidth = function (fontFamily: string) {
    container.style.fontFamily = fontFamily;

    body.appendChild(container);
    const width = container.clientWidth;
    body.removeChild(container);

    return width;
  };

  const monoWidth = getWidth('monospace');
  const serifWidth = getWidth('serif');
  const sansWidth = getWidth('sans-serif');

  return (font: string) => {
    return (
      monoWidth !== getWidth(font + ',monospace') ||
      sansWidth !== getWidth(font + ',sans-serif') ||
      serifWidth !== getWidth(font + ',serif')
    );
  };
})();
