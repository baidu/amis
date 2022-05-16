"use strict";
/**
 * 处理接口返回附件的情况，好几个地方用
 * @param response
 * @param __
 * @returns
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
function attachmentAdpator(response, __) {
    if (response && response.headers && response.headers['content-disposition']) {
        var disposition = response.headers['content-disposition'];
        var filename = '';
        if (disposition && disposition.indexOf('attachment') !== -1) {
            // disposition 有可能是 attachment; filename="??.xlsx"; filename*=UTF-8''%E4%B8%AD%E6%96%87.xlsx
            // 这种情况下最后一个才是正确的文件名
            var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)$/;
            var matches = disposition.match(filenameRegex);
            if (matches && matches.length) {
                filename = matches[1].replace("UTF-8''", '').replace(/['"]/g, '');
            }
            // 很可能是中文被 url-encode 了
            if (filename && filename.replace(/[^%]/g, '').length > 2) {
                filename = decodeURIComponent(filename);
            }
            var type = response.headers['content-type'];
            var blob = response.data.toString() === '[object Blob]'
                ? response.data
                : new Blob([response.data], { type: type });
            if (typeof window.navigator.msSaveBlob !== 'undefined') {
                // IE workaround for "HTML7007: One or more blob URLs were revoked by closing the blob for which they were created. These URLs will no longer resolve as the data backing the URL has been freed."
                window.navigator.msSaveBlob(blob, filename);
            }
            else {
                var URL_1 = window.URL || window.webkitURL;
                var downloadUrl_1 = URL_1.createObjectURL(blob);
                if (filename) {
                    // use HTML5 a[download] attribute to specify filename
                    var a = document.createElement('a');
                    // safari doesn't support this yet
                    if (typeof a.download === 'undefined') {
                        window.location = downloadUrl_1;
                    }
                    else {
                        a.href = downloadUrl_1;
                        a.download = filename;
                        document.body.appendChild(a);
                        a.click();
                    }
                }
                else {
                    window.location = downloadUrl_1;
                }
                setTimeout(function () {
                    URL_1.revokeObjectURL(downloadUrl_1);
                }, 100); // cleanup
            }
            return (0, tslib_1.__assign)((0, tslib_1.__assign)({}, response), { data: {
                    status: 0,
                    msg: __('Embed.downloading')
                } });
        }
    }
    else if (response.data && response.data.toString() === '[object Blob]') {
        return new Promise(function (resolve, reject) {
            var reader = new FileReader();
            reader.addEventListener('loadend', function (e) {
                var text = reader.result;
                try {
                    resolve((0, tslib_1.__assign)((0, tslib_1.__assign)({}, response), { data: (0, tslib_1.__assign)({}, JSON.parse(text)) }));
                }
                catch (e) {
                    reject(e);
                }
            });
            reader.readAsText(response.data);
        });
    }
    return response;
}
exports.default = attachmentAdpator;
//# sourceMappingURL=./utils/attachmentAdpator.js.map
