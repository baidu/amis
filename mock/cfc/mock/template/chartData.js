module.exports = function (req, res) {
    let book_type = req.body?.book_type;
    if (book_type == '四大名著') {
        res.json({
            status: 0,
            msg: 'ok',
            data: { "xdata": ["四大名著"], "ydata": [4] }
        });
    } else if (book_type == '小说') {
        res.json({
            status: 0,
            msg: 'ok',
            data: { "xdata": ["小说"], "ydata": [5] }
        });
    } else if (book_type == '测试') {
        res.json({
            status: 0,
            msg: 'ok',
            data: { "xdata": ["测试"], "ydata": [1] }
        });
    } else if (book_type == '经典') {
        res.json({
            status: 0,
            msg: 'ok',
            data: { "xdata": ["经典"], "ydata": [1] }
        });
    }else{
        res.json({
            status: 0,
            msg: 'ok',
            data: {
                "xdata": [
                    "四大名著",
                    "小说",
                    "测试",
                    "经典"
                ],
                "ydata": [
                    4,
                    5,
                    1,
                    1
                ]
            }
        });
    }
};
