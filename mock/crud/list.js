const faker = require('faker');

function repeat(fn, times = 10) {
    let arr = [];
    while (times--) {
        arr.push(fn());
    }

    return arr;
}

module.exports = function(req, res) {
    res.json({
        status: 0,
        msg: '',
        data: repeat(() => ({
                id: '{{random.number}}',
                text: '{{address.city}}',
                progress: Math.round(Math.random() * 100),
                type: Math.round(Math.random() * 5),
                boolean: Math.random() > 0.5 ? true : false,
                // boolean: ['pending', 'success', 'fail', 'queue', 'schedule'][Math.floor(Math.random()*5)],
                list: repeat(() => ({
                    title: '{{name.title}}',
                    description: '{{lorem.words}}'
                }), Math.round(Math.random() * 10)),
                date: Math.round(Date.now() / 1000),
                // image: '{{image.imageUrl}}',
                image: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3893101144,2877209892&fm=23&gp=0.jpg',
            }), parseInt(req.query.perPage, 10) || 10)
            .map(item => {
                try {
                    const str = JSON.stringify(item);
                    item = JSON.parse(faker.fake(str));
                } catch (e) {
                    // continue regardless of error
                }

                item.json = {
                    id: 1,
                    text: 'text'
                };
                return item;
            })
    })
}