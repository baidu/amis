

module.exports = function(req, res) {
    const b = req.query.b;

    setTimeout(function() {
        if (!b || ~b.indexOf('c')) {
            return res.json({
                status: 0,
                msg: '',
                data: {
                    options: []
                }
            });
        }
    
        res.json({
            status: 0,
            msg: 'ok',
            data: {
                options: [
                    {
                        label: `选项${b} x`,
                        value: `${b}_x`
                    },
    
                    {
                        label: `选项${b} y`,
                        value: `${b}_y`
                    },
    
                    {
                        label: `选项${b} z`,
                        value: `${b}_z`
                    }
                ]
            }
        })
    }, 1000);
};