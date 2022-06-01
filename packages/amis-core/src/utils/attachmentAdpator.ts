/**
 * 处理接口返回附件的情况，好几个地方用
 * @param response
 * @param __
 * @returns
 */

export function attachmentAdpator(response: any, __: Function) {
  if (response && response.headers && response.headers['content-disposition']) {
    const disposition = response.headers['content-disposition'];
    let filename = '';

    if (disposition && disposition.indexOf('attachment') !== -1) {
      // disposition 有可能是 attachment; filename="??.xlsx"; filename*=UTF-8''%E4%B8%AD%E6%96%87.xlsx
      // 这种情况下最后一个才是正确的文件名
      let filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)$/;

      let matches = disposition.match(filenameRegex);
      if (matches && matches.length) {
        filename = matches[1].replace(`UTF-8''`, '').replace(/['"]/g, '');
      }

      // 很可能是中文被 url-encode 了
      if (filename && filename.replace(/[^%]/g, '').length > 2) {
        filename = decodeURIComponent(filename);
      }

      let type = response.headers['content-type'];
      let blob =
        response.data.toString() === '[object Blob]'
          ? response.data
          : new Blob([response.data], {type: type});
      if (typeof (window.navigator as any).msSaveBlob !== 'undefined') {
        // IE workaround for "HTML7007: One or more blob URLs were revoked by closing the blob for which they were created. These URLs will no longer resolve as the data backing the URL has been freed."
        (window.navigator as any).msSaveBlob(blob, filename);
      } else {
        let URL = window.URL || (window as any).webkitURL;
        let downloadUrl = URL.createObjectURL(blob);
        if (filename) {
          // use HTML5 a[download] attribute to specify filename
          let a = document.createElement('a');
          // safari doesn't support this yet
          if (typeof a.download === 'undefined') {
            (window as any).location = downloadUrl;
          } else {
            a.href = downloadUrl;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
          }
        } else {
          (window as any).location = downloadUrl;
        }
        setTimeout(function () {
          URL.revokeObjectURL(downloadUrl);
        }, 100); // cleanup
      }

      return {
        ...response,
        data: {
          status: 0,
          msg: __('Embed.downloading')
        }
      };
    }
  } else if (response.data && response.data.toString() === '[object Blob]') {
    return new Promise((resolve, reject) => {
      let reader = new FileReader();
      reader.addEventListener('loadend', e => {
        const text = reader.result as string;

        try {
          resolve({
            ...response,
            data: {
              ...JSON.parse(text)
            }
          });
        } catch (e) {
          reject(e);
        }
      });

      reader.readAsText(response.data);
    });
  }

  return response;
}

export default attachmentAdpator;
