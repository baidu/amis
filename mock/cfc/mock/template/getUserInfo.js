module.exports = function (req, res) {
    let stuId = req.query?.stuId;
    let ret = {};
    if (isNaN(stuId) || stuId < 1 || stuId > data.length) {
        ret = {
            status: 0,
            msg: 'ok',
            data: data[0]
        };
    } else {
        stuId = Number(stuId);
        ret = {
            status: 0,
            msg: 'ok',
            data: data[stuId - 1]
        };
    }
    res.json(ret);


};

const data = [
    {
        "name": "张三",
        "class": "软件工程1班",
        "age": 20,
        "birth": "2005-05-08",
        "phone": "18888888888",
        "email": "zhangsan@example.edu",
        "addr": "北京市海淀区中关村大街1号",
        "sid": "20230001",
        "img": "https://api.dicebear.com/7.x/avataaars/svg?seed=ZhangSan"
    },
    {
        "name": "李四",
        "class": "软件工程2班",
        "age": 21,
        "birth": "2004-03-15",
        "phone": "18888888889",
        "email": "lisi@example.edu",
        "addr": "上海市浦东新区张江高科技园区2号",
        "sid": "20230002",
        "img": "https://api.dicebear.com/7.x/avataaars/svg?seed=LiSi"
    },
    {
        "name": "王五",
        "class": "计算机科学1班",
        "age": 19,
        "birth": "2006-07-22",
        "phone": "18888888890",
        "email": "wangwu@example.edu",
        "addr": "广州市天河区五山路3号",
        "sid": "20230003",
        "img": "https://api.dicebear.com/7.x/avataaars/svg?seed=WangWu"
    },
    {
        "name": "赵六",
        "class": "人工智能1班",
        "age": 20,
        "birth": "2005-11-30",
        "phone": "18888888891",
        "email": "zhaoliu@example.edu",
        "addr": "杭州市西湖区文三路4号",
        "sid": "20230004",
        "img": "https://api.dicebear.com/7.x/avataaars/svg?seed=ZhaoLiu"
    },
    {
        "name": "孙七",
        "class": "网络工程1班",
        "age": 22,
        "birth": "2003-09-10",
        "phone": "18888888892",
        "email": "sunqi@example.edu",
        "addr": "成都市武侯区一环路南一段5号",
        "sid": "20230005",
        "img": "https://api.dicebear.com/7.x/avataaars/svg?seed=SunQi"
    }
].map(function (item, index) {
    return Object.assign({}, item, {
        id: index + 1
    });
});