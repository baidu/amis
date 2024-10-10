const db =  [
    {
        "label": "诸葛亮",
        "value": "zhugeliang"
    },

    {
        "label": "王昭君",
        "value": "wangzhaojun"
    },

    {
        "label": "钟馗",
        "value": "zhongkui"
    },

    {
        "label": "露娜",
        "value": "luna"
    },

    {
        "label": "钟无艳",
        "value": "zhongwuyan"
    },

    {
        "label": "花木兰",
        "value": "huamulan"
    }
];


module.exports = function(req, res) {
    const term = req.query.term || '';

    res.json({
        status: 0,
        msg: '',
        data: term ? db.filter(function(item) {
            return term ? ~item.label.indexOf(term) || ~item.value.indexOf(term) : false;
        }) : db
    });
}