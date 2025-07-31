module.exports = function(req, res) {
    res.json({
        status: 0,
        msg: '',
        data: {
            finished: Math.random() > 0.5
        }
    });
}