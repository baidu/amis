function loadIframeImages(images: HTMLImageElement[]) {
  const promises = images.map(async image => {
    if (image.src && image.src !== window.location.href) {
      await loadIframeImage(image);
    }
  });

  return Promise.all(promises);
}

function loadIframeImage(image: HTMLImageElement) {
  return new Promise<void>(resolve => {
    const pollImage = () => {
      !image ||
      typeof image.naturalWidth === 'undefined' ||
      image.naturalWidth === 0 ||
      !image.complete
        ? setTimeout(pollImage, 500)
        : resolve();
    };
    pollImage();
  });
}

function performPrint(iframe: HTMLIFrameElement) {
  iframe.contentWindow?.print();
  iframe.parentNode?.removeChild(iframe);
}

/**
 * 打印 iframe，参考了 print.js 里的部分实现
 * @param iframe
 */
export function printIframe(iframe: HTMLIFrameElement) {
  const printDocument = iframe.contentDocument!;
  // If printing images, wait for them to load inside the iframe
  const images = printDocument.getElementsByTagName('img');

  if (images.length > 0) {
    loadIframeImages(Array.from(images)).then(() => performPrint(iframe));
  } else {
    performPrint(iframe);
  }
}
