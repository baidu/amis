const db =  [
    { "label": "Option A", "value": "a",
        "children": [
            { "label": "Option X", "value": "x" },
            { "label": "Option Y", "value": "y" },
            { "label": "Option Z", "value": "z" }
        ]
    },
    { "label": "Option B", "value": "b",
        "collapsed": true,
        "children": [
            { "label": "Option 1", "value": "1" },
            { "label": "Option 2", "value": "2" },
            { "label": "Option 3", "value": "3" }
        ] },
    { "label": "Option C", "value": "c" },
    { "label": "Option D", "value": "d" },
    { "label": "Option E", "value": "e" }
];

function filterDb(db, term) {
    return db
        .map(function(item) {
            const isMatch = ~item.label.indexOf(term);
            const newItem = Object.assign({}, item, {
                collapsed: false
            });

            if (!isMatch && item.children) {
                newItem.children = filterDb(item.children, term);
            }

            return isMatch || newItem.children && newItem.children.length ? newItem : null;
        })
        .filter(function(item) {
            return item;
        });
}


module.exports = function(req, res) {
    const term = req.query.term || '';

    res.json({
        status: 0,
        msg: '',
        data: term ? filterDb(db, term) : db
    });
}