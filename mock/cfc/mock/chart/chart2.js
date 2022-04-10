
function random(a = 1, b = 100, num = 1) {
    if (num === 1) {
        return randomOne();
    } else {
        let arr = [];
        for (let i = 0; i < num; i++) {
            arr.push(randomOne());
        }
        return arr;
    }

    function randomOne() {
        let rand = Math.random();
        return Math.ceil((a + ((b - a) * rand)));
    }
}

module.exports = function (req, res) {
    let data = {
        title: {
            text: '一天用电量分布',
            subtext: '纯属虚构'
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross'
            }
        },
        toolbox: {
            show: true,
            feature: {
                saveAsImage: {}
            }
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: ['00:00', '01:15', '02:30', '03:45', '05:00', '06:15', '07:30', '08:45', '10:00', '11:15', '12:30', '13:45', '15:00', '16:15', '17:30', '18:45', '20:00', '21:15', '22:30', '23:45']
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                formatter: '{value} W'
            },
            axisPointer: {
                snap: true
            }
        },
        visualMap: {
            show: false,
            dimension: 0,
            pieces: [{
                lte: 6,
                color: 'green'
            }, {
                gt: 6,
                lte: 8,
                color: 'red'
            }, {
                gt: 8,
                lte: 14,
                color: 'green'
            }, {
                gt: 14,
                lte: 17,
                color: 'red'
            }, {
                gt: 17,
                color: 'green'
            }]
        },
        series: [
            {
                name: '用电量',
                type: 'line',
                smooth: true,
                data: random(1, 200, 24),
                markArea: {
                    data: [[{
                        name: '早高峰',
                        xAxis: '07:30'
                    }, {
                        xAxis: '10:00'
                    }], [{
                        name: '晚高峰',
                        xAxis: '17:30'
                    }, {
                        xAxis: '21:15'
                    }]]
                }
            }
        ]
    };

    res.json({
        status: 0,
        msg: 'ok',
        data
    });
}