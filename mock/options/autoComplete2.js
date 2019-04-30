const db =  [
    {
        "label": "liaoxuezhi",
        "value": "liaoxuezhi"
    },

    {
        "label": "zhangjun08",
        "value": "zhangjun08"
    },

    {
        "label": "zhangtao07",
        "value": "zhangtao07"
    },

    {
        "label": "wuduoyi",
        "value": "wuduoyi"
    },

    {
        "label": "liuyiming04",
        "value": "liuyiming04"
    },

    {
        "label": "zhangzhuobin",
        "value": "zhangzhuobin"
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