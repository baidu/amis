

module.exports = function(req, res) {
    const a = req.query.a;

    setTimeout(function() {
        if (!a) {
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
                        label: `选项${a} a`,
                        value: `${a}_a`
                    },
    
                    {
                        label: `选项${a} b`,
                        value: `${a}_b`
                    },
    
                    {
                        label: `选项${a} c`,
                        value: `${a}_c`
                    }
                ]
            }
        })
    }, 1000);
};