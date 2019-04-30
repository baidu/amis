const db =  [
    {
        "label": "liaoxuezhi",
        "value": "1"
    },

    {
        "label": "zhangjun08",
        "value": "2"
    },

    {
        "label": "zhangtao07",
        "value": "3"
    },

    {
        "label": "wuduoyi",
        "value": "4"
    },

    {
        "label": "liuyiming04",
        "value": "5"
    },

    {
        "label": "zhangzhuobin",
        "value": "6"
    }
];


module.exports = function(req, res) {
    const term = req.query.term || '';

    res.json({
        status: 0,
        msg: '',
        data: term ? db.filter(function(item) {
            return term ? ~item.label.indexOf(term) : false;
        }) : db
    });
}