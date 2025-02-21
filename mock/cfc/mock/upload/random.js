/** 测试上传，随机成功 */
module.exports = function(req, res) {
  const pool = [1,2,3,4,5,6,7,8,9,10];
  let result = pool.slice();

  for( let i = 0; i < pool.length; i++) {
    let k = Math.floor(Math.random() * (pool.length - i) + i);
    [result[i], result[k]] = [result[k], result[i]];
  }

  const randomNum = result[0];

  if (randomNum > 5) {
    return res.json({
      status: 0,
      msg: '上传成功',
      data: {
        "value": `http://amis.bj.bcebos.com/amis/random/${randomNum}`,
        "url": `http://amis.bj.bcebos.com/amis/random/${randomNum}`,
        "filename": `random${randomNum}.js`
      }
    });
  }
  else {
    return res.json({
      status: 500,
      msg: '上传失败',
      data: null
    });
  }
}
