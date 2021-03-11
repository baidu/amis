const bosSDK = require('bce-sdk-js');
const fs = require('fs');
const walk = require('fs-walk');
const path = require('path');

const ak = process.env.BOS_AK;
const sk = process.env.BOS_SK;

if (!ak || !sk) {
  console.error('ak and sk is required for deploy cdn!');
  process.exit(1);
}

const config = {
  credentials: {
    ak,
    sk
  },
  endpoint: 'https://bj.bcebos.com',
  bucket: 'bce-cdn'
};
const client = new bosSDK.BosClient(config);
const bucketName = config.bucket || 'bce-cdn';
const prefix = 'fex/';

async function main() {
  const folder = 'gh-pages';
  const productName = 'amis-gh-pages';

  if (!fs.existsSync(folder)) {
    throw new Error('文件夹不存在');
  }

  if (!productName) {
    throw new Error('请指定产品名称');
  }

  const promises = [];
  walk.walkSync(folder, (basedir, filename, stat) => {
    if (stat.isDirectory() || /\.html$/.test(filename)) {
      return;
    }

    const relativePath = path.relative(folder, basedir);

    // 隐藏文件跳过。
    if (/^\./.test(relativePath)) {
      return;
    }

    const objectName = path.join(prefix, productName, relativePath, filename);
    promises.push(() =>
      client
        .putObjectFromFile(bucketName, objectName, path.join(basedir, filename))
        .then(
          () => console.log(` ==> ${objectName}`),
          res => console.error(res)
        )
    );
  });

  if (!promises.length) {
    console.log('Nothing need to upload');
  }

  return promises.reduce((preview, current) => {
    return preview.then(current);
  }, Promise.resolve());
}

main()
  .then(() => console.log('Done!'))
  .catch(e => console.error(e.message, e.stack));
