const mockReq = {
  body:{
    book_type: "经典"
  },
  query:{
    stuId:"4"
  }
}; // 模拟 req 对象（空对象即可）
const mockRes = {
  json: (data) => console.log('API Response:', JSON.stringify(data, null, 2))
};

// 导入你的模块
const yourModule = require('./getUserInfo.js'); // 替换为你的文件名

// 调用模块
yourModule(mockReq, mockRes);