module.exports = function (req, res) {
    const a = Math.round(Date.now() / (10 * 1000));

    switch (a % 6) {
        case 1:
            return res.json({
                status: 0,
                data: [
                    {
                        label: 'Hive 运算',
                        key: 'hive',
                        status: 1
                    },

                    {
                        label: '小流浪',
                        key: 'partial',
                        status: 0
                    },

                    {
                        label: '全量',
                        key: 'full',
                        status: 0
                    }
                ]
            });

        case 2:
            return res.json({
                status: 0,
                data: [
                    {
                        label: 'Hive 运算',
                        key: 'hive',
                        status: 2
                    },

                    {
                        label: '小流浪',
                        key: 'partial',
                        status: 0
                    },

                    {
                        label: '全量',
                        key: 'full',
                        status: 0
                    }
                ]
            });

        case 3:
            return res.json({
                status: 0,
                data: [
                    {
                        label: 'Hive 运算',
                        key: 'hive',
                        status: 4
                    },

                    {
                        label: '小流浪',
                        key: 'partial',
                        status: 2
                    },

                    {
                        label: '全量',
                        key: 'full',
                        status: 0
                    }
                ]
            });

        case 4:
            return res.json({
                status: 0,
                data: [
                    {
                        label: 'Hive 运算',
                        key: 'hive',
                        status: 4
                    },

                    {
                        label: '小流浪',
                        key: 'partial',
                        status: 4
                    },

                    {
                        label: '全量',
                        key: 'full',
                        status: 2
                    }
                ]
            });

        case 5:
            return res.json({
                status: 0,
                data: [
                    {
                        label: 'Hive 运算',
                        key: 'hive',
                        status: 4
                    },

                    {
                        label: '小流浪',
                        key: 'partial',
                        status: 4
                    },

                    {
                        label: '全量',
                        key: 'full',
                        status: 4
                    }
                ]
            });
    }

    res.json({
        status: 0,
        data: [
            {
                label: 'Hive 运算',
                key: 'hive',
                status: 0
            },

            {
                label: '小流浪',
                key: 'partial',
                status: 0
            },

            {
                label: '全量',
                key: 'full',
                status: 0
            }
        ]
    });
}