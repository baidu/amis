/**
 * 处理接口返回附件的情况，好几个地方用
 * @param response
 * @param __
 * @returns
 */

import {ApiObject} from '../types';
import {saveAs} from 'file-saver';

export function attachmentAdpator(
  response: any,
  __: Function,
  api?: ApiObject
) {
  if (response && response.headers && response.headers['content-disposition']) {
    const disposition = response.headers['content-disposition'];
    let filename = '';

    if (disposition && disposition.indexOf('attachment') !== -1) {
      // 如果 api 中配置了，则优先用 api 中的配置
      if (api?.downloadFileName) {
        filename = api.downloadFileName;
      } else {
        // disposition 有可能是 attachment; filename="??.xlsx"; filename*=UTF-8''%E4%B8%AD%E6%96%87.xlsx
        // 这种情况下最后一个才是正确的文件名
        let filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/i;

        let matches = disposition.match(filenameRegex);
        if (matches && matches.length) {
          filename = matches[1].replace(`UTF-8''`, '').replace(/['"]/g, '');
        } else {
          filename = disposition?.split(';')[1];
        }

        // 很可能是中文被 url-encode 了
        if (filename && filename.replace(/[^%]/g, '').length > 2) {
          filename = decodeURIComponent(filename);
          // 有些后端用错了，导致空格转义成了 +，这里转回来
          filename = filename.replace(/\+/g, ' ');
        }
      }

      let type = response.headers?.['content-type'];
      let blob =
        response.data.toString() === '[object Blob]'
          ? response.data
          : new Blob([response.data], {type: type});

      saveAs(blob, filename);
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
