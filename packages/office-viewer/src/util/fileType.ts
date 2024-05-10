/**
 * 自动识别文件类型，只支持少数几种，参考了 file-type 项目里的实现
 */

type Options = {
  offset?: number;
  mask?: number[];
};

type FileType = {
  ext: string;
  mime: string;
};

function check(buffer: Uint8Array, headers: number[], options: Options = {}) {
  const offset = options.offset || 0;

  for (const [index, header] of headers.entries()) {
    // If a bitmask is set
    if (options.mask) {
      // If header doesn't equal `buf` with bits masked off
      if (header !== (options.mask[index] & buffer[index + offset])) {
        return false;
      }
    } else if (header !== buffer[index + offset]) {
      return false;
    }
  }

  return true;
}

function stringToBytes(string: string) {
  return [...string].map(character => character.charCodeAt(0));
}

function checkString(
  buffer: Uint8Array,
  string: string,
  options: Options = {}
) {
  return check(buffer, stringToBytes(string), options);
}

export function fileTypeFromArrayBuffer(
  arrayBuffer: ArrayBuffer
): FileType | null {
  return fileTypeFromBuffer(new Uint8Array(arrayBuffer.slice(0, 20)));
}

export function fileTypeFromBuffer(buffer: Uint8Array): FileType | null {
  if (check(buffer, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) {
    return {ext: 'png', mime: 'image/png'};
  }

  if (check(buffer, [0xff, 0xd8, 0xff])) {
    return {ext: 'jpg', mime: 'image/jpeg'};
  }

  if (check(buffer, [0x47, 0x49, 0x46])) {
    return {ext: 'gif', mime: 'image/gif'};
  }

  if (check(buffer, [0x42, 0x4d])) {
    return {ext: 'bmp', mime: 'image/bmp'};
  }

  if (check(buffer, [0xc5, 0xd0, 0xd3, 0xc6])) {
    return {ext: 'eps', mime: 'application/eps'};
  }

  if (checkString(buffer, '8BPS')) {
    return {ext: 'psd', mime: 'image/vnd.adobe.photoshop'};
  }

  if (checkString(buffer, '%PDF')) {
    return {ext: 'pdf', mime: 'application/pdf'};
  }

  if (checkString(buffer, '<?xml ')) {
    return {
      ext: 'xml',
      mime: 'application/xml'
    };
  }

  if (check(buffer, [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1])) {
    // Detected Microsoft Compound File Binary File (MS-CFB) Format.
    return {
      ext: 'cfb',
      mime: 'application/x-cfb'
    };
  }

  if (check(buffer, [0x50, 0x4b, 0x3, 0x4])) {
    return {
      ext: 'zip',
      mime: 'application/zip'
    };
  }

  return null;
}
