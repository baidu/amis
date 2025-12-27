

module.exports = function(req, res) {
    const level = parseInt(req.query.level, 10) || 0;
    const maxLevel = parseInt(req.query.maxLevel, 10) || 0;
    if (level >= maxLevel) {
        res.json({
            status: 0,
            data: null
        })
    } else {
        res.json({
        status: 0,
        data: [
            {
            label: `A ${level}`,
            value: 'a'
            },

            {
            label: `B ${level}`,
            value: 'b'
            },

            {
            label: `C ${level}`,
            value: 'c'
            },

            {
            label: `D ${level}`,
            value: 'd'
            }
        ]
        })
    }
}